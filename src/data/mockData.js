export const userContext = { 
  name: "Alex Johnson", 
  username: "@alex_j_vibes", 
  coins: 1250,
  school: "Floyd Middle Magnet",
  location: "Montgomery, AL",
  weather: "⛅ 72°F",
  date: "Monday, Mar 9, 2026",
  time: "9:41 AM",
  period: "Period 2: Intro to Logic",
  inSchool: true,
  overallGrade: "82%",
  streak: "14 Days",
  mood: "Focused 🧠",
  pet: {
    name: "Pixel the Owl",
    status: "Vitality 98%",
    message: "Hoot! Keep up the good work on those algorithms!"
  }
};

export const petData = {
  name: "Pixel the Owl",
  stage: "Level 4: Scholar",
  traits: ["Nocturnal", "Logic-Boosted", "Loyal"],
  vitality: 98,
  dialogue: [
    "Hoot! Keep up the good work on those algorithms!",
    "Did you know the first computer bug was an actual moth?",
    "I've been analyzing your recent quizzes. You're improving!",
    "Don't forget to equip your new items before class.",
    "A wise owl always double-checks their loops!"
  ]
};

export const initialClosetItems = [
  { id: 401, name: "Fair", type: "skinColor", owned: true, equipped: true },
  { id: 402, name: "Warm", type: "skinColor", owned: true, equipped: false },
  { id: 403, name: "Deep", type: "skinColor", owned: true, equipped: false },
  { id: 404, name: "Alien Green", type: "skinColor", owned: false, cost: 600 },
  { id: 501, name: "Brown Eyes", type: "eyeColor", owned: true, equipped: true },
  { id: 502, name: "Blue Eyes", type: "eyeColor", owned: true, equipped: false },
  { id: 601, name: "Black Hair", type: "hairColor", owned: true, equipped: true },
  { id: 602, name: "Blonde Hair", type: "hairColor", owned: true, equipped: false },
  { id: 603, name: "Neon Pink Hair", type: "hairColor", owned: false, cost: 300 },
  { id: 701, name: "Short Messy", type: "hairStyle", owned: true, equipped: true },
  { id: 702, name: "Long Wavy", type: "hairStyle", owned: true, equipped: false },
  { id: 801, name: "Plain White T-Shirt", type: "top", owned: true, equipped: false },
  { id: 802, name: "Blue Jeans", type: "bottom", owned: true, equipped: true },
  { id: 803, name: "Classic Sneakers", type: "shoes", owned: true, equipped: true },
  { id: 101, name: "Neon Tech Hoodie", type: "top", owned: true, equipped: true },
  { id: 104, name: "Cyberpunk Visor", type: "accessory", owned: true, equipped: true },
  { id: 106, name: "Diamond Grills", type: "accessory", owned: false, cost: 1200 },
  { id: 107, name: "Bear Glass Cup", type: "accessory", owned: false, cost: 800 },
  { id: 108, name: "Rare Green Sword", type: "accessory", owned: true, equipped: false, robloxCode: "RBLX-GRN-SWRD-001" },
  { id: 901, name: "Idle", type: "pose", owned: true, equipped: true },
  { id: 902, name: "Hands in Pockets", type: "pose", owned: false, cost: 300 },
  { id: 903, name: "Victory Pose", type: "pose", owned: false, cost: 500 },
  { id: 1001, name: "Pet Cyber Visor", type: "pet", owned: true, equipped: true },
  { id: 1002, name: "Pet Top Hat", type: "pet", owned: false, cost: 600 },
  { id: 301, name: "Tech Room", type: "theme", owned: true, equipped: true, storeImage: "/tech_room_store.jpg", bgImage: "/tech_room.jpg" },
  { id: 302, name: "Cyber Arcade", type: "theme", owned: false, cost: 800, storeImage: "/cyber_arcade_store.jpg", bgImage: "/cyber_arcade.jpg" }
];

export const initialQuests = [
  { id: 1, title: "Algebra II: Midterm Review", type: "synced", status: "completed", coins: 150, source: "Gradebook" },
  { id: 2, title: "Python Algorithms: Module 4", type: "synced", status: "in-progress", coins: 100, source: "Gradebook" },
  { id: 3, title: "Read Chapter 4: Great Gatsby", type: "synced", status: "not-started", coins: 50, source: "Gradebook" },
  { id: 4, title: "Library Shelf Organization", type: "bounty", status: "not-started", coins: 200, source: "School Bounty" },
  { id: 5, title: "Peer Tutoring: Freshman Math", type: "bounty", status: "not-started", coins: 300, source: "Community" },
  { id: 6, title: "NASA MSFC Cybersecurity Internship", type: "s-rank", status: "not-started", coins: 5000, source: "S-Rank Mission" }
];

export const vibeFeed = [
  { id: 1, text: "@sarah_connor from Montgomery High earned the 'Master Mathematician Sword'!", time: "2m ago" },
  { id: 2, text: "@neo_hacker is looking to trade a 'Pythagoras Holographic' card.", time: "15m ago" },
  { id: 3, text: "@skater_dude completed the 'City Clean-up' Community Bounty!", time: "1h ago" },
  { id: 4, text: "@logic_queen from Madison High leveled up to Rank 15.", time: "3h ago" }
];

export const inboxMessages = [
  { id: 1, sender: "Ms. Lovelace", text: "Great job on the logic module today. Please review my feedback on question 4.", isTeacher: true },
  { id: 2, sender: "@cyber_kid", text: "Hey! Would you trade your Civic Duty Foil for my Ada Lovelace Base Card?", isTeacher: false }
];

