import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const PAGES = [
  {
    id: 0,
    type: 'VIDEO',
    lessonTitle: 'Introduction to Rainforest Ecosystems',
    duration: '18 min',
    offline: true,
    imageBg: '#14532d',
  },
  {
    id: 1,
    type: 'TEXT',
    lessonTitle: 'Why Rainforests Matter',
    title: 'Why Rainforests Matter',
    paragraphs: [
      'Rainforests are among the most biologically diverse ecosystems on Earth, covering less than 6% of the planet\'s surface yet housing more than half of all plant and animal species.',
      'The Amazon Basin alone produces approximately 20% of the world\'s oxygen through photosynthesis, earning rainforests the title "the lungs of the Earth." This oxygen production is critical to maintaining atmospheric balance globally.',
      'Beyond oxygen, rainforests act as massive carbon sinks, absorbing carbon dioxide and mitigating climate change. A single hectare of mature rainforest can sequester up to 150 tonnes of carbon per year.',
      'Rainforests regulate regional and global water cycles through evapotranspiration, releasing water vapour that forms rainfall patterns thousands of kilometres away. This moisture transport supports agriculture far beyond the forest borders.',
      'Indigenous communities have depended on rainforests for thousands of years, developing intricate knowledge systems around forest resources. Over 50 million people worldwide rely directly on rainforests for food, shelter, and medicine.',
      'Despite their importance, rainforests face unprecedented pressure from deforestation, agriculture expansion, and climate change. Understanding their value is the first step toward protecting these irreplaceable ecosystems for future generations.',
    ],
  },
  {
    id: 2,
    type: 'IMAGE',
    lessonTitle: 'Canopy Layer Species Gallery',
    imageBg: '#78350f',
    caption: 'Aerial view of the Amazon Canopy — the uppermost layer of the rainforest, forming a continuous green roof at 30–45 m above the forest floor.',
  },
  {
    id: 3,
    type: 'HOTSPOT',
    lessonTitle: 'Interactive Ecosystem Map',
    imageBg: '#0c4a6e',
    hotspots: [
      { id: 1, top: '22%', left: '18%', label: 'Emergent Layer',  desc: 'Tallest trees rising above the canopy, reaching heights of 60 m or more. Home to harpy eagles and large butterflies.' },
      { id: 2, top: '50%', left: '62%', label: 'Canopy Layer',    desc: 'A dense roof of overlapping leaves and branches at 30–45 m. Over 90% of the forest\'s animal life lives here.' },
      { id: 3, top: '74%', left: '36%', label: 'Forest Floor',    desc: 'Dark, humid ground layer where decomposers break down organic matter. Nutrients released here feed the entire ecosystem.' },
    ],
  },
  {
    id: 4,
    type: 'VIDEO',
    lessonTitle: 'Biodiversity Threats and Solutions',
    duration: '22 min',
    offline: false,
    imageBg: '#1c1917',
  },
  {
    id: 5,
    type: 'SCENARIO',
    lessonTitle: 'Conservation Decision Making',
    question: 'You discover evidence of illegal logging during a guided tour. The visitors are asking questions. What should you do?',
    options: [
      { id: 'A', text: 'Ignore it to avoid alarming visitors and continue the tour' },
      { id: 'B', text: 'Document the evidence with photos, note GPS coordinates, and report to park authorities immediately while calmly explaining the situation to visitors' },
      { id: 'C', text: 'Confront the loggers directly and ask them to stop' },
    ],
    correctId: 'B',
    feedback: {
      correct:   'Correct! Documenting and reporting maintains visitor safety and creates an official record for authorities to act on.',
      incorrect: 'Not quite. Ignoring or confronting directly puts visitors and yourself at risk. Always document and report through proper channels.',
    },
  },
  {
    id: 6,
    type: 'STEPPER',
    lessonTitle: 'Field Survey Protocol',
    steps: [
      {
        id: 1,
        title: 'Pre-Survey Preparation',
        desc: 'Review survey objectives, gather equipment (GPS, camera, field notebook, species identification guides), and check weather conditions.',
        imageBg: '#14532d',
      },
      {
        id: 2,
        title: 'Site Assessment',
        desc: 'Record habitat type, GPS coordinates, and site conditions. Note any unusual activities or disturbances in the survey area before beginning data collection.',
        imageBg: '#0c4a6e',
      },
      {
        id: 3,
        title: 'Species Recording',
        desc: 'Systematically document all observed species using standardised forms. Photograph key specimens and note population counts where possible.',
        imageBg: '#78350f',
      },
      {
        id: 4,
        title: 'Post-Survey Documentation',
        desc: 'Submit field data within 24 hours, back up photos to the central database, and flag any incidents or unusual observations for the park warden.',
        imageBg: '#1c1917',
      },
    ],
  },
  {
    id: 7,
    type: 'QUIZ',
    lessonTitle: 'Rainforest Ecosystems Quiz',
    questionCount: 10,
    duration: '30 min',
    passMark: 70,
  },
];

