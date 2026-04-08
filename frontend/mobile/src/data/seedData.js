// src/data/seedData.js
// Realistic park guide training data with wildlife/conservation themes

export const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@parkguide.gov',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: 2,
    name: 'Amira Hassan',
    email: 'guide@parkguide.gov',
    password: 'guide123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=47',
    department: 'Wildlife Conservation',
    joinDate: '2023-03-15',
  },
  {
    id: 3,
    name: 'James Okafor',
    email: 'james@parkguide.gov',
    password: 'guide123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=12',
    department: 'Eco-Tourism',
    joinDate: '2023-06-01',
  },
];

export const MOCK_COURSES = [
  {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    category: 'Biodiversity',
    description:
      'Explore the rich tapestry of life in tropical rainforests. Learn to identify key species, understand ecological relationships, and communicate conservation values to visitors.',
    thumbnail:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    duration: '4h 30m',
    lessons: 8,
    difficulty: 'Beginner',
    instructor: 'Dr. Maria Santos',
    rating: 4.8,
    enrolled: 142,
    tags: ['Flora', 'Fauna', 'Conservation'],
  },
  {
    id: 2,
    title: 'Wildlife Tracking & Observation',
    category: 'Biodiversity',
    description:
      'Master field techniques for safely observing and tracking mammals, birds, and reptiles. Covers footprint identification, behavioral cues, and ethical wildlife watching standards.',
    thumbnail:
      'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
    duration: '6h 15m',
    lessons: 12,
    difficulty: 'Intermediate',
    instructor: 'Ranger David Kimani',
    rating: 4.9,
    enrolled: 98,
    tags: ['Mammals', 'Birds', 'Field Skills'],
  },
  {
    id: 3,
    title: 'Sustainable Eco-Tourism Practices',
    category: 'Eco-tourism',
    description:
      'Design and deliver tourism experiences that protect ecosystems while educating visitors. Includes visitor management, low-impact guiding, and community engagement strategies.',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    duration: '5h 00m',
    lessons: 10,
    difficulty: 'Intermediate',
    instructor: 'Prof. Lin Wei',
    rating: 4.7,
    enrolled: 203,
    tags: ['Tourism', 'Community', 'Low-Impact'],
  },
  {
    id: 4,
    title: 'Wilderness First Aid & Emergency Response',
    category: 'Safety',
    description:
      'Critical survival and first aid skills for remote park environments. Covers snake bite treatment, heat exhaustion, river crossings, and emergency evacuation procedures.',
    thumbnail:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    duration: '8h 00m',
    lessons: 16,
    difficulty: 'Advanced',
    instructor: 'Paramedic Sara Chen',
    rating: 5.0,
    enrolled: 167,
    tags: ['First Aid', 'Emergency', 'Survival'],
  },
  {
    id: 5,
    title: 'Bird Identification: Tropical Species',
    category: 'Biodiversity',
    description:
      'An in-depth guide to over 200 tropical bird species. Learn calls, plumage, habitats, and migration patterns. Perfect for enriching guided bird-watching tours.',
    thumbnail:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
    duration: '3h 45m',
    lessons: 9,
    difficulty: 'Beginner',
    instructor: 'Dr. Elena Vasquez',
    rating: 4.6,
    enrolled: 87,
    tags: ['Birds', 'Identification', 'Field Guide'],
  },
  {
    id: 6,
    title: 'Climate Change & Park Resilience',
    category: 'Eco-tourism',
    description:
      'Understand how climate change is reshaping national parks and learn how to communicate these changes authentically to visitors in an engaging, solution-focused way.',
    thumbnail:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    duration: '4h 00m',
    lessons: 8,
    difficulty: 'Intermediate',
    instructor: 'Dr. Kwame Asante',
    rating: 4.5,
    enrolled: 120,
    tags: ['Climate', 'Conservation', 'Education'],
  },
];

