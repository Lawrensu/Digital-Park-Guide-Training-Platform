// Mock data for the Digital Park Guide Training Platform

export const coursesData = [
  {
    id: 1,
    title: 'Biodiversity Essentials',
    description: 'Learn about flora and fauna species in our park ecosystem with identifying characteristics and conservation status.',
    category: 'Biodiversity',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
    progress: 45,
    lessons: 8,
    duration: '4 hours',
    color: 'bg-green-100',
    icon: '🌿',
  },
  {
    id: 2,
    title: 'Wildlife Safety Protocols',
    description: 'Master safety procedures for encounters with wildlife and emergency response protocols.',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    progress: 72,
    lessons: 6,
    duration: '3 hours',
    color: 'bg-orange-100',
    icon: '🐾',
  },
  {
    id: 3,
    title: 'Eco-Tourism Best Practices',
    description: 'Learn sustainable tourism practices to minimize environmental impact while maximizing visitor experience.',
    category: 'Eco-tourism',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop',
    progress: 28,
    lessons: 10,
    duration: '5 hours',
    color: 'bg-blue-100',
    icon: '♻️',
  },
  {
    id: 4,
    title: 'Plant Identification Guide',
    description: 'Comprehensive guide to identifying medicinal and endemic plants found in our protected areas.',
    category: 'Biodiversity',
    image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&q=80&w=1000',
    progress: 31,
    lessons: 12,
    duration: '6 hours',
    color: 'bg-lime-100',
    icon: '🌾',
  },
  {
    id: 5,
    title: 'Emergency Response Training',
    description: 'Critical skills for managing medical emergencies and natural disasters in remote areas.',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop',
    progress: 55,
    lessons: 7,
    duration: '4 hours',
    color: 'bg-red-100',
    icon: '🚨',
  },
  {
    id: 6,
    title: 'Climate & Conservation',
    description: 'Understanding climate change impacts and modern conservation strategies in action.',
    category: 'Eco-tourism',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
    progress: 0,
    lessons: 9,
    duration: '5 hours',
    color: 'bg-cyan-100',
    icon: '🌍',
  },
];

export const lessonsData = {
  1: [
    {
      id: 1,
      title: 'Introduction to Park Ecosystem',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      description: 'Understand the interconnected relationships within our park\'s ecosystem and the roles different species play.',
      duration: '12 min',
      completed: true,
    },
    {
      id: 2,
      title: 'Mammal Identification',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      description: 'Learn to identify common mammals you\'ll encounter on guided tours.',
      duration: '18 min',
      completed: true,
    },
    {
      id: 3,
      title: 'Bird Species & Birdwatching',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      description: 'Discover our avian residents and tips for successful birdwatching experiences.',
      duration: '15 min',
      completed: false,
    },
  ],
  2: [
    {
      id: 4,
      title: 'Wildlife Encounter Protocol',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      description: 'Step-by-step guide on how to safely approach and interact with wildlife.',
      duration: '20 min',
      completed: true,
    },
    {
      id: 5,
      title: 'Emergency Evacuation Procedures',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      description: 'Critical procedures for emergency situations in the field.',
      duration: '22 min',
      completed: false,
    },
  ],
};

export const quizzesData = {
  1: {
    title: 'Biodiversity Essentials Quiz',
    questions: [
      {
        id: 1,
        question: 'What is the primary role of decomposers in an ecosystem?',
        options: [
          'To produce energy from sunlight',
          'To break down dead organisms and release nutrients',
          'To consume all herbivores',
          'To prevent plant growth',
        ],
        correct: 1,
      },
      {
        id: 2,
        question: 'Which of these animals is an endemic species in our region?',
        options: [
          'African Elephant',
          'Bengal Tiger',
          'Mountain Gorilla',
          'Red Panda',
        ],
        correct: 2,
      },
      {
        id: 3,
        question: 'What percentage of our park is protected wetland?',
        options: [
          '15%',
          '35%',
          '55%',
          '75%',
        ],
        correct: 1,
      },
      {
        id: 4,
        question: 'Which plant species is used for traditional medicine?',
        options: [
          'Common Nettle',
          'Ginseng',
          'Poison Ivy',
          'Cactus',
        ],
        correct: 1,
      },
      {
        id: 5,
        question: 'How many bird species have been documented in our park?',
        options: [
          '50+',
          '150+',
          '250+',
          '350+',
        ],
        correct: 2,
      },
    ],
  },
  2: {
    title: 'Wildlife Safety Quiz',
    questions: [
      {
        id: 1,
        question: 'What is the minimum safe distance from a bear?',
        options: [
          '5 meters',
          '25 meters',
          '50 meters',
          '100 meters',
        ],
        correct: 2,
      },
      {
        id: 2,
        question: 'What should you do if you encounter a venomous snake?',
        options: [
          'Attack it with a stick',
          'Slowly back away and leave the area',
          'Take a photo for identification',
          'Stand still and wait for it to leave',
        ],
        correct: 1,
      },
    ],
  },
};

export const certificationsData = [
  {
    id: 1,
    title: 'Biodiversity Essentials',
    issueDate: '2024-08-15',
    expiryDate: '2025-08-15',
    certificateNumber: 'CERT-BIO-001-2024',
    status: 'active',
  },
  {
    id: 2,
    title: 'Wildlife Safety Protocols',
    issueDate: '2024-06-20',
    expiryDate: '2025-06-20',
    certificateNumber: 'CERT-WSP-002-2024',
    status: 'active',
  },
];

export const userProgress = {
  completedCourses: 2,
  inProgressCourses: 3,
  totalHoursLearned: 18.5,
  averageScore: 87,
};
