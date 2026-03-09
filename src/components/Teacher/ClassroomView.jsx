import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Briefcase, User, X, AlertTriangle, 
  MessageSquare, Users, RefreshCw, Image as ImageIcon, 
  CheckCircle, Award, Sparkles, ImageOff, Bell, MapPin
} from 'lucide-react';

const getApiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_GEMINI_API_KEY || "";
    }
  } catch (e) {
    console.warn("Environment variables not accessible.", e);
  }
  return "";
};
const apiKey = getApiKey();

// --- GLOBAL IMAGE CACHE & QUEUE ---
const imageCache = new Map();
const generationQueue = [];
let activeGenerations = 0;
const MAX_CONCURRENT = 3; 

const processQueue = async () => {
  if (activeGenerations >= MAX_CONCURRENT || generationQueue.length === 0) return;
  activeGenerations++;
  const { prompt, resolve, reject } = generationQueue.shift();
  try {
    const result = await fetchWithBackoff(prompt);
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    activeGenerations--;
    processQueue(); 
  }
};

const enqueueGeneration = (prompt) => {
  return new Promise((resolve, reject) => {
    generationQueue.push({ prompt, resolve, reject });
    processQueue();
  });
};

const fetchWithBackoff = async (prompt) => {
  if (!apiKey && typeof __firebase_config === 'undefined') return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  const payload = { instances: { prompt }, parameters: { sampleCount: 1 } };
  const delays = [1000, 2000];
  for (let i = 0; i < delays.length; i++) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        const data = await res.json();
        if (data.predictions?.[0]) return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
      }
    } catch (err) { console.error(err); }
    await new Promise(r => setTimeout(r, delays[i]));
  }
  return null;
};