const TYPE_BADGE = {
  VIDEO:    { bg: 'rgba(255,255,255,0.95)', color: '#374151' },
  TEXT:     { bg: '#ede9fe',                color: '#6d28d9' },
  IMAGE:    { bg: 'rgba(255,255,255,0.95)', color: '#374151' },
  HOTSPOT:  { bg: '#ede9fe',                color: '#6d28d9' },
  SCENARIO: { bg: '#fef3c7',                color: '#d97706' },
  STEPPER:  { bg: 'rgba(255,255,255,0.95)', color: '#0369a1' },
  QUIZ:     { bg: 'rgba(255,255,255,0.95)', color: '#374151' },
};

/* ── Progress dot ── */
function Dot({ index, current }) {
  const isLesson  = index < 5;
  const isCurrent = index === current;

  if (isCurrent) {
    return (
      <View style={{
        width: 28, height: 28, borderRadius: 14,
        borderWidth: 2.5, borderColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
      }}>
        {isLesson ? (
          <Ionicons name="checkmark" size={13} color="#fff" />
        ) : (
          <Text style={{ fontFamily: sans, fontSize: 11, fontWeight: '700', color: '#fff' }}>
            {index + 1}
          </Text>
        )}
      </View>
    );
  }

  if (isLesson) {
    return (
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="checkmark" size={11} color="rgba(255,255,255,0.9)" />
      </View>
    );
  }

  return (
    <View style={{
      width: 22, height: 22, borderRadius: 11,
      backgroundColor: 'rgba(17,24,39,0.45)',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontFamily: sans, fontSize: 10, fontWeight: '700', color: '#fff' }}>
        {index + 1}
      </Text>
    </View>
  );
}

/* ── Page components ── */

