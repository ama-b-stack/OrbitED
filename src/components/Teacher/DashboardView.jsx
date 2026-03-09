import React, { useState, useEffect } from 'react';
import { 
  MapPin, Sun, Calendar, Clock, School, Shield, Bell, Inbox, 
  MessageSquare, Zap, CheckCircle, Circle, Clock3, AlertTriangle, 
  ArrowRight, User, RefreshCw, BookOpen, PlusCircle, Megaphone,
  Check, X, Briefcase, Sparkles, ImageOff
} from 'lucide-react';

const apiKey = ""; 

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

const initialSchedule = [
  { id: 1, period: "Period 1", class: "Planning & Grading", room: "Staff Lounge", active: false },
  { id: 2, period: "Period 2", class: "Intro to Logic", room: "Room 204", active: true },
  { id: 3, period: "Period 3", class: "AP Computer Science", room: "Room 204", active: false },
  { id: 4, period: "Lunch", class: "Lunch Duty", room: "Cafeteria", active: false },
];

const vibeFeed = [
  { id: 1, text: "@sarah_connor from Huntsville High earned the 'Master Mathematician Sword'!", time: "2m ago" },
  { id: 2, text: "@neo_hacker is looking to trade a 'Pythagoras Holographic' card.", time: "15m ago" },
  { id: 3, text: "@skater_dude completed the 'City Clean-up' Community Bounty!", time: "1h ago" },
  { id: 4, text: "@logic_queen from Madison High leveled up to Rank 15.", time: "3h ago" }
];

const inboxMessages = [
  { id: 1, sender: "Principal Davis", text: "Please review the new curriculum guidelines for next semester.", isAdmin: true },
  { id: 2, sender: "@alex_j_vibes", text: "Ms. Lovelace, I'm stuck on Module 4. Can I come to office hours?", isAdmin: false }
];

const initialAnnouncements = [
  { id: 1, title: "Weather Alert", text: "Severe thunderstorm watch until 3:00 PM. After-school robotics club is moved to Room 102.", type: "warning" },
  { id: 2, title: "Upcoming Holiday", text: "Spring Break begins next Monday, March 16th. Ensure all bounties are submitted by Friday.", type: "info" }
];

const initialApprovals = [
  { id: 1, student: "@alex_j_vibes", task: "Library Shelf Organization", type: "Bounty", reward: "200 Coins" },
  { id: 2, student: "@sarah_connor", task: "Peer Tutoring: Freshman Math", type: "Bounty", reward: "300 Coins" }
];

const dialoguePrompt = "A highly detailed 2D RPG dialogue portrait of a professional computer science teacher with glasses. Solid dark background, Stardew Valley style.";