export const MOCK_LESSONS = [
  // Course 1 Lessons
  {
    id: 1,
    courseId: 1,
    order: 1,
    title: 'Introduction to Rainforest Ecosystems',
    type: 'video',
    duration: '18 min',
    description:
      'Discover what makes rainforests the most biodiverse ecosystems on Earth, covering canopy layers, nutrient cycles, and the unique conditions that support extraordinary life.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
    content:
      'Tropical rainforests cover only 6% of Earth\'s land surface but are home to more than half of all plant and animal species. The structure of a rainforest includes four distinct layers: the forest floor, understory, canopy, and emergent layer. Each layer has its own microclimate, light levels, and biodiversity.\n\nThe forest floor receives less than 2% of sunlight but hosts decomposers that recycle nutrients critical to the entire ecosystem. Fungi and bacteria break down dead matter, returning minerals to the soil within days. This rapid nutrient cycling means soils are often thin and nutrient-poor — the richness lives in the organisms, not the ground.',
    infographics: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80',
    ],
  },
  {
    id: 2,
    courseId: 1,
    order: 2,
    title: 'Keystone Species & Ecological Roles',
    type: 'video',
    duration: '22 min',
    description:
      'Learn about keystone species — organisms that have disproportionately large impacts on their ecosystems. Includes case studies on jaguars, figs, and army ants.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
    content:
      'A keystone species is one whose impact on its ecosystem is disproportionately large relative to its abundance. Remove a keystone species and the ecosystem collapses or fundamentally changes. The jaguar (Panthera onca) is a classic example — as an apex predator, it controls populations of herbivores like peccaries and capybaras, preventing overgrazing that would degrade forest structure.\n\nFig trees (Ficus spp.) are keystone mutualists: their out-of-season fruiting provides food for hundreds of species during lean periods. Army ants are keystone ecosystem engineers whose raids disturb soil, flush prey, and create feeding opportunities for dozens of "ant-following" bird species.',
    infographics: [
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80',
    ],
  },
  {
    id: 3,
    courseId: 1,
    order: 3,
    title: 'Flora Identification Field Guide',
    type: 'lesson',
    duration: '25 min',
    description:
      'Practical identification techniques for 50 common rainforest plants, using leaves, bark, flowers, and smell. Includes edible, medicinal, and toxic species.',
    videoUrl: null,
    thumbnail:
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    content:
      'Identifying plants in a rainforest requires engaging all your senses. Begin with leaf morphology: observe shape (simple vs compound), margin (smooth, toothed, lobed), venation (pinnate, palmate), and texture. Bark features like color, texture, lenticels, and smell provide additional clues.\n\nKey families to recognize: Moraceae (figs, breadfruit) - often with milky latex; Melastomataceae - distinctive parallel leaf veins; Araceae (philodendrons, anthuriums) - often with aerial roots. Always use the "crush and smell" test cautiously — many plants use chemical defenses. Never taste unknown plants.',
    infographics: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80',
    ],
  },
  // Course 2 Lessons
  {
    id: 4,
    courseId: 2,
    order: 1,
    title: 'Reading Animal Tracks & Signs',
    type: 'video',
    duration: '20 min',
    description:
      'Master the art of reading the forest floor — footprints, scat, scratches, and feeding signs that reveal what animals were here and what they were doing.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://images.unsplash.com/photo-1607893378714-007fd47c8719?w=400&q=80',
    content:
      'Animal tracking is one of the most ancient and valuable field skills. Tracks tell you species, size, gait, speed, and direction of travel. The substrate matters: soft mud shows detail; hard soil may only show pressure displacement; sand records a perfect print but erodes quickly.\n\nFoot morphology reveals lifestyle: five-toed prints with claws visible indicate bears or mustelids; retractile-claw cats leave circular prints with no claw marks; hooves create crescent shapes. Measure track length and stride length to estimate body size. Trail patterns — walking, trotting, bounding — reveal behavior and urgency.',
    infographics: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
    ],
  },
  // Course 4 Lessons (Safety)
  {
    id: 5,
    courseId: 4,
    order: 1,
    title: 'Snakebite Assessment & First Response',
    type: 'video',
    duration: '30 min',
    description:
      'Life-saving protocols for snakebite incidents in the field. Learn species identification, envenomation signs, immobilization techniques, and evacuation priorities.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://images.unsplash.com/photo-1531969179221-3f9c6ae79b03?w=400&q=80',
    content:
      'Snakebite is one of the most serious wilderness medical emergencies. Your first actions in the first 30 minutes significantly affect outcomes. STOP: prevent further envenomation. CALM: reduce heart rate to slow venom spread. IMMOBILIZE: splint the affected limb at heart level. EVACUATE: antivenin is the only definitive treatment.\n\nDo NOT: cut and suck the wound (ineffective, causes infection); apply tourniquets (causes tissue death); apply ice (causes vasoconstriction); give aspirin (increases bleeding). Photograph the snake if safely possible — species ID helps medical staff select correct antivenin. Mark time of bite and document all symptoms for medical team.',
    infographics: [],
  },
];

