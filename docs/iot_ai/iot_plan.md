# YOLO Interaction Trigger — System Implementation Guide

## Overview

This system uses a YOLO-based computer vision pipeline to detect hand-to-object interactions on camera and automatically records a 15-second video clip (5 seconds before and 10 seconds after the trigger) when a collision is detected. Clips are saved locally and uploaded to S3 when internet is available.

---

## Architecture

The system runs three concurrent threads to prevent camera stream freezing:

| Thread | Role |
|---|---|
| **Main Thread** | Reads the camera stream, compresses frames into the Ring Buffer, and runs YOLO inference on every frame |
| **Writer Thread** | Wakes on trigger, drains the Ring Buffer for the 5-second lookback, then records the next 10 seconds of live video |
| **Uploader Thread** | Background daemon that monitors a SQLite queue and uploads completed clips to S3 |

---

## Modules

### 1. Dataset Preparation

The model was trained on three distinct classes only — Hand (0), Flower (1), and Animal (2). Standard pre-trained YOLO models were not usable because they know specific breeds and species, not generic categories like "Animal."

The flower and animal images came from an existing internal set of approximately 1,500 images. Since no hand images were available, an open-source hand-tracking dataset was sourced from Roboflow Universe and merged into the same project to form a single master dataset.

All bounding boxes were labelled under these three classes regardless of the specific subject — a cat, dog, or monkey would all be tagged as Animal. This keeps the model lightweight and ensures the class IDs align exactly with the collision logic.

Before export, Roboflow applied data augmentation at a 3x multiplier. This is not an error — it is a standard technique where the platform generates synthetic variations of each image by rotating, mirroring, and adjusting brightness. This expanded the dataset from roughly 1,500 images to approximately 6,000, significantly improving the model's ability to generalise to real-world conditions.

---

### 2. Training Environment

Training requires Python 3.11 in an isolated virtual environment. Python 3.13 is not supported by PyTorch and must not be used. If both versions are installed on the same machine, the environment will default to the wrong one unless explicitly managed.

The virtual environment must be created and activated before installing any dependencies, so that GPU-enabled PyTorch is fully isolated from any system-level Python installations.

GPU training was run on a GTX 1650 with 4GB of VRAM. The batch size was locked to 4 to avoid out-of-memory crashes. Increasing this on lower-VRAM machines will cause training to fail.

CUDA 11.8 is the required version. Installing PyTorch with a CUDA 12.6 tag will silently downgrade to a CPU-only build, resulting in 0% GPU utilisation during training with no obvious error message.

---

### 3. Ring Buffer (Lookback Recorder)

The Ring Buffer holds 5 seconds of video in RAM at all times. Each incoming frame is compressed to JPEG before being stored, keeping total RAM usage to approximately 30MB. The buffer automatically discards the oldest frames as new ones arrive.

When a collision is detected, a background thread drains the 5-second buffer and then continues recording the next 10 seconds of live video, producing a single seamless 15-second clip. To avoid opening a second camera connection (which would crash the webcam), the live recording thread reads from a shared frame holder — a simple dictionary that the main camera loop continuously updates with the latest frame.

A 10-second cooldown is applied after each save to prevent back-to-back triggers.

---

### 4. YOLO Inference & Collision Logic

YOLO runs on every other frame. The frame-skipping approach could cause bounding boxes to flicker on and off, so consider removing if hardware allows.

Detected bounding boxes are drawn directly onto the live video feed using the built-in plot function, which renders labels and confidence scores automatically.

The collision logic went through three iterations before reaching its current state:

**Version 1 — Center-to-center distance:** Calculated the midpoint of the Hand box and the midpoint of the target box and measured the distance between them. This failed because a hand placed directly over a flower still produced a large center-to-center distance.

**Version 2 — Edge-to-edge distance:** Rewrote the calculation to measure the distance between the outer edges of the rectangles rather than their centers. This was more accurate, but introduced the occlusion problem: when a hand physically covered a flower, YOLO lost visibility of the flower's features, dropped its confidence score, and removed the bounding box entirely. No box meant no collision could be detected. This was resolved by lowering YOLO's confidence threshold from 0.4 to 0.25, forcing the model to retain bounding boxes for partially obscured objects.

**Version 3 — Edge distance plus overlap check (current):** Added an IoU (Intersection over Union) check alongside the edge distance. A collision now triggers if the edge distance is small OR if the bounding boxes overlap by even 1%. A visual debug line is drawn on screen showing the exact pixel distance in real time, making it possible to tune the trigger threshold without guessing.


---

### 5. Video Encoding

All video files are encoded using FFmpeg with the H.264 codec. The earlier approach of using OpenCV's built-in video writer was replaced for two reasons:

File sizes with the old codec were 20–30MB for a 15-second clip. H.264 encoding reduces this by approximately 65%.

Browsers and mobile devices require a video file's metadata to be located at the beginning of the file in order to begin playback immediately. The old approach wrote metadata at the end, causing a black screen when clips were opened via S3 or a web frontend. FFmpeg is configured to move the metadata to the front of the file, so clips play instantly without any post-processing step.

Raw frames are piped directly from the recording thread into FFmpeg running as a background process, so no intermediate files are written to disk.

---

### 6. Offline-Resilient S3 Uploader

After a clip is saved to disk, its file path is registered in a local SQLite database under a pending uploads table. A background thread wakes every 15 seconds, checks for internet connectivity by pinging AWS, and processes any pending entries. For each pending file, it uploads to the configured S3 bucket, deletes the local copy to free disk space, and marks the entry as uploaded in the database. If an upload fails, the entry is left unmarked and will be retried on the next cycle.

---

## Configuration Reference

| Parameter | Default | Description |
|---|---|---|
| Camera Index | 0 | Camera index or RTSP URL for an IP camera |
| Model Path | best.pt | Path to the trained YOLO model file |
| FPS | 30 | Camera capture frame rate |
| Lookback Duration | 5 seconds | How much past footage is retained in the buffer |
| Future Recording Duration | 10 seconds | How long to record after a trigger |
| Clip Directory | ./saved_clips | Local folder where video clips are stored |
| S3 Bucket | — | Target S3 bucket name |
| Confidence Threshold | 0.4 | Minimum YOLO confidence to retain a bounding box |

---

## Deployment Checklist

- [ ] **Verify class ID alignment** — check the exported data file and confirm that Hand, Flower, and Animal map to the correct numeric IDs in the detection code
- [ ] **Calibrate the collision distance threshold** — run the system and observe the real-time pixel distance overlay before setting a final value
- [ ] **Configure AWS credentials** — the host machine needs an IAM credential with S3 write permission on the target bucket, set via the AWS CLI or environment variables
- [ ] **Add a disk space safeguard** — if the device goes offline for extended periods, the saved clips folder can fill up and crash the OS; implement a check that auto-deletes the oldest clips when disk usage exceeds 85%
