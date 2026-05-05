// src/screens/ContentViewerScreen.js
// Renders all content types: TEXT, IMAGE, VIDEO, HOTSPOT, SCENARIO, STEPPER, QUIZ
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  Dimensions, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';
import { updateProgress } from '../services/apiService';

const { width: SW } = Dimensions.get('window');

// ─── Mock content items ───────────────────────────────────────────────
// In production: GET /api/modules/:id/content
const MOCK_CONTENT = [
  {
    id: 1, type: 'TEXT', order: 1,
    title: 'Why Rainforests Matter',
    content: 'Tropical rainforests are among the most biodiverse ecosystems on Earth, covering only 6% of the land surface yet supporting more than half of all known species.\n\nAs a park guide, your role extends far beyond navigation — you are a frontline conservation officer. Every interaction you have with a visitor is an opportunity to inspire action for nature.\n\nKey Facts:\n• Rainforests absorb 1.5 billion tonnes of CO₂ annually\n• Deforestation contributes to 15% of global greenhouse gases\n• Over 25% of modern medicines originate from rainforest plants',
  },
  {
    id: 2, type: 'IMAGE', order: 2,
    title: 'Rainforest Canopy Layers',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    caption: 'The four distinct layers of a tropical rainforest: emergent, canopy, understory, and forest floor.',
  },
  {
    id: 3, type: 'VIDEO', order: 3,
    title: 'Wildlife Tracking Techniques',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    allowOffline: true,
    duration: '18 min',
    thumbnail: 'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
  },
  {
    id: 4, type: 'INFOGRAPHIC', subtype: 'HOTSPOT', order: 4,
    title: 'Anatomy of a Rainforest Tree',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
    hotspots: [
      { id: 1, x: 0.25, y: 0.15, label: 'Emergent Crown', description: 'The topmost layer reaching 40-70m. These giants host eagles, harpy hawks, and morpho butterflies.' },
      { id: 2, x: 0.60, y: 0.45, label: 'Buttress Roots', description: 'Large flat roots extending outward to stabilise the tree in shallow tropical soils. Can span 10 metres in diameter.' },
      { id: 3, x: 0.40, y: 0.70, label: 'Epiphytes', description: 'Plants like orchids and bromeliads that grow on the tree without being parasitic, absorbing moisture from air and rain.' },
    ],
  },
  {
    id: 5, type: 'INFOGRAPHIC', subtype: 'SCENARIO', order: 5,
    title: 'Handling a Visitor Wildlife Encounter',
    startNode: 'start',
    nodes: {
      start: {
        text: 'A visitor spots a wild boar on the trail 20 metres ahead. What do you do?',
        choices: [
          { label: 'Stop the group, stay calm, observe quietly', next: 'calm' },
          { label: 'Shout loudly to scare it away', next: 'shout' },
          { label: 'Move the group closer for a better look', next: 'closer' },
        ],
      },
      calm: {
        text: '✅ Correct! You stop the group and observe quietly. The boar sniffs the air and moves off the trail on its own. This is the safest approach — wild boars are rarely aggressive unless surprised or cornered.',
        choices: [{ label: 'Continue to next scenario', next: null }],
        correct: true,
      },
      shout: {
        text: '⚠️ Not ideal. Shouting may startle the boar and cause it to charge defensively. Always remain calm and keep voices low near wildlife.',
        choices: [{ label: 'Try again', next: 'start' }],
        correct: false,
      },
      closer: {
        text: '❌ Dangerous. Moving closer to a wild boar, especially if it has young nearby, risks provoking an attack. Always maintain a safe distance of at least 20 metres.',
        choices: [{ label: 'Try again', next: 'start' }],
        correct: false,
      },
    },
  },
  {
    id: 6, type: 'INFOGRAPHIC', subtype: 'STEPPER', order: 6,
    title: 'Emergency First Aid: Snakebite Response',
    steps: [
      {
        id: 1,
        title: 'Step 1 — Stay Calm',
        content: 'Keep the victim calm and still. Panic increases heart rate which speeds venom circulation. Speak calmly and reassure the victim.',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
      },
      {
        id: 2,
        title: 'Step 2 — Immobilise the Limb',
        content: 'Splint the affected limb at heart level. Remove rings, watches, or tight clothing near the bite. Do NOT apply a tourniquet.',
        imageUrl: null,
      },
      {
        id: 3,
        title: 'Step 3 — Document & Identify',
        content: 'Note the time of the bite. If safely possible, photograph the snake from a distance for species identification. Do NOT attempt to catch or kill it.',
        imageUrl: null,
      },
      {
        id: 4,
        title: 'Step 4 — Evacuate Immediately',
        content: 'Call for emergency evacuation. Antivenin is the only definitive treatment and must be administered at a medical facility. Carry the victim — do not let them walk.',
        imageUrl: 'https://images.unsplash.com/photo-1531969179221-3f9c6ae79b03?w=400&q=80',
      },
    ],
  },
];

