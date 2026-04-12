export const courses = [
  {
    id: 1,
    title: "Biodiversity Hotspots",
    description: "Explore the diverse ecosystems and wildlife in our parks",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
    category: "Biodiversity",
    lessons: 5,
    progress: 60,
    status: "in-progress",
    lessons_data: [
      {
        id: 1,
        title: "Introduction to Biodiversity",
        description: "Learn the fundamentals of biodiversity and why it matters",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
        completed: true,
        quiz: [
          {
            id: 1,
            question: "What is biodiversity?",
            options: [
              "The variation of species in a habitat",
              "The study of biology",
              "The color of plants",
              "The size of animals"
            ],
            correct: 0,
            explanation: "Biodiversity refers to the variety of life forms and species variation within habitats."
          },
          {
            id: 2,
            question: "Why is biodiversity important?",
            options: [
              "For ecosystem stability and human survival",
              "It makes parks look pretty",
              "To compete with other species",
              "It has no importance"
            ],
            correct: 0,
            explanation: "Biodiversity is crucial for ecosystem functions and provides humans with food, medicine, and clean air."
          }
        ]
      },
      {
        id: 2,
        title: "Flora Classification",
        description: "Understand different types of plants in the park",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
        completed: true,
        quiz: [
          {
            id: 1,
            question: "What are the two main groups of flowering plants?",
            options: [
              "Monocots and Dicots",
              "Trees and Flowers",
              "Green and Brown",
              "Big and Small"
            ],
            correct: 0,
            explanation: "Flowering plants are divided into Monocots (single leaf vein) and Dicots (multiple leaf veins)."
          },
          {
            id: 2,
            question: "Which of these is NOT a function of plant roots?",
            options: [
              "Produce oxygen",
              "Absorb water and nutrients",
              "Anchor the plant",
              "Store energy"
            ],
            correct: 0,
            explanation: "Plants produce oxygen through photosynthesis in their leaves, not their roots."
          }
        ]
      },
      {
        id: 3,
        title: "Fauna Identification",
        description: "Identify common animals in our park ecosystem",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1445308394109-4e88aca2dccf?w=600&h=400&fit=crop",
        completed: false,
        quiz: [
          {
            id: 1,
            question: "What is the primary diet of deer?",
            options: [
              "Grass, leaves, and bark",
              "Meat and insects",
              "Fruits and nuts only",
              "Fish and water plants"
            ],
            correct: 0,
            explanation: "Deer are herbivores that primarily eat grass, leaves, bark, and twigs."
          },
          {
            id: 2,
            question: "How do animals adapt to their park environments?",
            options: [
              "Through physical and behavioral changes over time",
              "They move to different parks",
              "Humans help them adapt",
              "They cannot adapt"
            ],
            correct: 0,
            explanation: "Animals develop adaptations through evolution that help them survive in their specific habitats."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Park Safety Essentials",
    description: "Master safety protocols and emergency procedures",
    image: "https://static.toiimg.com/thumb/msid-109916534,width-748,height-499,resizemode=4,imgsize-139290/.jpg",
    category: "Safety",
    lessons: 4,
    progress: 25,
    status: "in-progress",
    lessons_data: [
      {
        id: 1,
        title: "Safety Protocols Overview",
        description: "General safety guidelines for park guides",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1434030216411-0b793313e4de?w=600&h=400&fit=crop",
        completed: true,
        quiz: [
          {
            id: 1,
            question: "What should a park guide always carry?",
            options: [
              "First aid kit, communication device, and water",
              "Only a water bottle",
              "Nothing, guides don't need equipment",
              "Only a map"
            ],
            correct: 0,
            explanation: "Park guides must carry essential safety equipment including first aid kits, communication devices, and hydration."
          },
          {
            id: 2,
            question: "What is the first step in any safety protocol?",
            options: [
              "Risk assessment and prevention",
              "Call for help immediately",
              "Wait for instructions",
              "Ignore potential hazards"
            ],
            correct: 0,
            explanation: "Always start with risk assessment to identify and prevent potential safety issues."
          }
        ]
      },
      {
        id: 2,
        title: "Emergency Response",
        description: "How to handle emergency situations",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1576091160550-112173f7db1d?w=600&h=400&fit=crop",
        completed: false,
        quiz: [
          {
            id: 1,
            question: "What should you do first in an emergency?",
            options: [
              "Assess the situation and ensure safety",
              "Take photos",
              "Leave the area immediately",
              "Call everyone you know"
            ],
            correct: 0,
            explanation: "Always assess and secure the area first to ensure no further harm occurs."
          },
          {
            id: 2,
            question: "How would you handle a visitor with a sprained ankle?",
            options: [
              "RICE protocol: Rest, Ice, Compression, Elevation",
              "Have them walk it off",
              "Keep them moving",
              "Apply heat immediately"
            ],
            correct: 0,
            explanation: "The RICE protocol is the standard first aid approach for sprains and minor injuries."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Eco-Tourism Best Practices",
    description: "Learn sustainable tourism principles and guide techniques",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
    category: "Eco-tourism",
    lessons: 6,
    progress: 0,
    status: "not-started",
    lessons_data: [
      {
        id: 1,
        title: "Sustainable Tourism Basics",
        description: "Introduction to eco-tourism principles",
        video: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/images/BigBuckBunny.mp4",
        infographic: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
        completed: false,
        quiz: [
          {
            id: 1,
            question: "What is sustainable eco-tourism?",
            options: [
              "Tourism that minimizes environmental impact and benefits local communities",
              "Tourism that only benefits large corporations",
              "Tourist activities that don't care about nature",
              "Any type of tourism"
            ],
            correct: 0,
            explanation: "Eco-tourism aims to minimize environmental impact, educate visitors, and support local conservation efforts."
          },
          {
            id: 2,
            question: "Which practice is environmentally responsible in parks?",
            options: [
              "Stay on marked trails, take only photos, leave no trace",
              "Take souvenirs from nature",
              "Play loud music",
              "Disturb wildlife for photos"
            ],
            correct: 0,
            explanation: "Responsible eco-tourism practices include staying on trails, leaving no trace, and respecting wildlife distance."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Conservation Efforts",
    description: "Understand conservation projects and environmental protection",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
    category: "Biodiversity",
    lessons: 5,
    progress: 0,
    status: "not-started",
    lessons_data: []
  },
  {
    id: 5,
    title: "Wildlife Photography",
    description: "Tips and techniques for capturing park wildlife",
    image: "https://iso.500px.com/10-wildlife-photographers-you-should-follow-on-500px-right-now/",
    category: "Biodiversity",
    lessons: 4,
    progress: 0,
    status: "not-started",
    lessons_data: []
  },
  {
    id: 6,
    title: "First Aid for Guides",
    description: "Essential first aid training for outdoor professionals",
    image: "https://images.unsplash.com/photo-1631217b9201-d59d27cb6f38?w=500&h=300&fit=crop",
    category: "Safety",
    lessons: 5,
    progress: 0,
    status: "not-started",
    lessons_data: []
  }
];

export const quizzes = {
  1: [
    {
      id: 1,
      question: "What is biodiversity?",
      options: [
        "The variation of species in a habitat",
        "The study of biology",
        "The color of plants",
        "The size of animals"
      ],
      correct: 0,
      explanation: "Biodiversity refers to the variety of life forms and species variation within habitats."
    },
    {
      id: 2,
      question: "Which of these is NOT a factor affecting biodiversity?",
      options: [
        "Habitat loss",
        "Climate change",
        "Pollution",
        "The color of the sky"
      ],
      correct: 3,
      explanation: "The color of the sky does not directly affect biodiversity."
    },
    {
      id: 3,
      question: "What is conservation?",
      options: [
        "Protection and sustainable use of natural resources",
        "Destroying the environment",
        "Ignoring wildlife",
        "Building more cities"
      ],
      correct: 0,
      explanation: "Conservation is about protecting and sustainably managing natural resources."
    }
  ],
  2: [
    {
      id: 1,
      question: "What should you do first in an emergency?",
      options: [
        "Assess the situation and ensure safety",
        "Take photos",
        "Leave the area immediately",
        "Call everyone you know"
      ],
      correct: 0,
      explanation: "Always assess and secure the area first."
    },
    {
      id: 2,
      question: "What is the correct emergency number?",
      options: [
        "911",
        "411",
        "311",
        "811"
      ],
      correct: 0,
      explanation: "911 is the standard emergency number in the US."
    }
  ]
};

export const certifications = [
  {
    id: 1,
    courseId: 1,
    courseName: "Biodiversity Hotspots",
    completionDate: "2024-01-15",
    certificateNumber: "BH-2024-001",
    instructor: "Dr. Sarah Chen"
  },
  {
    id: 2,
    courseId: 2,
    courseName: "Park Safety Essentials",
    completionDate: "2024-02-20",
    certificateNumber: "PS-2024-002",
    instructor: "James Wilson"
  }
];