// --- AI ASSET COMPONENT ---
const AssetImage = ({ prompt, className, alt, loadingText = "Sketching..." }) => {
  const [imgSrc, setImgSrc] = useState(imageCache.get(prompt) || null);
  const [loading, setLoading] = useState(!imageCache.has(prompt));

  useEffect(() => {
    setLoading(true);
    if (imageCache.has(prompt)) {
      setImgSrc(imageCache.get(prompt));
      setLoading(false);
      return;
    }
    if (!apiKey && typeof __firebase_config === 'undefined') {
       setLoading(false);
       return;
    }
    let isMounted = true;
    enqueueGeneration(prompt).then(res => {
      if (isMounted && res) { setImgSrc(res); imageCache.set(prompt, res); }
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [prompt]);

  if (loading) return (
    <div className={`bg-slate-800 flex flex-col items-center justify-center border border-slate-700 ${className}`}>
       <Sparkles className="animate-spin text-cyan-500/50 mb-1" size={16} />
       <span className="text-[7px] text-slate-400 uppercase font-mono px-1 animate-pulse text-center leading-tight">{loadingText}</span>
    </div>
  );
  if (!imgSrc) return <div className={`bg-slate-900 flex items-center justify-center border border-slate-800 ${className}`}><ImageOff size={16} className="text-slate-700" /></div>;
  return <img src={imgSrc} alt={alt} className={`object-cover ${className}`} />;
};

// --- PIXEL RENDERERS ---
const PixelAvatar = ({ config, isSmall = false }) => {
  const colors = {
    skin: { 'Fair': '#ffedd5', 'Warm': '#f5b041', 'Deep': '#8b5a2b', 'Alien Green': '#4ade80', 'Bubblegum Pink': '#f472b6' },
    eyes: { 'Brown Eyes': '#452b11', 'Blue Eyes': '#3b82f6' },
    hair: { 'Black Hair': '#1e293b', 'Blonde Hair': '#fbbf24', 'Neon Pink Hair': '#ec4899' },
    top: { 'Plain White T-Shirt': '#f8fafc', 'Neon Tech Hoodie': '#06b6d4', 'Black Hoodie': '#0f172a', 'Varsity Jacket': '#ef4444' },
    bottom: { 'Blue Jeans': '#1e40af', 'Black Tech Joggers': '#0f172a' },
    shoes: { 'Classic Sneakers': '#e2e8f0', 'Neon High-Tops': '#a855f7' }
  };
  const getC = (cat, name) => colors[cat]?.[name] || '#94a3b8';

  if (!config) return null;

  return (
    <div className={`${isSmall ? 'w-20 h-20' : 'w-56 h-56'} relative transform transition-transform ${!isSmall && 'animate-float'}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" style={{ imageRendering: 'pixelated' }}>
        {!isSmall && <ellipse cx="16" cy="30" rx="7" ry="1.5" fill="rgba(0,0,0,0.4)" />}
        {config.hairStyle === 'Long Wavy' && (
          <><rect x="7" y="8" width="18" height="14" fill={getC('hair', config.hairColor)} /><rect x="6" y="12" width="20" height="8" fill={getC('hair', config.hairColor)} /><rect x="7" y="22" width="4" height="2" fill={getC('hair', config.hairColor)} /><rect x="21" y="22" width="4" height="2" fill={getC('hair', config.hairColor)} /><rect x="12" y="22" width="8" height="1" fill={getC('hair', config.hairColor)} /></>
        )}
        <rect x="12" y="22" width="3" height="7" fill={getC('skin', config.skinColor)} />
        <rect x="17" y="22" width="3" height="7" fill={getC('skin', config.skinColor)} />
        <rect x="12" y="22" width="3" height="1" fill="rgba(0,0,0,0.2)" />
        <rect x="17" y="22" width="3" height="1" fill="rgba(0,0,0,0.2)" />
        <rect x="11" y="28" width="4" height="2" fill={getC('shoes', config.shoes)} />
        <rect x="17" y="28" width="4" height="2" fill={getC('shoes', config.shoes)} />
        <rect x="11" y="29" width="4" height="1" fill="rgba(0,0,0,0.15)" />
        <rect x="17" y="29" width="4" height="1" fill="rgba(0,0,0,0.15)" />
        <rect x="12" y="20" width="8" height="3" fill={getC('bottom', config.bottom)} />
        <rect x="12" y="23" width="3" height="3" fill={getC('bottom', config.bottom)} />
        <rect x="17" y="23" width="3" height="3" fill={getC('bottom', config.bottom)} />
        <rect x="12" y="20" width="8" height="1" fill="rgba(0,0,0,0.15)" />
        <rect x="14" y="23" width="1" height="3" fill="rgba(0,0,0,0.15)" />
        <rect x="19" y="23" width="1" height="3" fill="rgba(0,0,0,0.15)" />

        {config.pose === 'Hands in Pockets' ? (
          <><rect x="10" y="15" width="2" height="6" fill={getC('skin', config.skinColor)} /><rect x="20" y="15" width="2" height="6" fill={getC('skin', config.skinColor)} /></>
        ) : config.pose === 'Victory Pose' ? (
          <><rect x="9" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /><rect x="21" y="8" width="3" height="6" fill={getC('skin', config.skinColor)} /> </>
        ) : (
          <><rect x="9" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /><rect x="20" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /></>
        )}
        <rect x="12" y="14" width="8" height="7" fill={getC('top', config.top)} />
        <rect x="9" y="14" width="3" height="4" fill={getC('top', config.top)} /> 
        {config.pose === 'Victory Pose' ? (
          <rect x="20" y="12" width="4" height="3" fill={getC('top', config.top)} /> 
        ) : (
          <rect x="20" y="14" width="3" height="4" fill={getC('top', config.top)} /> 
        )}
        <rect x="12" y="20" width="8" height="1" fill="rgba(0,0,0,0.15)" />
        <rect x="9" y="17" width="3" height="1" fill="rgba(0,0,0,0.15)" />

        <rect x="14" y="13" width="4" height="2" fill={getC('skin', config.skinColor)} />
        <rect x="14" y="13" width="4" height="2" fill="rgba(0,0,0,0.15)" /> 
        <rect x="11" y="5" width="10" height="9" fill={getC('skin', config.skinColor)} rx="1" />
        <rect x="12" y="9" width="2" height="2" fill="#fff" />
        <rect x="13" y="9" width="1" height="2" fill={getC('eyes', config.eyeColor)} />
        <rect x="18" y="9" width="2" height="2" fill="#fff" />
        <rect x="18" y="9" width="1" height="2" fill={getC('eyes', config.eyeColor)} />
        <rect x="15" y="12" width="2" height="1" fill="rgba(0,0,0,0.2)" />
        {config.hairStyle === 'Short Messy' && (
          <><rect x="10" y="3" width="12" height="4" fill={getC('hair', config.hairColor)} rx="1" /><rect x="11" y="2" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="15" y="1" width="2" height="3" fill={getC('hair', config.hairColor)} /><rect x="19" y="2" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="9" y="5" width="2" height="5" fill={getC('hair', config.hairColor)} /><rect x="21" y="5" width="2" height="5" fill={getC('hair', config.hairColor)} /><rect x="11" y="6" width="2" height="3" fill={getC('hair', config.hairColor)} /><rect x="15" y="6" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="19" y="6" width="2" height="3" fill={getC('hair', config.hairColor)} /></>
        )}
        {config.hairStyle === 'Long Wavy' && (
          <><rect x="10" y="3" width="12" height="3" fill={getC('hair', config.hairColor)} rx="1" /><rect x="9" y="5" width="3" height="6" fill={getC('hair', config.hairColor)} /><rect x="20" y="5" width="3" height="6" fill={getC('hair', config.hairColor)} /><rect x="11" y="5" width="6" height="2" fill={getC('hair', config.hairColor)} /></>
        )}
      </svg>
    </div>
  );
};

const PixelPet = ({ config }) => {
  const isCat = config?.type === 'cat';

  if (!config) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center z-10">
      <div className="w-24 h-24 transform transition-transform animate-float-fast">
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_5px_10px_rgba(79,70,229,0.6)]" style={{ imageRendering: 'pixelated' }}>
          {/* Base Perch */}
          <rect x="6" y="27" width="20" height="2" fill="#334155" />
          <rect x="8" y="28" width="16" height="1" fill="#4ade80" />
          <rect x="14" y="29" width="4" height="3" fill="#1e293b" />
          <rect x="12" y="26" width="3" height="1" fill="#f5b041" />
          <rect x="17" y="26" width="3" height="1" fill="#f5b041" />

          {isCat ? (
            <>
              {/* Salem the Cat */}
              <rect x="11" y="10" width="3" height="3" fill="#0f172a" rx="0.5" />
              <rect x="18" y="10" width="3" height="3" fill="#0f172a" rx="0.5" />
              <rect x="12" y="11" width="1" height="1" fill="#f472b6" />
              <rect x="19" y="11" width="1" height="1" fill="#f472b6" />

              {/* Tail */}
              <rect x="20" y="22" width="4" height="2" fill="#0f172a" />
              <rect x="22" y="19" width="2" height="3" fill="#0f172a" rx="1" />

              {/* Body & Head */}
              <rect x="10" y="12" width="12" height="9" fill="#1e293b" rx="2" />
              <rect x="11" y="20" width="10" height="6" fill="#1e293b" rx="1" />

              {/* Paws */}
              <rect x="11" y="25" width="3" height="2" fill="#0f172a" rx="0.5" />
              <rect x="18" y="25" width="3" height="2" fill="#0f172a" rx="0.5" />

              {/* Eyes & Nose */}
              {!config.accessory?.includes('Pet Cyber Visor') && (
                <>
                  <rect x="12" y="15" width="2" height="2" fill="#a3e635" />
                  <rect x="18" y="15" width="2" height="2" fill="#a3e635" />
                  <rect x="13" y="15" width="1" height="2" fill="#000" />
                  <rect x="19" y="15" width="1" height="2" fill="#000" />
                </>
              )}
              <rect x="15" y="18" width="2" height="1" fill="#f472b6" />
            </>
          ) : (
            <>
              {/* Pixel the Owl */}
              <rect x="10" y="12" width="12" height="14" fill="#8b5a2b" rx="4" />
              <rect x="12" y="16" width="8" height="10" fill="#d2b48c" rx="3" />
              <rect x="8" y="15" width="2" height="8" fill="#5c4033" rx="1" />
              <rect x="22" y="15" width="2" height="8" fill="#5c4033" rx="1" />
              {!config.accessory?.includes('Pet Cyber Visor') && (
                <><rect x="12" y="14" width="3" height="3" fill="#fff" /><rect x="17" y="14" width="3" height="3" fill="#fff" /><rect x="13" y="15" width="1" height="1" fill="#000" /><rect x="18" y="15" width="1" height="1" fill="#000" /></>
              )}
              <rect x="15" y="17" width="2" height="2" fill="#f59e0b" />
            </>
          )}

          {/* Shared Accessories */}
          {config.accessory?.includes('Pet Cyber Visor') && (
            <><rect x="8" y={isCat ? 14 : 15} width="16" height="2" fill="#1e293b" /><rect x="9" y={isCat ? 13 : 14} width="6" height="5" fill="#0891b2" rx="1" /><rect x="17" y={isCat ? 13 : 14} width="6" height="5" fill="#0891b2" rx="1" /><rect x="10" y={isCat ? 14 : 15} width="4" height="3" fill="#22d3ee" rx="0.5" /><rect x="18" y={isCat ? 14 : 15} width="4" height="3" fill="#22d3ee" rx="0.5" /><rect x="10" y={isCat ? 15 : 16} width="4" height="1" fill="#cffafe" opacity="0.6" /><rect x="18" y={isCat ? 15 : 16} width="4" height="1" fill="#cffafe" opacity="0.6" /></>
          )}
          {config.accessory?.includes('Pet Top Hat') && (
            <><rect x="12" y={isCat ? 5 : 6} width="8" height="6" fill="#1e293b" /><rect x="10" y={isCat ? 10 : 11} width="12" height="1" fill="#1e293b" /><rect x="12" y={isCat ? 9 : 10} width="8" height="1" fill="#ef4444" /></>
          )}
        </svg>
      </div>
    </div>
  );
};

const PixelIcon = ({ name, className }) => {
  if (['Cyber Hacker Glasses', 'Master Mathematician Sword', 'Civic Leader Crown', 'The Pythagoras Holographic', 'Ada Lovelace Base Card', 'Civic Duty Foil'].includes(name)) {
    return (
      <svg viewBox="0 0 32 32" className={`w-full h-full drop-shadow-lg ${className}`} style={{ imageRendering: 'pixelated' }}>
        {name === 'Master Mathematician Sword' && (
          <><polygon points="16,2 22,8 19,20 13,20 10,8" fill="#a855f7"/><polygon points="16,2 19,8 17,19 15,19 13,8" fill="#d8b4fe"/><rect x="8" y="20" width="16" height="3" fill="#94a3b8" rx="1"/><rect x="14" y="23" width="4" height="6" fill="#78350f"/><circle cx="16" cy="30" r="2.5" fill="#f59e0b"/></>
        )}
        {name === 'Civic Leader Crown' && (
          <><path d="M4 26 L28 26 L28 14 L22 20 L16 8 L10 20 L4 14 Z" fill="#d97706"/><path d="M6 24 L26 24 L26 16 L22 21 L16 11 L10 21 L6 16 Z" fill="#fbbf24"/><circle cx="16" cy="21" r="2.5" fill="#ef4444"/></>
        )}
        {name === 'The Pythagoras Holographic' && (
          <><rect x="2" y="2" width="28" height="28" fill="#fcd34d" rx="2"/><rect x="4" y="4" width="24" height="24" fill="#0f172a" rx="1"/><circle cx="16" cy="13" r="5" fill="#fca5a5"/><polygon points="12,24 22,24 12,14" fill="none" stroke="#38bdf8" strokeWidth="1.5"/></>
        )}
      </svg>
    );
  }
  return <Award className={className} />;
};

// --- MOCK DATA ---
const teacherContext = {
  name: "Ms. Ada Lovelace",
  username: "@prof_lovelace",
  school: "Huntsville High School",
  location: "Huntsville, AL",
  weather: "⛅ 72°F",
  date: "Monday, Mar 9, 2026",
  time: "9:41 AM",
  period: "Period 2: Intro to Logic",
  mood: "Ready to code 💻",
};

const teacherTrophies = [
  { id: 1, name: "Funniest Teacher 2025-2026", date: "May 2026", validator: "Class of '26 Voting", profTranslation: "Voted by students for bringing the best energy and humor to the classroom.", color: "from-yellow-400 to-orange-500", customImage: "/trophy_funny.jpg", icon: "Civic Leader Crown" },
  { id: 2, name: "80% Mastery Club", date: "December 2025", validator: "Automated System", profTranslation: "Maintained a class average of 80% or higher for an entire semester.", color: "from-emerald-400 to-teal-600", customImage: "/trophy_mastery.jpg", icon: "Master Mathematician Sword" },
  { id: 3, name: "Tech Innovator Award", date: "October 2025", validator: "School Administration", profTranslation: "Pioneered the use of digital classroom ecosystems in daily curriculum.", color: "from-blue-400 to-indigo-600", customImage: "/trophy_tech.jpg", icon: "The Pythagoras Holographic" }
];

const periodStudents = [
  { id: 1, name: "Alex Johnson", username: "@alex_j_vibes", mood: "Focused 🧠", present: true, pet: { name: "Pixel the Owl", config: { type: 'owl', accessory: [] } }, pendingMessage: true, messageText: "Ms. Lovelace, I'm stuck on the boolean logic puzzle. Can you review my code?", profileImage: "/profile_alex.jpg", config: { skinColor: 'Fair', eyeColor: 'Brown Eyes', hairColor: 'Black Hair', hairStyle: 'Short Messy', top: 'Neon Tech Hoodie', bottom: 'Black Tech Joggers', shoes: 'Classic Sneakers', pose: 'Idle', accessory: [] } },
  { id: 2, name: "Sarah Connor", username: "@terminator_fan", mood: "Determined ⚡", present: true, pet: null, pendingMessage: false, profileImage: "/profile_sarah.jpg", config: { skinColor: 'Warm', eyeColor: 'Blue Eyes', hairColor: 'Blonde Hair', hairStyle: 'Long Wavy', top: 'Plain White T-Shirt', bottom: 'Blue Jeans', shoes: 'Classic Sneakers', pose: 'Hands in Pockets', accessory: [] } },
  { id: 3, name: "Neo Anderson", username: "@neo_hacker", mood: "Glitching 🕶️", present: true, pet: null, pendingMessage: true, messageText: "I submitted the Library Shelf bounty, waiting on approval!", profileImage: "/profile_neo.jpg", config: { skinColor: 'Deep', eyeColor: 'Brown Eyes', hairColor: 'Black Hair', hairStyle: 'Short Messy', top: 'Black Hoodie', bottom: 'Black Tech Joggers', shoes: 'Neon High-Tops', pose: 'Idle', accessory: ['Cyberpunk Visor'] } },
  { id: 4, name: "John Doe", username: "@jd_ghost", present: false, pet: null, pendingMessage: true, messageText: "Hey Ms. Lovelace, I'm out sick today. Is there any homework I can do from bed?", profileImage: "/profile_john.jpg", config: {} },
  { id: 5, name: "Mia Wong", username: "@mia_builds", mood: "Creative 🎨", present: true, pet: { name: "Salem", config: { type: 'cat', accessory: ['Pet Cyber Visor'] } }, pendingMessage: false, profileImage: "/profile_mia.jpg", config: { skinColor: 'Fair', eyeColor: 'Brown Eyes', hairColor: 'Neon Pink Hair', hairStyle: 'Long Wavy', top: 'Varsity Jacket', bottom: 'Blue Jeans', shoes: 'Classic Sneakers', pose: 'Victory Pose', accessory: [] } },
  { id: 6, name: "David Kim", username: "@dk_gamer", mood: "Tired 😴", present: true, pet: null, pendingMessage: true, messageText: "Can I get an extension on the Midterm Review? I'm having trouble catching up.", profileImage: "/profile_david.jpg", config: { skinColor: 'Warm', eyeColor: 'Brown Eyes', hairColor: 'Black Hair', hairStyle: 'Short Messy', top: 'Plain White T-Shirt', bottom: 'Black Tech Joggers', shoes: 'Classic Sneakers', pose: 'Idle', accessory: [] } }
];

const dialoguePrompt = "A highly detailed 2D RPG dialogue portrait of a professional computer science teacher with glasses. Solid dark background, Stardew Valley style.";

// --- MAIN CLASSROOM COMPONENT ---
const ClassroomView = ({ onBack, wardrobe, setWardrobe, useRealPhoto, setUseRealPhoto }) => {
  const [activeTab, setActiveTab] = useState('classroom');
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showingMessage, setShowingMessage] = useState(false);

  // Comms State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filterCategories = ['all', 'furniture'];
  const categoryMap = { 'furniture': ['theme'] };
  const [closetFilter, setClosetFilter] = useState('all');

  const filteredWardrobe = wardrobe.filter(item => {
    if (!item.owned) return false;
    if (closetFilter === 'all') return true;
    return categoryMap[closetFilter]?.includes(item.type);
  });

  const activeTheme = wardrobe.find(i => i.type === 'theme' && i.equipped);
  const themeName = activeTheme?.name || 'Teacher Lounge';
  const themeBgImage = activeTheme?.bgImage;

  const toggleEquip = (id) => {
    setWardrobe(prev => {
      const item = prev.find(i => i.id === id);
      if (!item?.owned) return prev;
      const isEq = !item.equipped;
      return prev.map(i => {
        if (isEq && i.id !== id && i.type === 'theme') return { ...i, equipped: false };
        return i.id === id ? { ...i, equipped: isEq } : i;
      });
    });
  };

  const handleSendReply = (id) => {
    // In a real app, this would dispatch the message to the backend
    setReplyingTo(null);
    setReplyText('');
  };

  const Desk = ({ student }) => (
    <div 
      onClick={() => { setSelectedStudent(student); setShowingMessage(false); }}
      className="relative flex flex-col items-center justify-end h-40 sm:h-48 cursor-pointer group"
    >
      <div className="absolute bottom-0 w-24 h-12 sm:w-32 sm:h-16 bg-slate-800 rounded-xl border-4 border-slate-700 shadow-2xl group-hover:border-emerald-500 transition-colors">
        <div className="absolute top-1 left-1 right-1 h-1 sm:top-2 sm:left-2 sm:right-2 sm:h-2 bg-slate-900/50 rounded-full"></div>
      </div>

      {student.present ? (
        <div className="relative mb-3 flex flex-col items-center">
          {student.pendingMessage && (
            <div className="absolute -top-4 sm:-top-4 animate-bounce z-20">
               <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-2xl">
                  <Bell size={12} className="text-white fill-white sm:w-4 sm:h-4" />
               </div>
            </div>
          )}
          <div className="scale-[0.5] sm:scale-[0.7] origin-bottom mb-[-10px] sm:mb-[-15px]">
            <PixelAvatar config={student.config} />
          </div>
          {student.pet && (
            <div className="absolute -left-4 sm:-left-8 bottom-0 scale-75 sm:scale-100 z-10">
              <PixelPet config={student.pet.config} />
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          {student.pendingMessage && (
            <div className="absolute -top-2 sm:-top-2 animate-bounce z-20">
               <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-2xl">
                  <Bell size={10} className="text-white fill-white" />
               </div>
            </div>
          )}
          <span className="text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-widest opacity-40">Empty</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-emerald-500/30">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="w-full">
          <button onClick={onBack} className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-1 transition-colors mb-2 w-max">
            <ChevronLeft size={18}/> Back to Dashboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div><h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight flex items-center gap-3"><Briefcase className="text-emerald-400" /> Digital Classroom</h1><p className="text-slate-400 font-medium mt-1">Customize your virtual workspace.</p></div>
          <div className="flex gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex-wrap justify-center">
            {['classroom', 'desk'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm capitalize ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {activeTab === 'classroom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* The Live Classroom Render */}
            <div className="lg:col-span-8 bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-3xl sm:rounded-[4rem] p-8 sm:p-16 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_transparent_100%)] opacity-30 pointer-events-none"></div>
              {themeBgImage && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>}

              <div className="w-full flex justify-center mb-16 sm:mb-24 relative z-10">
                 <div className="w-48 sm:w-auto px-8 h-16 sm:h-20 bg-slate-950 border-4 border-slate-700 rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-[0.2em] shadow-inner">{teacherContext.period}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 sm:gap-x-16 gap-y-12 sm:gap-y-16 max-w-4xl mx-auto relative z-10">
                 {periodStudents.map(s => <Desk key={s.id} student={s} />)}
              </div>
            </div>

            {/* Sidebar Inspector */}
            <div className="lg:col-span-4 h-full">
              {selectedStudent ? (
                <div className="bg-slate-900 border-4 border-emerald-500/30 rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-8 shadow-2xl h-full animate-in slide-in-from-right-4 transition-all">
                  <div className="flex justify-between items-start mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2"><User className="text-emerald-400"/> Inspector</h2>
                    <button onClick={() => { setSelectedStudent(null); setShowingMessage(false); }} className="text-slate-500 hover:text-white transition-colors p-1 sm:p-2"><X size={24} className="sm:w-8 sm:h-8" /></button>
                  </div>

                  {!selectedStudent.present ? (
                    <div className="bg-red-950/20 border-2 border-red-900/50 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] text-center">
                      <AlertTriangle className="mx-auto mb-4 text-red-500 w-12 h-12 sm:w-16 sm:h-16 opacity-50" />
                      <p className="text-red-400 font-black uppercase tracking-widest text-base sm:text-lg">Absent Today</p>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2">{selectedStudent.name} ({selectedStudent.username}) is not on campus.</p>

                      {selectedStudent.pendingMessage && (
                        <div className="mt-6">
                          {!showingMessage ? (
                            <button onClick={() => setShowingMessage(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-[2rem] text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform border-b-4 border-blue-800">
                              <MessageSquare size={16}/> Review Message
                            </button>
                          ) : (
                            <div className="bg-slate-950 border border-blue-500/30 p-4 rounded-2xl relative shadow-inner animate-in fade-in zoom-in-95 mt-4 text-left">
                              <p className="text-xs sm:text-sm text-slate-300 italic mb-3">"{selectedStudent.messageText}"</p>
                              <div className="flex gap-2">
                                 <button onClick={() => setShowingMessage(false)} className="flex-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-bold py-2 rounded-xl text-[10px] sm:text-xs transition-colors border border-emerald-500/30">Approve / Resolve</button>
                                 <button onClick={() => setShowingMessage(false)} className="flex-1 bg-slate-800 text-slate-400 hover:bg-slate-700 font-bold py-2 rounded-xl text-[10px] sm:text-xs transition-colors">Close</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-800">
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-slate-900 border-2 sm:border-4 border-slate-700 rounded-xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 flex items-center justify-center">
                           <span className="text-[8px] sm:text-[10px] text-slate-500 text-center px-1 break-words leading-tight uppercase font-black">Upload<br/>{selectedStudent.profileImage}</span>
                           <img src={selectedStudent.profileImage} className="absolute inset-0 w-full h-full object-cover" onError={(e) => e.target.style.display='none'} alt={selectedStudent.name} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-lg sm:text-2xl font-black text-white leading-tight truncate">{selectedStudent.name}</p>
                          <p className="text-xs sm:text-sm font-bold text-cyan-400 truncate">{selectedStudent.username}</p>
                          <p className="text-[10px] sm:text-sm text-slate-400 mt-1 sm:mt-2 font-medium truncate">Mood: <span className="text-slate-200">{selectedStudent.mood}</span></p>
                        </div>
                      </div>

                      <div className="flex justify-center bg-slate-950/80 p-6 sm:p-8 rounded-2xl sm:rounded-[3rem] border-2 border-slate-800 shadow-inner overflow-hidden">
                        <div className="scale-100 sm:scale-125 transform transition-transform">
                           <PixelAvatar config={selectedStudent.config} />
                        </div>
                      </div>

                      {selectedStudent.pet && (
                        <div className="bg-indigo-950/20 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border-2 border-indigo-900/50 flex items-center gap-3 sm:gap-4">
                           <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"><PixelPet config={selectedStudent.pet.config} /></div>
                           <div className="overflow-hidden">
                             <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Companion</p>
                             <p className="text-sm sm:text-xl font-black text-indigo-300 truncate">{selectedStudent.pet.name}</p>
                           </div>
                        </div>
                      )}

                      {selectedStudent.pendingMessage && (
                        <div className="mt-4">
                          {!showingMessage ? (
                            <button onClick={() => setShowingMessage(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-[2rem] text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform border-b-4 border-blue-800">
                              <MessageSquare size={18}/> Review Message
                            </button>
                          ) : (
                            <div className="bg-slate-950 border border-blue-500/30 p-4 rounded-2xl relative shadow-inner animate-in fade-in zoom-in-95 mt-4">
                              <p className="text-xs sm:text-sm text-slate-300 italic mb-3">"{selectedStudent.messageText}"</p>
                              <div className="flex gap-2">
                                 <button onClick={() => setShowingMessage(false)} className="flex-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-bold py-2 rounded-xl text-[10px] sm:text-xs transition-colors border border-emerald-500/30">Approve / Resolve</button>
                                 <button onClick={() => setShowingMessage(false)} className="flex-1 bg-slate-800 text-slate-400 hover:bg-slate-700 font-bold py-2 rounded-xl text-[10px] sm:text-xs transition-colors">Close</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/50 border-4 border-slate-800 border-dashed rounded-3xl sm:rounded-[4rem] h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center group min-h-[300px]">
                  <Users className="w-16 h-16 sm:w-20 sm:h-20 text-slate-800 group-hover:text-emerald-500/20 transition-colors mb-4 sm:mb-8" />
                  <p className="text-slate-600 font-black uppercase text-sm sm:text-xl tracking-widest sm:tracking-[0.2em]">Select a Student Desk</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Inventory / Desk Tab */}
        {activeTab === 'desk' && (
          <div className="space-y-8">
            {/* The Digital Room Preview (Smaller) */}
            <div className="relative w-full h-48 sm:h-64 rounded-3xl border-4 border-slate-800/50 shadow-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              {themeName === 'Teacher Lounge' && !themeBgImage && <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 font-black text-xl uppercase tracking-widest">Upload /teacher_lounge.jpg</div>}
              {themeBgImage && <img src={themeBgImage} className="absolute inset-0 w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = 'none'; }} />}

              <div className="relative z-10 text-center space-y-2 bg-slate-950/90 p-6 rounded-3xl backdrop-blur-md border border-slate-700 shadow-2xl">
                 <div 
                   className="w-16 h-16 mx-auto rounded-xl overflow-hidden border-2 border-slate-700 cursor-pointer group relative"
                   onClick={() => setUseRealPhoto(!useRealPhoto)}
                 >
                   {useRealPhoto ? (
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80" alt="Real Profile" className="w-full h-full object-cover" />
                   ) : (
                     <AssetImage prompt={dialoguePrompt} className="w-full h-full object-cover" />
                   )}
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCw size={12} className="text-white" />
                   </div>
                 </div>
                 <div>
                   <h2 className="text-lg font-black text-white">{teacherContext.name}'s Desk</h2>
                   <p className="text-emerald-400 font-bold mt-1 tracking-widest uppercase text-[10px]">{themeName}</p>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-slate-100 flex items-center gap-2"><ImageIcon className="text-emerald-400" /> Classroom Themes</h2></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredWardrobe.map(item => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center group">
                       <div className="w-full aspect-square bg-slate-900 rounded-xl mb-4 flex items-center justify-center border border-slate-800/50 p-4 relative overflow-hidden text-slate-600 font-bold text-[10px] text-center">
                         {item.storeImage ? <img src={item.storeImage} className="absolute inset-0 w-full h-full object-cover opacity-50" onError={(e) => { e.target.style.display = 'none'; }} /> : "No Image"}
                       </div>
                       <p className="text-xs font-bold text-slate-200 mb-4 text-center">{item.name}</p>
                       {item.owned ? (
                         <button onClick={() => toggleEquip(item.id)} className={`w-full py-2 rounded-xl text-xs font-bold ${item.equipped ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 text-white'}`}>{item.equipped ? 'Equipped' : 'Set as Background'}</button>
                       ) : (
                         <button className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed">Locked</button>
                       )}
                    </div>
                  ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-2"><Award className="text-yellow-400"/> Verified Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {teacherTrophies.map(t => (
                  <div key={t.id} onClick={() => setSelectedTrophy(t)} className="cursor-pointer group">
                     <div className="aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 mb-4 flex items-center justify-center transition-all group-hover:-translate-y-2 overflow-hidden relative shadow-lg">
                       {t.customImage ? (<img src={t.customImage} className="w-full h-full object-contain drop-shadow-2xl" onError={(e) => { e.target.style.display = 'none'; }} />) : <div className="w-16 h-16"><PixelIcon name={t.icon} /></div>}
                     </div>
                     <p className="text-xs font-bold text-center text-slate-400 group-hover:text-slate-200 transition-colors">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* TROPHY MODAL */}
      {selectedTrophy && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`h-48 bg-gradient-to-br ${selectedTrophy.color} flex items-center justify-center relative shadow-inner overflow-hidden`}>
              {selectedTrophy.customImage ? (<img src={selectedTrophy.customImage} className="w-40 h-40 object-contain drop-shadow-2xl" />) : (<div className="w-24 h-24"><PixelIcon name={selectedTrophy.icon} /></div>)}
              <button onClick={() => setSelectedTrophy(null)} className="absolute top-4 right-4 bg-slate-950/40 text-white p-2 rounded-full hover:bg-slate-900 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 rounded-full">Verified Credential</span>
                <span className="text-xs font-bold text-slate-400">{selectedTrophy.date}</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">{selectedTrophy.name}</h2>
              <p className="text-sm text-slate-300 mb-6 italic leading-relaxed">"{selectedTrophy.profTranslation}"</p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Awarded By</p>
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-2"><CheckCircle size={14}/> {selectedTrophy.validator}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassroomView;