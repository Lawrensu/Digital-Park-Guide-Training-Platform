import cv2
import numpy as np
import math
import time
import os
import threading
import subprocess
from collections import deque


class CollisionDetector:
    def __init__(self, model_path):
        from ultralytics import YOLO
        print("[System] Loading YOLO model...")
        self.model = YOLO(model_path)
        
        self.HAND_CLASS = 2
        self.TARGET_CLASSES = [0, 1] 

        self.EDGE_DISTANCE_THRESHOLD = 150 

    def check_frame(self, frame):
        results = self.model(frame, conf=0.4, verbose=False)[0]
        annotated_frame = results.plot() 
        
        boxes = results.boxes
        collision = False

        if boxes.xyxy is not None and len(boxes.xyxy) > 0:
            bboxes = boxes.xyxy.cpu().numpy()
            classes = boxes.cls.cpu().numpy()

            hands = bboxes[np.isin(classes, self.HAND_CLASS)]
            targets = bboxes[np.isin(classes, self.TARGET_CLASSES)]

            if len(hands) > 0 and len(targets) > 0:
                for hand in hands:
                    hx = int((hand[0] + hand[2]) / 2)
                    hy = int((hand[1] + hand[3]) / 2)
                    
                    for target in targets:
                        tx = int((target[0] + target[2]) / 2)
                        ty = int((target[1] + target[3]) / 2)
                        
                        iou = self._calculate_iou(hand, target)
                        dist = self._box_edge_distance(hand, target)
                        
                        if dist < self.EDGE_DISTANCE_THRESHOLD + 50:
                            # Green line if close, if in range but not too close yet then red
                            color = (0, 255, 0) if dist < self.EDGE_DISTANCE_THRESHOLD else (0, 0, 255)
                            cv2.line(annotated_frame, (hx, hy), (tx, ty), color, 3)
                            # Shows the distance in pixels just for the test.
                            cv2.putText(annotated_frame, f"{int(dist)}px", (hx, hy - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

                        if iou > 0.0 or dist < self.EDGE_DISTANCE_THRESHOLD:
                            collision = True
                            break
                            
                    if collision:
                        break
        
        return collision, annotated_frame

    def _box_edge_distance(self, box1, box2):
        x1_min, y1_min, x1_max, y1_max = box1
        x2_min, y2_min, x2_max, y2_max = box2
        dx = max(x1_min - x2_max, x2_min - x1_max, 0)
        dy = max(y1_min - y2_max, y2_min - y1_max, 0)
        return math.sqrt(dx*dx + dy*dy)

    def _calculate_iou(self, box1, box2):
        x_left = max(box1[0], box2[0])
        y_top = max(box1[1], box2[1])
        x_right = min(box1[2], box2[2])
        y_bottom = min(box1[3], box2[3])

        if x_right < x_left or y_bottom < y_top:
            return 0.0

        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
        box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
        union_area = float(box1_area + box2_area - intersection_area)
        
        return intersection_area / union_area

class RingBufferRecorder:
    def __init__(self, fps=30, lookback_secs=5, forward_secs=10, output_dir="saved_clips"):
        self.fps = fps
        self.max_frames = fps * lookback_secs  
        self.forward_secs = forward_secs        
        self.buffer = deque(maxlen=self.max_frames)
        self.is_saving = False
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.lock = threading.Lock()

    def update_buffer(self, frame):
        _, encoded_img = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        with self.lock:
            self.buffer.append(encoded_img.tobytes())

    def trigger_save(self, live_frame_holder):
        if self.is_saving:
            return False
        self.is_saving = True
        threading.Thread(target=self._save_to_disk, args=(live_frame_holder,), daemon=True).start()
        return True

    def _save_to_disk(self, live_frame_holder):
        start_time = time.time()
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.output_dir, f"trigger_{timestamp}.mp4")
        
        with self.lock:
            frames_to_save = list(self.buffer)
            
        if not frames_to_save:
            self.is_saving = False
            return

        first_frame = cv2.imdecode(np.frombuffer(frames_to_save[0], dtype=np.uint8), 1)
        h, w = first_frame.shape[:2]
        
        print(f"\n[RECORDER] Starting FFmpeg H.264 encoding for {filename}...")

        command = [
            'ffmpeg.exe',          
            '-y',
            '-f', 'rawvideo',
            '-vcodec', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', f'{w}x{h}',
            '-r', str(self.fps),
            '-i', '-',
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '28',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            filename
        ]

        try:
            # Start FFmpeg as a background process so that we can straight pipe it
            process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

            # 5 seconds before the trigger (the ring buffer)
            for jpeg_bytes in frames_to_save:
                frame = cv2.imdecode(np.frombuffer(jpeg_bytes, dtype=np.uint8), 1)
                process.stdin.write(frame.tobytes())

            # 10 seconds after the trigger
            future_start_time = time.time()
            while (time.time() - future_start_time) < self.forward_secs:
                live_frame = live_frame_holder.get("frame")
                if live_frame is not None:
                    process.stdin.write(live_frame.tobytes())
                time.sleep(1.0 / self.fps)
            
            process.stdin.close()
            process.wait()
            print(f"[RECORDER] Finished H.264 clip in {time.time() - start_time:.2f}s (Web-Ready!)\n")

        except Exception as e:
            print(f"[RECORDER] ERROR: Make sure ffmpeg.exe is in your project folder! Details: {e}")

        time.sleep(5) 
        self.is_saving = False


def main():
    MODEL_PATH = "best.pt"      
    CAMERA_INDEX = 0            
    FPS = 30
    SKIP_FRAMES = 2

    detector = CollisionDetector(MODEL_PATH)
    recorder = RingBufferRecorder(fps=FPS, lookback_secs=5, forward_secs=10)

    cap = cv2.VideoCapture(CAMERA_INDEX)
    cap.set(cv2.CAP_PROP_FPS, FPS)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    if not cap.isOpened():
        print("ERROR: Could not open webcam.")
        return

    live_frame_holder = {"frame": None}
    frame_count = 0
    print("\n[System] RUNNING")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Constantly update the live frame so that we can record the future frames after a trigger
            live_frame_holder["frame"] = frame

            # Logic for checking how many frames to skip save on resources
            if frame_count % SKIP_FRAMES == 0:
                # Run YOLO and get boxes + collision status
                collision, annotated_frame = detector.check_frame(frame)
                
                if collision and recorder.trigger_save(live_frame_holder):
                    print("[TRIGGER] COLLISION DETECTED! Recording 15 seconds...")
            else:
                # If we skipped YOLO on this frame, then just use the raw camera feed
                annotated_frame = frame

            # Add to buffer
            recorder.update_buffer(annotated_frame)

            cv2.imshow("YOLO Interaction Demo (Press 'q' to quit)", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            frame_count += 1

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("\n[System] Shut down cleanly.")

if __name__ == "__main__":
    main()