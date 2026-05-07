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
  // ── Biodiversity ─────────────────────────────────────────────
  {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    category: 'Biodiversity',
    description:
      'Explore the rich tapestry of life in tropical rainforests. Learn to identify key species, understand ecological relationships, and communicate conservation values to visitors.',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
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
      'Master field techniques for safely observing and tracking mammals, birds, and reptiles. Covers footprint identification, behavioural cues, and ethical wildlife watching standards.',
    thumbnail: 'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
    duration: '6h 15m',
    lessons: 12,
    difficulty: 'Intermediate',
    instructor: 'Ranger David Kimani',
    rating: 4.9,
    enrolled: 98,
    tags: ['Mammals', 'Birds', 'Field Skills'],
  },
  {
    id: 5,
    title: 'Bird Identification: Tropical Species',
    category: 'Biodiversity',
    description:
      'An in-depth guide to over 200 tropical bird species. Learn calls, plumage, habitats, and migration patterns. Perfect for enriching guided bird-watching tours.',
    thumbnail: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
    duration: '3h 45m',
    lessons: 9,
    difficulty: 'Beginner',
    instructor: 'Dr. Elena Vasquez',
    rating: 4.6,
    enrolled: 87,
    tags: ['Birds', 'Identification', 'Field Guide'],
  },

  // ── Conservation ─────────────────────────────────────────────
  {
    id: 7,
    title: 'Wildlife Conservation Principles',
    category: 'Conservation',
    description:
      'Core principles of wildlife conservation including habitat protection, species recovery programmes, anti-poaching strategies, and community-based conservation approaches.',
    thumbnail: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80',
    duration: '5h 00m',
    lessons: 10,
    difficulty: 'Intermediate',
    instructor: 'Dr. Priya Nair',
    rating: 4.7,
    enrolled: 134,
    tags: ['Conservation', 'Wildlife', 'Habitats'],
  },
  {
    id: 8,
    title: 'Wetlands & Marine Ecosystem Protection',
    category: 'Conservation',
    description:
      'Understanding the ecological importance of wetlands and marine systems. Covers mangrove conservation, coral reef protection, and sustainable fisheries management.',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    duration: '4h 15m',
    lessons: 8,
    difficulty: 'Intermediate',
    instructor: 'Dr. Lena Bjornsson',
    rating: 4.5,
    enrolled: 76,
    tags: ['Marine', 'Wetlands', 'Coral Reefs'],
  },

  // ── Eco-tourism ──────────────────────────────────────────────
  {
    id: 3,
    title: 'Sustainable Eco-Tourism Practices',
    category: 'Eco-tourism',
    description:
      'Design and deliver tourism experiences that protect ecosystems while educating visitors. Includes visitor management, low-impact guiding, and community engagement strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    duration: '5h 00m',
    lessons: 10,
    difficulty: 'Intermediate',
    instructor: 'Prof. Lin Wei',
    rating: 4.7,
    enrolled: 203,
    tags: ['Tourism', 'Community', 'Low-Impact'],
  },
  {
    id: 6,
    title: 'Climate Change & Park Resilience',
    category: 'Eco-tourism',
    description:
      'Understand how climate change is reshaping national parks and learn how to communicate these changes authentically to visitors in an engaging, solution-focused way.',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    duration: '4h 00m',
    lessons: 8,
    difficulty: 'Intermediate',
    instructor: 'Dr. Kwame Asante',
    rating: 4.5,
    enrolled: 120,
    tags: ['Climate', 'Conservation', 'Education'],
  },

  // ── Legislation ──────────────────────────────────────────────
  {
    id: 9,
    title: 'Wildlife Protection Laws & Regulations',
    category: 'Legislation',
    description:
      'Comprehensive overview of national and international wildlife protection laws including CITES, the Wildlife Conservation Act, and enforcement procedures for park guides.',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    duration: '3h 30m',
    lessons: 7,
    difficulty: 'Beginner',
    instructor: 'Assoc. Prof. Razif Ahmad',
    rating: 4.4,
    enrolled: 95,
    tags: ['Law', 'CITES', 'Enforcement'],
  },
  {
    id: 10,
    title: 'Park Entry & Visitor Compliance',
    category: 'Legislation',
    description:
      'Procedures for enforcing park entry regulations, managing non-compliant visitors, reporting violations, and understanding a guide\'s legal responsibilities in the field.',
    thumbnail: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80',
    duration: '2h 45m',
    lessons: 6,
    difficulty: 'Beginner',
    instructor: 'Senior Ranger Halim Yusof',
    rating: 4.6,
    enrolled: 112,
    tags: ['Compliance', 'Visitors', 'Legal'],
  },

  // ── Safety ───────────────────────────────────────────────────
  {
    id: 4,
    title: 'Wilderness First Aid & Emergency Response',
    category: 'Safety',
    description:
      'Critical survival and first aid skills for remote park environments. Covers snake bite treatment, heat exhaustion, river crossings, and emergency evacuation procedures.',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    duration: '8h 00m',
    lessons: 16,
    difficulty: 'Advanced',
    instructor: 'Paramedic Sara Chen',
    rating: 5.0,
    enrolled: 167,
    tags: ['First Aid', 'Emergency', 'Survival'],
  },
  {
    id: 11,
    title: 'Dangerous Animal Encounters & Response',
    category: 'Safety',
    description:
      'Protocols for safely handling encounters with dangerous animals including crocodiles, elephants, venomous snakes, and wild boar. Field safety procedures and evacuation planning.',
    thumbnail: 'https://images.unsplash.com/photo-1551206190-a2aeb05dff91?w=400&q=80',
    duration: '4h 30m',
    lessons: 9,
    difficulty: 'Advanced',
    instructor: 'Ranger Siti Rahimah',
    rating: 4.9,
    enrolled: 143,
    tags: ['Animals', 'Danger', 'Protocols'],
  },
];