// ─── Content renderers ────────────────────────────────────────────────

const TextContent = ({ item }) => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 16, fontFamily: FONTS.title }}>
      {item.title}
    </Text>
    {item.content.split('\n').map((line, i) => (
      <Text key={i} style={{
        fontSize: 15, color: '#374151', lineHeight: 26,
        fontFamily: FONTS.body,
        marginBottom: line === '' ? 8 : 0,
        fontWeight: line.startsWith('Key Facts') || line.startsWith('•') ? '400' : '400',
      }}>
        {line}
      </Text>
    ))}
  </View>
);

const ImageContent = ({ item, onComplete }) => {
  const [zoomed, setZoomed] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => { setZoomed(!zoomed); onComplete(); }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: SW, height: zoomed ? SW * 1.2 : SW * 0.65 }}
          resizeMode={zoomed ? 'contain' : 'cover'}
        />
      </TouchableOpacity>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8, fontFamily: FONTS.title }}>
          {item.title}
        </Text>
        {item.caption && (
          <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 20, fontFamily: FONTS.body }}>
            {item.caption}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => setZoomed(!zoomed)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}
        >
          <Ionicons name={zoomed ? 'contract-outline' : 'expand-outline'} size={16} color="#16a34a" />
          <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>
            {zoomed ? 'Collapse' : 'Tap to zoom'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VideoContent = ({ item, isOnline, onComplete }) => {
  const [played, setPlayed] = useState(false);
  if (!isOnline && !item.allowOffline) {
    return (
      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: '#fef3c7', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="cloud-offline-outline" size={22} color="#d97706" />
          <Text style={{ flex: 1, fontSize: 13, color: '#92400e', fontFamily: FONTS.body }}>
            This video is unavailable offline. Connect to the internet to watch it.
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View>
      <TouchableOpacity
        onPress={() => { setPlayed(true); onComplete(); Alert.alert('Video', 'Video playback requires expo-av in a native build.'); }}
        style={{ position: 'relative' }}
      >
        <Image source={{ uri: item.thumbnail }} style={{ width: SW, height: 220 }} resizeMode="cover" />
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="play" size={30} color="#15803d" style={{ marginLeft: 4 }} />
          </View>
          <Text style={{ color: '#fff', fontSize: 13, marginTop: 10, fontFamily: FONTS.body }}>{item.duration}</Text>
          {item.allowOffline && (
            <View style={{ marginTop: 6, backgroundColor: 'rgba(21,128,61,0.8)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', fontFamily: FONTS.label }}>📴 Available Offline</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>{item.title}</Text>
        {played && <Text style={{ fontSize: 12, color: '#16a34a', marginTop: 6, fontFamily: FONTS.body }}>✓ Watched</Text>}
      </View>
    </View>
  );
};

const HotspotContent = ({ item, onComplete }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [viewed, setViewed] = useState(new Set());
  const imgHeight = SW * 0.75;

  const handleHotspot = (hotspot) => {
    setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot);
    const newViewed = new Set(viewed).add(hotspot.id);
    setViewed(newViewed);
    if (newViewed.size === item.hotspots.length) onComplete();
  };

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.imageUrl }} style={{ width: SW, height: imgHeight }} resizeMode="cover" />
        {item.hotspots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            onPress={() => handleHotspot(spot)}
            style={{
              position: 'absolute',
              left: spot.x * SW - 18,
              top: spot.y * imgHeight - 18,
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: viewed.has(spot.id) ? '#16a34a' : '#fff',
              borderWidth: 3, borderColor: '#15803d',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
            }}
          >
            <Ionicons
              name={viewed.has(spot.id) ? 'checkmark' : 'add'}
              size={16}
              color={viewed.has(spot.id) ? '#fff' : '#15803d'}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Active hotspot popup */}
      {activeHotspot && (
        <View style={{ margin: 16, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 14, borderWidth: 1.5, borderColor: '#bbf7d0' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#15803d', fontFamily: FONTS.title }}>{activeHotspot.label}</Text>
            <TouchableOpacity onPress={() => setActiveHotspot(null)}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20, fontFamily: FONTS.body }}>{activeHotspot.description}</Text>
        </View>
      )}

      <View style={{ padding: 20, paddingTop: activeHotspot ? 0 : 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8, fontFamily: FONTS.title }}>{item.title}</Text>
        <Text style={{ fontSize: 12, color: '#6b7280', fontFamily: FONTS.body }}>
          Tap the <Text style={{ color: '#15803d', fontWeight: '700' }}>+ markers</Text> on the image to explore. ({viewed.size}/{item.hotspots.length} explored)
        </Text>
        <View style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginTop: 8 }}>
          <View style={{ width: `${(viewed.size / item.hotspots.length) * 100}%`, height: 4, backgroundColor: '#16a34a', borderRadius: 2 }} />
        </View>
      </View>
    </View>
  );
};