export const announcements = [
  { id: 1, title: "Weather Alert", text: "Severe thunderstorm watch until 3:00 PM. After-school robotics club is moved to Room 102.", type: "warning" },
  { id: 2, title: "Upcoming Holiday", text: "Spring Break begins next Monday, March 16th. Ensure all bounties are submitted by Friday.", type: "info" }
];

export const trophies = [
  { id: 1, name: "Cyber Hacker Glasses", date: "February 2026", validator: "Montgomery Board of Ed.", profTranslation: "Advanced Network Security proficiency.", color: "from-green-400 to-emerald-600", customImage: "/trophy_glasses.jpg" },
  { id: 2, name: "Master Mathematician Sword", date: "January 2026", validator: "State AP Validator", profTranslation: "Algebra II Mastery (Top 5%).", color: "from-purple-400 to-indigo-600", customImage: "/trophy_sword.jpg" },
  { id: 3, name: "Civic Leader Crown", date: "November 2025", validator: "Mayor's Youth Council", profTranslation: "Logged 50+ hours of community service.", color: "from-yellow-400 to-orange-500", customImage: "/trophy_crown.jpg" }
];

export const tradingCards = [
  { id: 201, name: "The Pythagoras Holographic", series: "Math Legends", owned: 2, lore: "Ancient Ionian Greek philosopher and founder of Pythagoreanism.", rarity: "Legendary", earnedFrom: "Perfect Midterm.", stats: { Logic: 90, History: 40 }, customImage: "/pythagoras.jpg" },
  { id: 202, name: "Ada Lovelace Base Card", series: "Tech Pioneers", owned: 1, lore: "English mathematician and writer, chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer.", rarity: "Epic", earnedFrom: "Logic course.", stats: { Logic: 95, History: 85 }, customImage: "/ada_lovelace.jpg" },
  { id: 203, name: "Civic Duty Foil", series: "Community", owned: 1, lore: "Awarded to students who have demonstrated exceptional dedication to their local community.", rarity: "Rare", earnedFrom: "Verified volunteering hours.", stats: { Empathy: 80, Lead: 90 }, customImage: "/civic_duty.jpg" }
];

export const peerDecks = [
  { 
    id: 1, name: "Sarah Connor", username: "@terminator_fan", 
    deck: [
      { id: 301, name: "Grace Hopper Silver", series: "Tech Pioneers", lore: "Pioneer of computer programming who invented one of the first linkers.", rarity: "Epic", stats: { Logic: 88, History: 92 }, customImage: "" },
      { id: 302, name: "Alan Turing Base", series: "Math Legends", lore: "Father of theoretical computer science and artificial intelligence.", rarity: "Rare", stats: { Logic: 99, History: 80 }, customImage: "" }
    ]
  },
  { 
    id: 2, name: "Neo Anderson", username: "@neo_hacker", 
    deck: [
      { id: 303, name: "Morpheus Holographic", series: "Legends", lore: "A true leader who believes in the potential of humanity.", rarity: "Legendary", stats: { Empathy: 85, Lead: 95 }, customImage: "" }
    ]
  }
];

export const initialCardHistory = [
  { id: 1, date: "Mar 8, 2026", cardName: "The Pythagoras Holographic", action: "Earned", details: "Perfect Midterm in Intro to Logic." },
  { id: 2, date: "Feb 14, 2026", cardName: "Ada Lovelace Base Card", action: "Earned", details: "Completed Python Algorithms Module 2." },
  { id: 3, date: "Jan 30, 2026", cardName: "Civic Duty Foil", action: "Traded", details: "Traded 'Alan Turing Base' with @skater_dude." }
];

import { Brain, Cpu, BookOpen } from 'lucide-react';
export const atlasActionItems = [
  { id: 1, title: "Module 4: XOR Gates", type: "tutoring", due: "Required by Ms. Lovelace", status: "waiting", description: "Ms. Lovelace requested ATLAS review this concept with you before your next attempt.", actionLabel: "Connect to ATLAS", linkedChatId: 1, icon: Brain },
  { id: 2, title: "Boolean Logic Lab", type: "assignment", due: "Today, 11:59 PM", status: "pending", description: "Complete the interactive circuit board simulation.", actionLabel: "Get Help from ATLAS", icon: Cpu },
  { id: 3, title: "Read Chapter 5", type: "knowledge_check", due: "Tomorrow, 8:00 AM", status: "pending", description: "Read pages 112-145 on Logic Gate Combinations.", actionLabel: "Start Knowledge Check", icon: BookOpen }
];

export const atlasSuggestions = [
  { id: 101, title: "Review Truth Tables", reason: "Based on your 62% score in the recent practice test, ATLAS identified a slight gap in AND/OR evaluation.", actionText: "Start Quick Review", actionType: "review", coins: 50 },
  { id: 102, title: "Attempt S-Rank Bounty", reason: "Your overall logic proficiency is high enough to qualify for the 'Library Shelf Organization' algorithm bounty.", actionText: "View Bounty Analysis", actionType: "bounty", potentialCoins: 500 }
];

export const atlasConversations = [
  { id: 1, title: "Required Tutoring: XOR Gates", isRequired: true, isArchived: false, messages: [{ role: 'model', text: "ATLAS online. Hello Alex. I see Ms. Lovelace has requested we review XOR (Exclusive OR) gates before you retake your Module 4 Quiz. Are you ready to begin?", isNew: false }] },
  { id: 2, title: "Lab 3 Debugging", isRequired: false, isArchived: false, messages: [{ role: 'user', text: "Can you help me figure out why my circuit isn't lighting up? I have an AND gate connected to a switch.", isNew: false }, { role: 'model', text: "I can certainly help you debug that, Alex. For an AND gate to output a signal (light up), what must be true about its inputs?", isNew: false }] }
];