export const MOCK_QUIZZES = [
  {
    id: 1,
    courseId: 1,
    lessonId: 1,
    title: 'Rainforest Ecosystems Quiz',
    questions: [
      {
        id: 1,
        question: 'What percentage of Earth\'s land surface do tropical rainforests cover?',
        options: ['2%', '6%', '15%', '25%'],
        correctIndex: 1,
        explanation:
          'Rainforests cover approximately 6% of Earth\'s surface but contain over 50% of all species.',
      },
      {
        id: 2,
        question: 'Which rainforest layer receives less than 2% of sunlight?',
        options: ['Canopy', 'Understory', 'Forest Floor', 'Emergent Layer'],
        correctIndex: 2,
        explanation:
          'The forest floor receives minimal sunlight due to the dense canopy above, but hosts vital decomposers.',
      },
      {
        id: 3,
        question: 'What is the primary characteristic of rainforest soils?',
        options: [
          'Deep and nutrient-rich',
          'Thin and nutrient-poor',
          'Rocky and alkaline',
          'Sandy and well-drained',
        ],
        correctIndex: 1,
        explanation:
          'Because nutrients cycle so rapidly through organisms, soils are thin and nutrient-poor — richness lives in the life itself.',
      },
      {
        id: 4,
        question: 'How many distinct layers does a rainforest have?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctIndex: 2,
        explanation:
          'Rainforests have four layers: forest floor, understory, canopy, and emergent layer.',
      },
    ],
  },
  {
    id: 2,
    courseId: 1,
    lessonId: 2,
    title: 'Keystone Species Quiz',
    questions: [
      {
        id: 1,
        question: 'What defines a keystone species?',
        options: [
          'The most numerous species in an ecosystem',
          'The largest predator in a region',
          'A species with disproportionately large ecological impact',
          'Any endangered species',
        ],
        correctIndex: 2,
        explanation:
          'Keystone species have outsized impacts relative to their abundance — their loss fundamentally changes the ecosystem.',
      },
      {
        id: 2,
        question: 'Why are fig trees considered keystone mutualists?',
        options: [
          'They produce the most oxygen',
          'Their out-of-season fruiting feeds hundreds of species',
          'They have the deepest root systems',
          'They are resistant to disease',
        ],
        correctIndex: 1,
        explanation:
          'Fig trees fruit when other food is scarce, making them a critical resource for hundreds of animal species.',
      },
      {
        id: 3,
        question: 'What role do army ants play as ecosystem engineers?',
        options: [
          'They pollinate flowers',
          'They build soil mounds that enrich nutrients',
          'Their raids disturb soil and create feeding opportunities for birds',
          'They control pest insect populations',
        ],
        correctIndex: 2,
        explanation:
          'Army ant raids flush prey and create feeding opportunities for dozens of "ant-following" bird species.',
      },
    ],
  },
  {
    id: 3,
    courseId: 4,
    lessonId: 5,
    title: 'Snakebite Emergency Response Quiz',
    questions: [
      {
        id: 1,
        question: 'What is the MOST important action after a snakebite?',
        options: [
          'Cut and suck out the venom',
          'Apply a tourniquet immediately',
          'Calm the victim and immobilize the limb',
          'Apply ice to the wound',
        ],
        correctIndex: 2,
        explanation:
          'Calming the victim reduces heart rate and slows venom spread. Immobilization keeps the limb at heart level.',
      },
      {
        id: 2,
        question: 'Why should you NOT apply ice to a snakebite wound?',
        options: [
          'It attracts more snakes',
          'It causes vasoconstriction, worsening tissue damage',
          'It increases the victim\'s heart rate',
          'Ice is ineffective against all venoms',
        ],
        correctIndex: 1,
        explanation:
          'Ice causes vasoconstriction, concentrating venom in tissues and increasing local tissue damage.',
      },
      {
        id: 3,
        question: 'Why should you photograph the snake if safely possible?',
        options: [
          'For documentation and reporting',
          'To post on social media for awareness',
          'Species ID helps medical staff select correct antivenin',
          'To prove the incident occurred',
        ],
        correctIndex: 2,
        explanation:
          'Different snake species require different antivenins. Correct species ID can be life-saving.',
      },
    ],
  },
];

export const MOCK_CERTIFICATIONS = [
  {
    id: 1,
    title: 'Certified Biodiversity Guide',
    courseId: 1,
    issuedDate: '2024-01-15',
    expiryDate: '2026-01-15',
    level: 'Foundation',
    badgeColor: '#16a34a',
  },
  {
    id: 2,
    title: 'Eco-Tourism Professional',
    courseId: 3,
    issuedDate: '2024-03-22',
    expiryDate: '2026-03-22',
    level: 'Intermediate',
    badgeColor: '#0891b2',
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Course Available',
    message: 'Bird Identification: Tropical Species has been added to your curriculum.',
    time: '2h ago',
    read: false,
    type: 'course',
  },
  {
    id: 2,
    title: 'Quiz Reminder',
    message: 'Complete the Keystone Species quiz to earn your progress badge.',
    time: '1d ago',
    read: false,
    type: 'quiz',
  },
  {
    id: 3,
    title: 'Certification Expiring',
    message: 'Your Eco-Tourism Professional cert expires in 90 days. Renew soon.',
    time: '3d ago',
    read: true,
    type: 'cert',
  },
];

export const CATEGORIES = ['All', 'Biodiversity', 'Eco-tourism', 'Safety'];

export const ADMIN_STATS = {
  totalUsers: 247,
  activeCourses: 6,
  completionRate: 73,
  pendingCerts: 18,
};