const ScenarioContent = ({ item, onComplete }) => {
  const [currentNode, setCurrentNode] = useState(item.startNode);
  const [history, setHistory] = useState([]);
  const node = item.nodes[currentNode];

  const handleChoice = (choice) => {
    if (choice.next === null) { onComplete(); return; }
    setHistory((h) => [...h, currentNode]);
    setCurrentNode(choice.next);
    if (item.nodes[choice.next]?.correct) onComplete();
  };

  const handleRestart = () => { setCurrentNode(item.startNode); setHistory([]); };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16, fontFamily: FONTS.title }}>{item.title}</Text>

      <View style={{
        padding: 16, borderRadius: 14, marginBottom: 16,
        backgroundColor: node.correct ? '#f0fdf4' : node.correct === false ? '#fff5f5' : '#f9fafb',
        borderWidth: 1.5,
        borderColor: node.correct ? '#bbf7d0' : node.correct === false ? '#fca5a5' : '#e5e7eb',
      }}>
        <Text style={{ fontSize: 15, color: '#374151', lineHeight: 24, fontFamily: FONTS.body }}>{node.text}</Text>
      </View>

      <View style={{ gap: 10 }}>
        {node.choices.map((choice, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleChoice(choice)}
            style={{
              padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#15803d',
              backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10,
            }}
          >
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#15803d', fontFamily: FONTS.title }}>{String.fromCharCode(65 + i)}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: '#374151', fontFamily: FONTS.body }}>{choice.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {history.length > 0 && (
        <TouchableOpacity onPress={handleRestart} style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="refresh" size={14} color="#9ca3af" />
          <Text style={{ fontSize: 12, color: '#9ca3af', fontFamily: FONTS.body }}>Restart scenario</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const StepperContent = ({ item, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = item.steps[currentStep];
  const isLast = currentStep === item.steps.length - 1;

  const goNext = () => {
    if (isLast) { onComplete(); return; }
    setCurrentStep((s) => s + 1);
  };
  const goPrev = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16, fontFamily: FONTS.title }}>{item.title}</Text>

      {/* Step progress */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
        {item.steps.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= currentStep ? '#16a34a' : '#e5e7eb' }} />
        ))}
      </View>

      {/* Step content */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
        {step.imageUrl && (
          <Image source={{ uri: step.imageUrl }} style={{ width: '100%', height: 180 }} resizeMode="cover" />
        )}
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>{currentStep + 1}</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', flex: 1, fontFamily: FONTS.title }}>{step.title}</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#374151', lineHeight: 22, fontFamily: FONTS.body }}>{step.content}</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={goPrev}
          disabled={currentStep === 0}
          style={{ flex: 1, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: currentStep === 0 ? '#e5e7eb' : '#15803d', alignItems: 'center', opacity: currentStep === 0 ? 0.4 : 1 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: currentStep === 0 ? '#9ca3af' : '#15803d', fontFamily: FONTS.button }}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goNext}
          style={{ flex: 1.5, padding: 14, borderRadius: 12, backgroundColor: '#15803d', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: FONTS.button }}>
            {isLast ? 'Complete ✓' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 10, fontFamily: FONTS.body }}>
        Step {currentStep + 1} of {item.steps.length}
      </Text>
    </View>
  );
};

