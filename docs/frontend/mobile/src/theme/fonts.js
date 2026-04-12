// src/theme/fonts.js
// Font system based on design plan:
// - Sans-serif (system default) → titles, labels, buttons, navigation
// - Serif (Georgia) → body text, descriptions, lesson content, headings

import { Platform } from 'react-native';

export const FONTS = {
  // Sans-serif — titles, labels, UI elements, buttons
  title: Platform.select({ ios: 'System', android: 'sans-serif' }),
  titleBold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  label: Platform.select({ ios: 'System', android: 'sans-serif' }),
  button: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),

  // Serif — body text, descriptions, lesson content, section headings
  body: Platform.select({ ios: 'Georgia', android: 'serif' }),
  bodyBold: Platform.select({ ios: 'Georgia', android: 'serif' }),
  heading: Platform.select({ ios: 'Georgia', android: 'serif' }),
  content: Platform.select({ ios: 'Georgia', android: 'serif' }),
};

// Usage examples:
// Screen title:         fontFamily: FONTS.title,    fontSize: 22, fontWeight: '800'
// Card title:          fontFamily: FONTS.title,    fontSize: 16, fontWeight: '700'
// Body description:    fontFamily: FONTS.body,     fontSize: 14, fontWeight: '400'
// Lesson content:      fontFamily: FONTS.content,  fontSize: 14, lineHeight: 24
// Section heading:     fontFamily: FONTS.heading,  fontSize: 18, fontWeight: '700'
// Button label:        fontFamily: FONTS.button,   fontSize: 14, fontWeight: '700'
// Badge/pill label:    fontFamily: FONTS.label,    fontSize: 10, fontWeight: '700'