function VideoPage({ page }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 230, backgroundColor: page.imageBg, alignItems: 'center', justifyContent: 'center' }}>
        {page.offline && (
          <View style={{
            position: 'absolute', top: 14, right: 14,
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: 'rgba(17,24,39,0.65)', borderRadius: 8,
            paddingHorizontal: 10, paddingVertical: 5,
          }}>
            <Ionicons name="cloud-done-outline" size={13} color="#4ade80" />
            <Text style={[T.caption, { color: '#4ade80' }]}>OFFLINE AVAILABLE</Text>
          </View>
        )}
        <View style={{
          width: 68, height: 68, borderRadius: 34,
          backgroundColor: 'rgba(255,255,255,0.18)',
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
        }}>
          <Ionicons name="play" size={30} color="#fff" />
        </View>
        <View style={{
          position: 'absolute', bottom: 14, left: 14,
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: 'rgba(17,24,39,0.65)', borderRadius: 8,
          paddingHorizontal: 10, paddingVertical: 5,
        }}>
          <Ionicons name="time-outline" size={13} color="#fff" />
          <Text style={[T.caption, { color: '#fff' }]}>{page.duration}</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={[T.h3, { color: '#111827', marginBottom: 12 }]}>
          {page.lessonTitle}
        </Text>
        <Text style={[T.bodyDef, { color: '#374151', lineHeight: 26 }]}>
          This video explores the major threats facing rainforest biodiversity today — from deforestation and habitat fragmentation to climate change and invasive species — and examines evidence-based solutions park guides can communicate to visitors.
        </Text>
        <View style={{
          marginTop: 20, backgroundColor: '#f0fdf4', borderRadius: 14,
          padding: 16, borderWidth: 1, borderColor: '#bbf7d0',
        }}>
          <Text style={[T.label, { color: '#15803d', fontWeight: '700', marginBottom: 6 }]}>
            What you'll learn
          </Text>
          {[
            'Identify the top 5 threats to rainforest biodiversity',
            'Explain deforestation drivers in accessible language',
            'Describe conservation solutions at local and global scale',
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
              <Ionicons name="checkmark-circle" size={16} color="#15803d" style={{ marginTop: 2 }} />
              <Text style={[T.bodySm, { color: '#374151', flex: 1, lineHeight: 20 }]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function TextPage({ page }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={[T.h2, { color: '#111827', marginBottom: 18, lineHeight: 32 }]}>
        {page.title}
      </Text>
      {page.paragraphs.map((para, i) => (
        <Text
          key={i}
          style={[T.bodyDef, { color: '#374151', lineHeight: 26, marginBottom: i < page.paragraphs.length - 1 ? 16 : 0 }]}
        >
          {para}
        </Text>
      ))}
    </View>
  );
}

function ImagePage({ page }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 260, backgroundColor: page.imageBg, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{
          position: 'absolute', top: 14, right: 14,
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: 'rgba(17,24,39,0.65)', borderRadius: 8,
          paddingHorizontal: 10, paddingVertical: 5,
        }}>
          <Ionicons name="expand-outline" size={13} color="#fff" />
          <Text style={[T.caption, { color: '#fff' }]}>TAP TO ZOOM</Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={[T.bodySm, { color: '#6b7280', lineHeight: 20, marginBottom: 14, fontStyle: 'italic' }]}>
          {page.caption}
        </Text>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          alignSelf: 'flex-start',
          backgroundColor: '#f3f4f6', borderRadius: 10,
          paddingHorizontal: 16, paddingVertical: 10,
          marginBottom: 24,
        }}>
          <Ionicons name="expand-outline" size={16} color="#374151" />
          <Text style={[T.label, { color: '#374151' }]}>Enable Zoom</Text>
        </TouchableOpacity>
        <Text style={[T.h4, { color: '#111827', marginBottom: 10 }]}>About this image</Text>
        <Text style={[T.bodyDef, { color: '#374151', lineHeight: 26 }]}>
          The rainforest canopy is one of the most species-rich habitats on Earth. Park guides must be able to identify common canopy-dwelling species and understand their ecological roles to answer visitor questions with confidence.
        </Text>
      </View>
    </View>
  );
}