// --- MAIN DASHBOARD COMPONENT ---
const DashboardView = ({ onOpenLocker, wardrobe, useRealPhoto, setUseRealPhoto }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [attendanceStatus, setAttendanceStatus] = useState("On Campus - Room 204");

  // Schedule State
  const [schedule, setSchedule] = useState(initialSchedule);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ period: '', class: '', room: '' });

  // Forms & Comms state
  const [activeTab, setActiveTab] = useState('bounty');
  const [bountyForm, setBountyForm] = useState({ title: '', coins: '', description: '' });
  const [announceForm, setAnnounceForm] = useState({ title: '', text: '', isWarning: false });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const activeTheme = wardrobe.find(i => i.type === 'theme' && i.equipped);
  const bgImage = activeTheme?.bgImage || '';

  const handleApprove = (id) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateBounty = (e) => {
    e.preventDefault();
    alert(`Bounty "${bountyForm.title}" posted to student boards for ${bountyForm.coins} coins!`);
    setBountyForm({ title: '', coins: '', description: '' });
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    const newAnnounce = {
      id: Date.now(),
      title: announceForm.title,
      text: announceForm.text,
      type: announceForm.isWarning ? 'warning' : 'info'
    };
    setAnnouncements([newAnnounce, ...announcements]);
    setAnnounceForm({ title: '', text: '', isWarning: false });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setSchedule([...schedule, { 
      id: Date.now(), 
      period: newEvent.period, 
      class: newEvent.class, 
      room: newEvent.room, 
      active: false 
    }]);
    setNewEvent({ period: '', class: '', room: '' });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const cycleStatus = () => {
    const statuses = ["On Campus - Room 204", "Planning Period - DND", "Available for Tutoring", "Off Campus"];
    const currentIndex = statuses.indexOf(attendanceStatus);
    setAttendanceStatus(statuses[(currentIndex + 1) % statuses.length]);
  };

  const handleSendReply = (id) => {
    // In a real app, this would dispatch the message to the backend
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 relative">
      {bgImage && <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40 pointer-events-none" style={{ backgroundImage: `url(${bgImage})` }}></div>}

      <div className="relative z-10 min-h-screen bg-slate-950/80 backdrop-blur-md p-4 md:p-6 lg:p-8">

        <header className="max-w-7xl mx-auto mb-6 space-y-4">
          {/* Top Utility Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 shadow-md">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300"><MapPin size={14} className="text-red-400"/> {teacherContext.location}</span>
              <span className="flex items-center gap-1 text-slate-300"><Sun size={14} className="text-yellow-400"/> {teacherContext.weather}</span>
              <span className="hidden sm:flex items-center gap-1"><Calendar size={14} className="text-blue-400"/> {teacherContext.date}</span>
              <span className="flex items-center gap-1 text-white bg-slate-800 px-2 py-1 rounded"><Clock size={14} className="text-emerald-400"/> {teacherContext.time}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300"><School size={14} className="text-purple-400"/> {teacherContext.school}</span>

              {/* Teacher Specific Status Toggle */}
              <button onClick={cycleStatus} className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                attendanceStatus.includes("Off") ? "bg-slate-900 border border-slate-700 text-slate-400" : 
                attendanceStatus.includes("DND") ? "bg-red-950/50 border border-red-500/30 text-red-400" :
                "bg-emerald-950/50 border border-emerald-500/30 text-emerald-400"
              }`}>
                <span className={`w-2 h-2 rounded-full ${attendanceStatus.includes("Off") ? "bg-slate-500" : attendanceStatus.includes("DND") ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}></span> 
                {attendanceStatus}
              </button>
            </div>
          </div>

          {/* Main Navigation Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 p-5 rounded-3xl border border-slate-700 shadow-xl gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-lg overflow-hidden cursor-pointer group relative flex-shrink-0"
                onClick={() => setUseRealPhoto(!useRealPhoto)}
                title="Click to swap photo type"
              >
                {useRealPhoto ? (
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80" alt="Real Profile" className="w-full h-full object-cover" />
                ) : (
                  <AssetImage prompt={dialoguePrompt} className="w-full h-full object-cover" loadingText="AI..." />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <RefreshCw size={16} className="text-white" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50 mb-1 inline-block">Faculty / Admin</span>
                <h1 className="text-2xl font-black text-white leading-tight">{teacherContext.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{teacherContext.username}</span>
                </div>
              </div>
            </div>

            <button onClick={onOpenLocker} className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform active:scale-95 border border-emerald-400/50">
              <Briefcase size={20} />
              Open Digital Classroom <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (3/12): Notice Board & Comms */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4"><Bell size={16}/> Notice Board</h2>
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className={`p-3 rounded-xl border ${a.type === 'warning' ? 'bg-red-950/30 border-red-900/50' : 'bg-blue-950/30 border-blue-900/50'}`}>
                    <h3 className={`text-xs font-bold mb-1 flex items-center gap-1 ${a.type === 'warning' ? 'text-red-400' : 'text-blue-400'}`}>
                      {a.type === 'warning' ? <AlertTriangle size={12}/> : <Calendar size={12}/>} {a.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-snug">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Inbox size={16}/> Comms</h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {inboxMessages.map(m => (
                  <div key={m.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold ${m.isAdmin ? 'text-emerald-400' : 'text-cyan-400'}`}>{m.sender}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.text}</p>
                    {replyingTo === m.id ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input type="text" autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type a reply..." className="flex-1 bg-slate-900 border border-slate-700 text-[10px] px-2 py-1.5 rounded text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
                        <button onClick={() => handleSendReply(m.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1.5 rounded transition-colors">Send</button>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(m.id)} className="mt-2 text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded hover:bg-slate-700 transition-colors w-full">Reply</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN (6/12): Command Center & Calendar */}
          <div className="lg:col-span-6 space-y-6">

            {/* Teacher Command Center */}
            <div className="bg-slate-900/95 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><BookOpen className="text-emerald-400" /> Command Center</h2>
                <p className="text-sm text-slate-400 mt-1">Manage class quests and broadcast announcements.</p>
              </div>

              <div className="flex border-b border-slate-800">
                <button 
                  onClick={() => setActiveTab('bounty')} 
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'bounty' ? 'bg-emerald-950/30 text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                >
                  <PlusCircle size={16}/> Create Bounty
                </button>
                <button 
                  onClick={() => setActiveTab('announce')} 
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'announce' ? 'bg-blue-950/30 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                >
                  <Megaphone size={16}/> Post Announcement
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'bounty' && (
                  <form onSubmit={handleCreateBounty} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bounty Title</label>
                        <input required type="text" value={bountyForm.title} onChange={e => setBountyForm({...bountyForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Science Fair Setup" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reward</label>
                        <input required type="text" value={bountyForm.coins} onChange={e => setBountyForm({...bountyForm, coins: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-yellow-400 focus:outline-none focus:border-yellow-500 transition-colors" placeholder="500 Coins" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description / Requirements</label>
                      <textarea required value={bountyForm.description} onChange={e => setBountyForm({...bountyForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none h-24" placeholder="Detail what the student needs to do..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                      <Zap size={18}/> Post to Student Mission Boards
                    </button>
                  </form>
                )}

                {activeTab === 'announce' && (
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Headline</label>
                      <input required type="text" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Field Trip Tomorrow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Message</label>
                      <textarea required value={announceForm.text} onChange={e => setAnnounceForm({...announceForm, text: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-24" placeholder="Write your announcement here..."></textarea>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <input type="checkbox" id="urgent" checked={announceForm.isWarning} onChange={e => setAnnounceForm({...announceForm, isWarning: e.target.checked})} className="w-4 h-4 rounded border-slate-700 text-red-500 focus:ring-red-500 bg-slate-900" />
                      <label htmlFor="urgent" className="text-sm font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                        Mark as Urgent/Warning <AlertTriangle size={14} className={announceForm.isWarning ? "text-red-500" : "text-slate-600"}/>
                      </label>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                      <Megaphone size={18}/> Broadcast to Students
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={16}/> Today's Schedule</h2>
                <button 
                  onClick={() => setShowEventForm(!showEventForm)} 
                  className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                  <PlusCircle size={12}/> Add Event
                </button>
              </div>

              {showEventForm && (
                <form onSubmit={handleAddEvent} className="mb-4 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-2">
                     <input required placeholder="Period / Time" value={newEvent.period} onChange={e => setNewEvent({...newEvent, period: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
                     <input required placeholder="Location" value={newEvent.room} onChange={e => setNewEvent({...newEvent, room: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <input required placeholder="Class or Event Name" value={newEvent.class} onChange={e => setNewEvent({...newEvent, class: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">Save to Schedule</button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schedule.map(s => (
                  <div key={s.id} className={`p-4 rounded-xl border flex flex-col justify-center relative group transition-all ${s.active ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-950 border-slate-800'}`}>
                    <button 
                      onClick={() => handleDeleteEvent(s.id)}
                      className="absolute top-2 right-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Event"
                    >
                      <X size={14} />
                    </button>
                    <div className="flex justify-between items-center mb-1 pr-6">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${s.active ? 'text-emerald-400' : 'text-slate-500'}`}>{s.period}</span>
                      {s.active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                    </div>
                    <h3 className={`font-black text-lg pr-4 ${s.active ? 'text-white' : 'text-slate-300'}`}>{s.class}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {s.room}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (3/12): Action Items & The Vibe */}
          <div className="lg:col-span-3 space-y-6">

            {/* Pending Approvals */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16}/> Action Items</h2>
                {approvals.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{approvals.length}</span>}
              </div>

              {approvals.length === 0 ? (
                <div className="text-center py-6 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
                  <CheckCircle size={24} className="text-emerald-500/50 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvals.map(app => (
                    <div key={app.id} className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400">{app.student}</span>
                      <p className="text-xs text-slate-200 font-bold mt-0.5 leading-snug">{app.task}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[10px] bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded border border-yellow-700/50 flex items-center gap-1"><Award size={10}/> {app.reward}</span>
                        <div className="flex gap-1">
                          <button onClick={() => handleApprove(app.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded transition-colors" title="Approve & Award Coins"><Check size={14}/></button>
                          <button className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white p-1.5 rounded transition-colors" title="Reject"><X size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* The Vibe (City Feed) */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={16} className="text-cyan-400"/> The Vibe</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Feed"></span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {vibeFeed.map(vibe => (
                  <div key={vibe.id} className="relative pl-4 border-l-2 border-slate-800">
                     <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-700"></div>
                     <p className="text-xs text-slate-300 leading-relaxed">
                       {vibe.text.split(' ').map((word, i) => (
                         <span key={i} className={word.startsWith('@') ? "font-bold text-cyan-400" : ""}>{word}{" "}</span>
                       ))}
                     </p>
                     <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">{vibe.time}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardView;