import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Switch, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const CATEGORIES  = ['Biodiversity', 'Wildlife', 'Safety', 'Eco-tourism', 'Conservation'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function FieldLabel({ text }) {
  return (
    <Text style={[T.caption, {
      color: '#9ca3af', letterSpacing: 0.5,
      marginBottom: 6, marginTop: 18,
    }]}>
      {text}
    </Text>
  );
}

function StyledInput({ value, onChangeText, placeholder, multiline, minHeight }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[T.bodyDef, {
        borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#111827',
        minHeight: minHeight ?? (multiline ? 90 : undefined),
        lineHeight: 22,
      }]}
    />
  );
}

function Dropdown({ label, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
          paddingHorizontal: 14, paddingVertical: 13,
          backgroundColor: '#fff',
        }}
      >
        <Text style={[T.bodyDef, { color: '#111827' }]}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
      </TouchableOpacity>
      {open && (
        <View style={{
          borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
          marginTop: 4, backgroundColor: '#fff', overflow: 'hidden',
        }}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); }}
              style={{
                paddingHorizontal: 14, paddingVertical: 13,
                borderBottomWidth: i < options.length - 1 ? 1 : 0,
                borderBottomColor: '#f3f4f6',
                backgroundColor: value === opt ? '#f0fdf4' : '#fff',
              }}
            >
              <Text style={[T.bodyDef, { color: value === opt ? '#15803d' : '#374151' }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ModuleEdit() {
  const navigation = useNavigation();
  const route      = useRoute();

  const mod = route.params?.module ?? {
    id:          1,
    title:       'Rainforest Biodiversity Fundamentals',
    description: 'Comprehensive guide to rainforest ecosystems, biodiversity, and conservation principles.',
    status:      'Published',
    lessons:     8,
    duration:    '4h 30m',
    enrolled:    142,
    category:    'Biodiversity',
    difficulty:  'Beginner',
    instructor:  'Dr. Maria Santos',
    dueDate:     '30 Apr 2026',
    tags:        ['Flora', 'Fauna', 'Conservation'],
    contentItems: 8,
    quizCount:   1,
  };

  const [title,       setTitle]       = useState(mod.title);
  const [category,    setCategory]    = useState(mod.category    ?? 'Biodiversity');
  const [difficulty,  setDifficulty]  = useState(mod.difficulty  ?? 'Beginner');
  const [duration,    setDuration]    = useState(mod.duration);
  const [instructor,  setInstructor]  = useState(mod.instructor  ?? 'Dr. Maria Santos');
  const [description, setDescription] = useState(mod.description);
  const [tags,        setTags]        = useState(mod.tags        ?? ['Flora', 'Fauna', 'Conservation']);
  const [dueDate,     setDueDate]     = useState(mod.dueDate     ?? '30 Apr 2026');
  const [published,   setPublished]   = useState(mod.status === 'Published');
  const [addingTag,   setAddingTag]   = useState(false);
  const [newTag,      setNewTag]      = useState('');

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));
  const confirmTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag('');
    setAddingTag(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 18, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[T.h1, { color: '#fff', fontSize: 26 }]}>Module Edit</Text>
        </View>
        <TouchableOpacity style={{
          width: 38, height: 38, borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name="save" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Photo area ── */}
        <TouchableOpacity style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 14, height: 160,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 4,
          borderWidth: 1, borderColor: '#e5e7eb',
        }}>
          <Ionicons name="camera" size={36} color="#9ca3af" />
          <Text style={[T.caption, { color: '#9ca3af', marginTop: 8 }]}>Change Photo</Text>
        </TouchableOpacity>

        {/* ── TITLE ── */}
        <FieldLabel text="TITLE" />
        <StyledInput value={title} onChangeText={setTitle} placeholder="Module title" />

        {/* ── CATEGORY ── */}
        <FieldLabel text="CATEGORY" />
        <Dropdown
          value={category}
          options={CATEGORIES}
          onSelect={setCategory}
        />

        {/* ── DIFFICULTY ── */}
        <FieldLabel text="DIFFICULTY" />
        <Dropdown
          value={difficulty}
          options={DIFFICULTIES}
          onSelect={setDifficulty}
        />

        {/* ── DURATION ── */}
        <FieldLabel text="DURATION" />
        <StyledInput value={duration} onChangeText={setDuration} placeholder="e.g. 4h 30m" />

        {/* ── INSTRUCTOR ── */}
        <FieldLabel text="INSTRUCTOR" />
        <StyledInput value={instructor} onChangeText={setInstructor} placeholder="Instructor name" />

        {/* ── DESCRIPTION ── */}
        <FieldLabel text="DESCRIPTION" />
        <StyledInput
          value={description}
          onChangeText={setDescription}
          placeholder="Module description..."
          multiline
        />

        {/* ── TAGS ── */}
        <FieldLabel text="TAGS" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {tags.map((tag) => (
            <View key={tag} style={{
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1, borderColor: '#d1d5db', borderRadius: 20,
              paddingHorizontal: 12, paddingVertical: 6,
              backgroundColor: '#fff',
            }}>
              <Text style={[T.caption, { color: '#374151', marginRight: 6 }]}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Ionicons name="close" size={14} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {addingTag ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Tag name"
              placeholderTextColor="#9ca3af"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={confirmTag}
              style={[T.label, {
                flex: 1, borderWidth: 1, borderColor: '#15803d',
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
                color: '#111827',
              }]}
            />
            <TouchableOpacity onPress={confirmTag}>
              <Ionicons name="checkmark-circle" size={28} color="#15803d" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setAddingTag(true)}
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row', alignItems: 'center', gap: 6,
              borderWidth: 1.5, borderColor: '#15803d', borderRadius: 20,
              paddingHorizontal: 14, paddingVertical: 7,
            }}
          >
            <Ionicons name="add" size={16} color="#15803d" />
            <Text style={[T.caption, { color: '#15803d', fontWeight: '700' }]}>Add Tag</Text>
          </TouchableOpacity>
        )}

        {/* ── DUE DATE ── */}
        <FieldLabel text="DUE DATE" />
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
          paddingHorizontal: 14, paddingVertical: 13,
          backgroundColor: '#fff',
        }}>
          <Ionicons name="calendar" size={18} color="#6366f1" style={{ marginRight: 12 }} />
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="DD MMM YYYY"
            placeholderTextColor="#9ca3af"
            style={[T.bodyDef, { flex: 1, color: '#111827' }]}
          />
        </View>

        {/* ── STATUS ── */}
        <FieldLabel text="STATUS" />
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
          paddingHorizontal: 14, paddingVertical: 14,
          backgroundColor: '#fff',
        }}>
          <Text style={[T.bodyDef, { color: '#111827' }]}>
            {published ? 'Published' : 'Draft'}
          </Text>
          <Switch
            value={published}
            onValueChange={setPublished}
            trackColor={{ false: '#d1d5db', true: '#15803d' }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Content Items + Quiz rows ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
          borderWidth: 1, borderColor: '#e5e7eb', marginTop: 18,
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ContentBuild', { module: mod })}
            style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 16, paddingVertical: 16,
              borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
            }}
          >
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: '#fff7ed',
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
              <Ionicons name="document-text" size={18} color="#ea580c" />
            </View>
            <Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>
              Content Items ({mod.contentItems ?? 8})
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('QuizEdit', { module: mod })}
            style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 16, paddingVertical: 16,
            }}
          >
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: '#fef9c3',
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
              <Ionicons name="clipboard" size={18} color="#ca8a04" />
            </View>
            <Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>
              Quiz ({mod.quizCount ?? 1})
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* ── Action buttons ── */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            backgroundColor: '#15803d', borderRadius: 14,
            paddingVertical: 16, alignItems: 'center',
            marginTop: 24, marginBottom: 12,
          }}
        >
          <Text style={[T.h4, { color: '#fff' }]}>Save &amp; Publish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            borderWidth: 1.5, borderColor: '#15803d', borderRadius: 14,
            paddingVertical: 16, alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={[T.h4, { color: '#15803d' }]}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 8 }}>
          <Text style={[T.label, { color: '#dc2626' }]}>Delete Module</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