function HotspotPage({ page }) {
  const [explored, setExplored] = useState([]);
  const [active,   setActive]   = useState(null);

  function toggleHotspot(id) {
    setActive(active === id ? null : id);
    if (!explored.includes(id)) setExplored([...explored, id]);
  }

  const activeHotspot = page.hotspots.find((h) => h.id === active);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 260, backgroundColor: page.imageBg }}>
        {page.hotspots.map((h) => (
          <TouchableOpacity
            key={h.id}
            onPress={() => toggleHotspot(h.id)}
            style={{
              position: 'absolute', top: h.top, left: h.left,
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: explored.includes(h.id) ? '#15803d' : 'rgba(255,255,255,0.92)',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 2,
              borderColor: explored.includes(h.id) ? '#4ade80' : 'rgba(255,255,255,0.5)',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
            }}
          >
            {explored.includes(h.id) ? (
              <Ionicons name="checkmark" size={18} color="#fff" />
            ) : (
              <Text style={{ fontFamily: sans, fontSize: 20, fontWeight: '300', color: '#15803d', lineHeight: 22 }}>+</Text>
            )}
          </TouchableOpacity>
        ))}
        <View style={{
          position: 'absolute', bottom: 14, right: 14,
          backgroundColor: 'rgba(17,24,39,0.7)', borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 6,
        }}>
          <Text style={[T.caption, { color: '#fff' }]}>
            {explored.length}/{page.hotspots.length} explored
          </Text>
        </View>
      </View>

      {activeHotspot ? (
        <View style={{
          margin: 16, backgroundColor: '#f0fdf4', borderRadius: 14,
          padding: 16, borderWidth: 1, borderColor: '#bbf7d0',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={[T.h4, { color: '#15803d' }]}>{activeHotspot.label}</Text>
            <TouchableOpacity onPress={() => setActive(null)}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text style={[T.bodyDef, { color: '#374151', lineHeight: 24 }]}>{activeHotspot.desc}</Text>
        </View>
      ) : (
        <View style={{
          margin: 16, backgroundColor: '#f3f4f6', borderRadius: 14,
          padding: 16, alignItems: 'center',
        }}>
          <Ionicons name="hand-left-outline" size={22} color="#9ca3af" style={{ marginBottom: 6 }} />
          <Text style={[T.label, { color: '#6b7280', textAlign: 'center' }]}>
            Tap the + markers on the map to explore each ecosystem layer
          </Text>
        </View>
      )}

      <View style={{ paddingHorizontal: 16 }}>
        {page.hotspots.map((h) => (
          <TouchableOpacity
            key={h.id}
            onPress={() => toggleHotspot(h.id)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              paddingVertical: 12,
              borderBottomWidth: h.id < page.hotspots.length ? 1 : 0,
              borderBottomColor: '#f3f4f6',
            }}
          >
            <View style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: explored.includes(h.id) ? '#dcfce7' : '#f3f4f6',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons
                name={explored.includes(h.id) ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={explored.includes(h.id) ? '#15803d' : '#9ca3af'}
              />
            </View>
            <Text style={[T.label, { color: explored.includes(h.id) ? '#15803d' : '#374151', fontWeight: '600' }]}>
              {h.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ScenarioPage({ page }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  function getOptionStyle(optId) {
    if (!answered) {
      return {
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
      };
    }
    if (optId === page.correctId) {
      return { borderColor: '#15803d', backgroundColor: '#f0fdf4' };
    }
    if (optId === selected) {
      return { borderColor: '#ef4444', backgroundColor: '#fef2f2' };
    }
    return { borderColor: '#e5e7eb', backgroundColor: '#fff' };
  }

  function getLetterStyle(optId) {
    if (!answered) return { bg: '#f3f4f6', color: '#374151' };
    if (optId === page.correctId) return { bg: '#15803d', color: '#fff' };
    if (optId === selected) return { bg: '#ef4444', color: '#fff' };
    return { bg: '#f3f4f6', color: '#9ca3af' };
  }

  const isCorrect = selected === page.correctId;

  return (
    <View style={{ padding: 20 }}>
      <Text style={[T.bodyDef, { color: '#111827', lineHeight: 26, marginBottom: 24, fontSize: 17 }]}>
        {page.question}
      </Text>

      {page.options.map((opt) => {
        const oStyle = getOptionStyle(opt.id);
        const lStyle = getLetterStyle(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => { if (!answered) setSelected(opt.id); }}
            activeOpacity={answered ? 1 : 0.7}
            style={{
              flexDirection: 'row', alignItems: 'flex-start', gap: 14,
              borderWidth: 1.5, borderRadius: 16,
              paddingHorizontal: 16, paddingVertical: 16,
              marginBottom: 12,
              ...oStyle,
            }}
          >
            <View style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: lStyle.bg,
              alignItems: 'center', justifyContent: 'center',
              marginTop: 1,
            }}>
              <Text style={{ fontFamily: sans, fontSize: 13, fontWeight: '700', color: lStyle.color }}>
                {opt.id}
              </Text>
            </View>
            <Text style={[T.bodySm, { flex: 1, color: '#374151', lineHeight: 21 }]}>
              {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}

      {answered && (
        <View style={{
          marginTop: 8, borderRadius: 14, padding: 16,
          backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
          borderWidth: 1,
          borderColor: isCorrect ? '#bbf7d0' : '#fecaca',
          flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        }}>
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={isCorrect ? '#15803d' : '#ef4444'}
            style={{ marginTop: 2 }}
          />
          <Text style={[T.bodySm, { flex: 1, color: isCorrect ? '#14532d' : '#991b1b', lineHeight: 20 }]}>
            {isCorrect ? page.feedback.correct : page.feedback.incorrect}
          </Text>
        </View>
      )}
    </View>
  );
}

function StepperPage({ page }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step      = page.steps[stepIndex];
  const isFirst   = stepIndex === 0;
  const isLastStep = stepIndex === page.steps.length - 1;

  return (
    <View style={{ flex: 1 }}>
      {/* Sub-step dots */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 20 }}>
        {page.steps.map((_, i) => (
          <View
            key={i}
            style={{
              height: 6, width: i === stepIndex ? 28 : 8, borderRadius: 3,
              backgroundColor: i <= stepIndex ? '#15803d' : '#d1d5db',
            }}
          />
        ))}
      </View>

      {/* Step card */}
      <View style={{
        marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
        marginBottom: 16,
      }}>
        <View style={{ padding: 20 }}>
          {/* Step number + title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#15803d',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontFamily: sans, fontSize: 16, fontWeight: '700', color: '#fff' }}>
                {step.id}
              </Text>
            </View>
            <Text style={[T.h4, { color: '#111827', flex: 1, fontSize: 17 }]}>
              {step.title}
            </Text>
          </View>

          {/* Description */}
          <Text style={[T.bodySm, { color: '#6b7280', lineHeight: 22, marginBottom: 16 }]}>
            {step.desc}
          </Text>

          {/* Image placeholder */}
          <View style={{ height: 140, backgroundColor: step.imageBg, borderRadius: 12 }} />
        </View>

        {/* Inner navigation */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 20, paddingVertical: 14,
          borderTopWidth: 1, borderTopColor: '#f3f4f6',
        }}>
          <TouchableOpacity
            onPress={() => { if (!isFirst) setStepIndex(stepIndex - 1); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Ionicons name="arrow-back" size={14} color={isFirst ? '#d1d5db' : '#374151'} />
            <Text style={[T.label, { color: isFirst ? '#d1d5db' : '#374151' }]}>Back</Text>
          </TouchableOpacity>

          <Text style={[T.caption, { color: '#9ca3af' }]}>
            {stepIndex + 1} / {page.steps.length}
          </Text>

          <TouchableOpacity
            onPress={() => { if (!isLastStep) setStepIndex(stepIndex + 1); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={[T.label, { color: isLastStep ? '#d1d5db' : '#15803d', fontWeight: '600' }]}>Next</Text>
            <Ionicons name="arrow-forward" size={14} color={isLastStep ? '#d1d5db' : '#15803d'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function QuizPage({ page }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
      <View style={{
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#fef3c7',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Ionicons name="help-circle" size={44} color="#d97706" />
      </View>

      <Text style={[T.h2, { color: '#111827', textAlign: 'center', marginBottom: 10 }]}>
        {page.lessonTitle}
      </Text>
      <Text style={[T.bodySm, { color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 28 }]}>
        Test your understanding of rainforest ecosystems with {page.questionCount} questions.
      </Text>

      <View style={{
        width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        marginBottom: 24,
      }}>
        {[
          { icon: 'layers-outline',    label: 'Questions',  value: `${page.questionCount} questions` },
          { icon: 'time-outline',      label: 'Duration',   value: page.duration },
          { icon: 'ribbon-outline',    label: 'Pass Mark',  value: `${page.passMark}%` },
          { icon: 'refresh-outline',   label: 'Attempts',   value: 'Unlimited' },
        ].map((row, i, arr) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingVertical: 12,
              borderBottomWidth: i < arr.length - 1 ? 1 : 0,
              borderBottomColor: '#f3f4f6',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={row.icon} size={18} color="#9ca3af" />
              <Text style={[T.label, { color: '#374151' }]}>{row.label}</Text>
            </View>
            <Text style={[T.label, { color: '#111827', fontWeight: '600' }]}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View style={{
        backgroundColor: '#fef3c7', borderRadius: 14, padding: 14,
        flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '100%',
      }}>
        <Ionicons name="information-circle-outline" size={18} color="#d97706" style={{ marginTop: 1 }} />
        <Text style={[T.bodySm, { color: '#92400e', flex: 1, lineHeight: 20 }]}>
          Make sure you've reviewed all lessons before starting. You must score {page.passMark}% or above to earn your certificate.
        </Text>
      </View>
    </View>
  );
}

/* ── Main screen ── */

export default function ContentScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const course     = route.params?.course ?? { title: 'Rainforest Biodiversity Fundamentals' };
  const initialPage = route.params?.lessonIndex ?? 0;

  const [pageIndex, setPageIndex] = useState(initialPage);
  const page    = PAGES[pageIndex];
  const badge   = TYPE_BADGE[page.type] ?? TYPE_BADGE.VIDEO;
  const isFirst = pageIndex === 0;
  const isLast  = pageIndex === PAGES.length - 1;
  const isQuiz  = page.type === 'QUIZ';

  function goBack() {
    if (isFirst) { navigation.goBack(); } else { setPageIndex(pageIndex - 1); }
  }
  function goNext() {
    if (!isLast) setPageIndex(pageIndex + 1);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingHorizontal: 20, paddingBottom: 18,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text numberOfLines={1} style={[T.label, { color: 'rgba(255,255,255,0.85)', flex: 1 }]}>
            {course.title}
          </Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {PAGES.map((_, i) => (
            <Dot key={i} index={i} current={pageIndex} />
          ))}
        </View>

        {/* Type badge + lesson title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            backgroundColor: badge.bg, borderRadius: 6,
            paddingHorizontal: 10, paddingVertical: 4,
          }}>
            <Text style={[T.caption, { color: badge.color, fontWeight: '700', letterSpacing: 0.5 }]}>
              {page.type}
            </Text>
          </View>
          <Text numberOfLines={1} style={[T.label, { color: '#fff', flex: 1, fontWeight: '600' }]}>
            {page.lessonTitle}
          </Text>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {page.type === 'VIDEO'    && <VideoPage    page={page} />}
        {page.type === 'TEXT'     && <TextPage     page={page} />}
        {page.type === 'IMAGE'    && <ImagePage    page={page} />}
        {page.type === 'HOTSPOT'  && <HotspotPage  page={page} />}
        {page.type === 'SCENARIO' && <ScenarioPage page={page} />}
        {page.type === 'STEPPER'  && <StepperPage  page={page} />}
        {page.type === 'QUIZ'     && <QuizPage     page={page} />}
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row', gap: 10,
        paddingHorizontal: 16, paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: '#f3f4f6',
      }}>
        <TouchableOpacity
          onPress={goBack}
          style={{
            flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
            paddingVertical: 14, borderRadius: 14,
            borderWidth: 1.5, borderColor: '#e5e7eb',
          }}
        >
          <Ionicons name="arrow-back" size={16} color="#374151" />
          <Text style={[T.label, { color: '#374151', fontWeight: '600' }]}>Back</Text>
        </TouchableOpacity>

        {isQuiz ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Quiz', { course })}
            style={{
              flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              paddingVertical: 14, borderRadius: 14,
              backgroundColor: '#15803d',
            }}
          >
            <Ionicons name="help-circle-outline" size={16} color="#fff" />
            <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Take Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={goNext}
            disabled={isLast}
            style={{
              flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              paddingVertical: 14, borderRadius: 14,
              backgroundColor: isLast ? '#e5e7eb' : '#15803d',
            }}
          >
            <Text style={[T.label, { color: isLast ? '#9ca3af' : '#fff', fontWeight: '700' }]}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={isLast ? '#9ca3af' : '#fff'} />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}