// ─── Main ContentViewerScreen ─────────────────────────────────────────
export default function ContentViewerScreen({ route, navigation }) {
  const { course, contentItems: propItems, startIndex = 0 } = route.params || {};
  const { user } = useAuth();
  const items = propItems || MOCK_CONTENT;
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [completed, setCompleted] = useState(new Set());
  const [isOnline] = useState(true); // replace with useNetworkStatus().isOnline
  const scrollRef = useRef(null);

  const current = items[currentIndex];
  const progressPct = Math.round((completed.size / items.length) * 100);

  const markComplete = () => {
    const newCompleted = new Set(completed).add(current.id);
    setCompleted(newCompleted);
    if (user && course) {
      updateProgress(user.id, course.id, current.id, 100).catch(() => {});
    }
  };

  const goNext = () => {
    markComplete();
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // All content done — go to quiz or module complete
      Alert.alert(
        '🎉 Module Complete!',
        'You have completed all content in this module. Ready to take the quiz?',
        [
          { text: 'Not Yet', style: 'cancel' },
          { text: 'Take Quiz', onPress: () => navigation.navigate('Quiz', { course }) },
        ]
      );
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const renderContent = () => {
    if (!current) return null;
    switch (current.type) {
      case 'TEXT':        return <TextContent item={current} />;
      case 'IMAGE':       return <ImageContent item={current} onComplete={markComplete} />;
      case 'VIDEO':       return <VideoContent item={current} isOnline={isOnline} onComplete={markComplete} />;
      case 'INFOGRAPHIC':
        if (current.subtype === 'HOTSPOT')  return <HotspotContent  item={current} onComplete={markComplete} />;
        if (current.subtype === 'SCENARIO') return <ScenarioContent item={current} onComplete={markComplete} />;
        if (current.subtype === 'STEPPER')  return <StepperContent  item={current} onComplete={markComplete} />;
        return null;
      default: return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#6b7280', fontFamily: FONTS.body }}>Unknown content type: {current.type}</Text>
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header progress bar */}
      <View style={{ backgroundColor: '#15803d', paddingHorizontal: 16, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.label }}>
            ITEM {currentIndex + 1} OF {items.length}
          </Text>
          <Text style={{ fontSize: 11, color: '#4ade80', fontWeight: '700', fontFamily: FONTS.label }}>
            {progressPct}% complete
          </Text>
        </View>
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <View style={{ width: `${progressPct}%`, height: 4, backgroundColor: '#4ade80', borderRadius: 2 }} />
        </View>

        {/* Item tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
          {items.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setCurrentIndex(i)}
              style={{
                width: 28, height: 28, borderRadius: 14, borderWidth: 1.5,
                borderColor: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                backgroundColor: completed.has(item.id) ? '#16a34a' : i === currentIndex ? 'rgba(255,255,255,0.2)' : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              {completed.has(item.id)
                ? <Ionicons name="checkmark" size={13} color="#fff" />
                : <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', fontFamily: FONTS.title }}>{i + 1}</Text>
              }
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content type badge */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons
          name={current?.type === 'VIDEO' ? 'play-circle' : current?.type === 'IMAGE' ? 'image' : current?.type === 'INFOGRAPHIC' ? 'layers' : 'document-text'}
          size={16}
          color="#15803d"
        />
        <Text style={{ fontSize: 12, color: '#374151', fontWeight: '700', fontFamily: FONTS.label }}>
          {current?.type === 'INFOGRAPHIC' ? `INFOGRAPHIC — ${current?.subtype}` : current?.type}
        </Text>
      </View>

      {/* Scrollable content */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} onScrollEndDrag={() => { if (current?.type === 'TEXT') markComplete(); }}>
        {renderContent()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={goPrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: currentIndex === 0 ? '#e5e7eb' : '#15803d', alignItems: 'center', opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: currentIndex === 0 ? '#9ca3af' : '#15803d', fontFamily: FONTS.button }}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goNext}
          style={{ flex: 1.5, padding: 14, borderRadius: 12, backgroundColor: '#15803d', alignItems: 'center', shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: FONTS.button }}>
            {currentIndex === items.length - 1 ? 'Finish & Quiz →' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