export const MOCK_LESSONS = [
  // ── Course 1 Lessons (Rainforest Biodiversity) ───────────────
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
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    content:
      'Identifying plants in a rainforest requires engaging all your senses. Begin with leaf morphology: observe shape (simple vs compound), margin (smooth, toothed, lobed), venation (pinnate, palmate), and texture. Bark features like color, texture, lenticels, and smell provide additional clues.\n\nKey families to recognize: Moraceae (figs, breadfruit) - often with milky latex; Melastomataceae - distinctive parallel leaf veins; Araceae (philodendrons, anthuriums) - often with aerial roots. Always use the "crush and smell" test cautiously — many plants use chemical defenses. Never taste unknown plants.',
    infographics: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80',
    ],
  },

  // ── Course 2 Lessons (Wildlife Tracking) ────────────────────
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
    thumbnail: 'https://images.unsplash.com/photo-1607893378714-007fd47c8719?w=400&q=80',
    content:
      'Animal tracking is one of the most ancient and valuable field skills. Tracks tell you species, size, gait, speed, and direction of travel. The substrate matters: soft mud shows detail; hard soil may only show pressure displacement; sand records a perfect print but erodes quickly.\n\nFoot morphology reveals lifestyle: five-toed prints with claws visible indicate bears or mustelids; retractile-claw cats leave circular prints with no claw marks; hooves create crescent shapes. Measure track length and stride length to estimate body size.',
    infographics: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
    ],
  },

  // ── Course 4 Lessons (Safety) ────────────────────────────────
  {
    id: 5,
    courseId: 4,
    order: 1,
    title: 'Snakebite Assessment & First Response',
    type: 'video',
    duration: '30 min',
    description:
      'Life-saving protocols for snakebite incidents in the field. Learn species identification, envenomation signs, immobilisation techniques, and evacuation priorities.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1531969179221-3f9c6ae79b03?w=400&q=80',
    content:
      'Snakebite is one of the most serious wilderness medical emergencies. Your first actions in the first 30 minutes significantly affect outcomes. STOP: prevent further envenomation. CALM: reduce heart rate to slow venom spread. IMMOBILISE: splint the affected limb at heart level. EVACUATE: antivenin is the only definitive treatment.\n\nDo NOT: cut and suck the wound; apply tourniquets; apply ice; give aspirin. Photograph the snake if safely possible — species ID helps medical staff select correct antivenin.',
    infographics: [],
  },

  // ── Course 7 Lessons (Conservation) ─────────────────────────
  {
    id: 6,
    courseId: 7,
    order: 1,
    title: 'Foundations of Wildlife Conservation',
    type: 'video',
    duration: '22 min',
    description:
      'An introduction to core conservation principles, the history of wildlife protection, and how park guides play a critical role in frontline conservation efforts.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80',
    content:
      'Conservation biology emerged as a formal discipline in the 1980s in response to accelerating biodiversity loss. At its core, conservation seeks to protect species, habitats, and ecosystems from excessive rates of extinction driven by human activity.\n\nPark guides are among the most important frontline conservation actors. They serve as the eyes and ears of protected areas, detecting poaching activities, monitoring wildlife populations, and educating thousands of visitors each year. A well-trained guide can change the attitude of an entire tour group toward wildlife protection.',
    infographics: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ],
  },

  // ── Course 9 Lessons (Legislation) ──────────────────────────
  {
    id: 7,
    courseId: 9,
    order: 1,
    title: 'CITES & International Wildlife Trade Law',
    type: 'lesson',
    duration: '20 min',
    description:
      'Understanding the Convention on International Trade in Endangered Species (CITES) and how it protects wildlife from overexploitation through international trade controls.',
    videoUrl: null,
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    content:
      'CITES (the Convention on International Trade in Endangered Species of Wild Fauna and Flora) is an international agreement between governments. Its aim is to ensure that international trade in specimens of wild animals and plants does not threaten their survival.\n\nSpecies are classified into three Appendices based on the level of protection needed. Appendix I includes species threatened with extinction — commercial trade is generally prohibited. Appendix II includes species not necessarily threatened but where trade must be controlled. Appendix III lists species protected in at least one country.',
    infographics: [
      'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80',
    ],
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
        explanation: 'Rainforests cover approximately 6% of Earth\'s surface but contain over 50% of all species.',
      },
      {
        id: 2,
        question: 'Which rainforest layer receives less than 2% of sunlight?',
        options: ['Canopy', 'Understory', 'Forest Floor', 'Emergent Layer'],
        correctIndex: 2,
        explanation: 'The forest floor receives minimal sunlight due to the dense canopy above, but hosts vital decomposers.',
      },
      {
        id: 3,
        question: 'What is the primary characteristic of rainforest soils?',
        options: ['Deep and nutrient-rich', 'Thin and nutrient-poor', 'Rocky and alkaline', 'Sandy and well-drained'],
        correctIndex: 1,
        explanation: 'Because nutrients cycle so rapidly through organisms, soils are thin and nutrient-poor.',
      },
      {
        id: 4,
        question: 'How many distinct layers does a rainforest have?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctIndex: 2,
        explanation: 'Rainforests have four layers: forest floor, understory, canopy, and emergent layer.',
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
        options: ['The most numerous species in an ecosystem', 'The largest predator in a region', 'A species with disproportionately large ecological impact', 'Any endangered species'],
        correctIndex: 2,
        explanation: 'Keystone species have outsized impacts relative to their abundance — their loss fundamentally changes the ecosystem.',
      },
      {
        id: 2,
        question: 'Why are fig trees considered keystone mutualists?',
        options: ['They produce the most oxygen', 'Their out-of-season fruiting feeds hundreds of species', 'They have the deepest root systems', 'They are resistant to disease'],
        correctIndex: 1,
        explanation: 'Fig trees fruit when other food is scarce, making them a critical resource for hundreds of animal species.',
      },
      {
        id: 3,
        question: 'What role do army ants play as ecosystem engineers?',
        options: ['They pollinate flowers', 'They build soil mounds that enrich nutrients', 'Their raids flush prey and create feeding opportunities for birds', 'They control pest insect populations'],
        correctIndex: 2,
        explanation: 'Army ant raids create feeding opportunities for dozens of ant-following bird species.',
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
        options: ['Cut and suck out the venom', 'Apply a tourniquet immediately', 'Calm the victim and immobilise the limb', 'Apply ice to the wound'],
        correctIndex: 2,
        explanation: 'Calming the victim reduces heart rate and slows venom spread. Immobilisation keeps the limb at heart level.',
      },
      {
        id: 2,
        question: 'Why should you NOT apply ice to a snakebite wound?',
        options: ['It attracts more snakes', 'It causes vasoconstriction, worsening tissue damage', 'It increases the victim\'s heart rate', 'Ice is ineffective against all venoms'],
        correctIndex: 1,
        explanation: 'Ice causes vasoconstriction, concentrating venom in tissues and increasing local tissue damage.',
      },
      {
        id: 3,
        question: 'Why should you photograph the snake if safely possible?',
        options: ['For documentation and reporting', 'To post on social media for awareness', 'Species ID helps medical staff select correct antivenin', 'To prove the incident occurred'],
        correctIndex: 2,
        explanation: 'Different snake species require different antivenins. Correct species ID can be life-saving.',
      },
    ],
  },
  {
    id: 4,
    courseId: 9,
    lessonId: 7,
    title: 'Wildlife Legislation Quiz',
    questions: [
      {
        id: 1,
        question: 'What does CITES stand for?',
        options: [
          'Conservation of International Trade in Endangered Species',
          'Convention on International Trade in Endangered Species',
          'Committee for International Trade and Environmental Safety',
          'Convention for Indigenous and Traditional Ecological Systems',
        ],
        correctIndex: 1,
        explanation: 'CITES stands for the Convention on International Trade in Endangered Species of Wild Fauna and Flora.',
      },
      {
        id: 2,
        question: 'Which CITES Appendix includes species where commercial trade is generally prohibited?',
        options: ['Appendix I', 'Appendix II', 'Appendix III', 'Appendix IV'],
        correctIndex: 0,
        explanation: 'Appendix I includes species threatened with extinction. Commercial international trade is generally prohibited.',
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

// ─── Notifications — full spec ────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Training Module Released',
    message: 'Wildlife Protection Laws & Regulations has been released. Deadline: 30 Apr 2026.',
    time: '1h ago',
    read: false,
    type: 'course',
  },
  {
    id: 2,
    title: '🎉 Congratulations!',
    message: 'You scored 85% and passed Rainforest Biodiversity Fundamentals.',
    time: '3h ago',
    read: false,
    type: 'result_pass',
  },
  {
    id: 3,
    title: 'Deadline Reminder',
    message: 'Wilderness First Aid module is due in 24 hours. Complete it now to avoid missing the deadline.',
    time: '5h ago',
    read: false,
    type: 'reminder',
  },
  {
    id: 4,
    title: 'Certificate Approved! 🎖',
    message: 'Congratulations! Here is your certificate from Eco-Tourism Professional. Download it from the Certifications tab.',
    time: '1d ago',
    read: true,
    type: 'cert',
  },
  {
    id: 5,
    title: 'Quiz Result',
    message: 'Unfortunately, you failed Snakebite Emergency Response with a score of 55%. Would you like to retake?',
    time: '2d ago',
    read: true,
    type: 'result_fail',
  },
  {
    id: 6,
    title: 'Announcement from Admin',
    message: 'All guides are required to complete the Safety modules before the field season begins on 1 May 2026.',
    time: '3d ago',
    read: true,
    type: 'announcement',
  },
];

// Admin-side notifications (registration requests etc.)
export const MOCK_ADMIN_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Registration Request',
    message: 'Ahmad bin Abdullah has submitted an application to join as a Park Guide. Review and approve.',
    time: '2h ago',
    read: false,
    type: 'registration',
    userId: null,
  },
  {
    id: 2,
    title: '⚠️ Abnormal Activity Detected',
    message: 'Unusual movement detected in Sector 7B at 14:32. Review evidence frames.',
    time: '4h ago',
    read: false,
    type: 'alert',
    severity: 'high',
  },
  {
    id: 3,
    title: 'Certificate Pending Approval',
    message: 'Amira Hassan has completed Wildlife Conservation Principles and is awaiting certificate approval.',
    time: '1d ago',
    read: true,
    type: 'cert_approval',
    userId: 2,
  },
];

// ─── Categories — all 5 required ─────────────────────────────────────
export const CATEGORIES = ['All', 'Biodiversity', 'Conservation', 'Eco-tourism', 'Legislation', 'Safety'];

export const ADMIN_STATS = {
  totalUsers: 247,
  activeCourses: 11,
  completionRate: 73,
  pendingCerts: 18,
};

// Alert count for admin nav badge
export const MOCK_ALERTS_COUNT = 1;
