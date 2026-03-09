import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Zap, MessageSquare, AlertTriangle, 
  Send, Sparkles, User, RefreshCw, Check, X,
  ShieldAlert, GitMerge, Users, TrendingUp,
  Plus, MessageSquarePlus, BookOpen, AlertCircle,
  BarChart2
} from 'lucide-react';

/**
 * API Key configuration.
 * CANVAS PREVIEW: Always leave as "" (The environment injects it at runtime).
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

// --- MOCK DATA (Shared Context) ---
const classroomContext = {
  teacher: "Ms. Ada Lovelace",
  subject: "Intro to Logic",
  activeStudents: 5,
  overallMood: "Focused, but slightly fatigued"
};

const initialInsights = [
  { id: 1, title: "Class Average", value: "84%", trend: "+2.1%", type: "positive", detail: "Up from last week.", icon: TrendingUp },
  { id: 2, title: "Attendance", value: "96%", trend: "Stable", type: "neutral", detail: "Only 1 absence today.", icon: Users },
  { id: 3, title: "Critical Alert", value: "Mod 4 Quiz", trend: "Action Needed", type: "negative", detail: "62% missed Q4 (XOR Logic). Recommend ATLAS targeted review.", icon: AlertTriangle }
];

const initialInterventions = [
  { 
    id: 101, 
    target: "Alex Johnson", 
    issue: "Stuck on Boolean Logic (Module 4)", 
    aiSuggestion: "Initiate targeted ATLAS tutoring session focused on OR/AND operators, or notify Ms. Lovelace to intervene directly.",
    status: "pending"
  },
  { 
    id: 102, 
    target: "David Kim", 
    issue: "Fatigue / Inactivity detected", 
    aiSuggestion: "Send a quick wellness check ping and suggest a 5-minute screen break.",
    status: "pending"
  },
  { 
    id: 103, 
    target: "Classwide", 
    issue: "XOR Logic Gate Confusion", 
    aiSuggestion: "Generate a new interactive S-Rank Mission focusing specifically on XOR logic to reinforce the concept.",
    status: "pending"
  }
];

const initialConversations = [
  { 
    id: 1, 
    title: "General Briefing", 
    messages: [{ role: 'model', text: "ATLAS online. Adaptive Teaching & Learning Assistance System active. Bridging the Student App and Teacher Portal for the Class of '26. How can I assist you today, Ms. Lovelace?" }] 
  },
  { 
    id: 2, 
    title: "Module 4 Triage", 
    messages: [
      { role: 'model', text: "I have analyzed the recent Module 4 Quiz. 62% of students incorrectly answered Question 4 regarding XOR logic gates." },
      { role: 'user', text: "Can you generate a quick practice exercise to help them understand it?" },
      { role: 'model', text: "Certainly. I can generate a targeted interactive bounty where students must route power through a simulated XOR gate. Shall I post this to the Mission Board?" }
    ] 
  }
];

// --- MAIN AGENT COMPONENT ---
export default function App() {
  const [insights] = useState(initialInsights);
  const [interventions, setInterventions] = useState(initialInterventions);

  // Chat State
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // --- TAILWIND FIX ---
  useEffect(() => {
    const scriptId = 'tailwind-cdn-fix';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);
    }
    document.body.className = 'bg-slate-950 text-slate-200 font-sans antialiased overflow-x-hidden';
    return () => { document.body.className = ''; };
  }, []);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];
  const activeMessages = activeChat.messages;

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: `Consultation ${conversations.length + 1}`,
      messages: [{ role: 'model', text: "ATLAS standing by. What would you like to focus on?" }]
    };
    setConversations([newChat, ...conversations]);
    setActiveChatId(newId);
  };

  // --- GEMINI API INTEGRATION ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();

    // Optimistically update the active conversation with the user's message
    setConversations(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'user', text: userText }] } : c
    ));

    setInput('');
    setIsTyping(true);

    const systemInstruction = `You are ATLAS (Adaptive Teaching & Learning Assistance System), an advanced AI observation engine. Your primary function is to bridge the gap between the Student Experience application (which tracks their gamified progress and stats) and the Teacher Portal. You monitor high-level class insights, suggest actionable interventions, and deploy targeted AI tutoring. Keep responses concise, analytical, and focused on bridging these two ecosystems. Current class mood: ${classroomContext.overallMood}. Active students: ${classroomContext.activeStudents}.`;

    try {
      // API Call logic (Graceful fallback if no key in preview)
      if (!apiKey && typeof __firebase_config === 'undefined') {
        setTimeout(() => {
          setConversations(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', text: "Processing request... (API Key not detected in environment, running in simulation mode). I recommend checking in with Alex, as his frustration metric is elevating." }] } : c
          ));
          setIsTyping(false);
        }, 1500);
        return;
      }

      // Format history for the API: Trim to the last 10 messages to prevent payload bloat and timeouts
      const recentMessages = activeMessages.slice(-10);
      const apiHistory = recentMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, parts: [{ text: m.text }] }));

      // Retry mechanism with exponential backoff
      const delays = [1000, 2000, 4000, 8000, 16000];
      let response;
      for (let i = 0; i < delays.length; i++) {
        try {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                ...apiHistory,
                { role: "user", parts: [{ text: userText }] }
              ],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { maxOutputTokens: 400 } // Force faster, concise responses to prevent timeouts
            })
          });

          if (response.ok) break; 

          if ((response.status === 401 || response.status === 403) && apiKey) {
             throw new Error('API Key is invalid or unauthorized.');
          }
          if ((response.status === 401 || response.status === 403) && !apiKey) {
            throw new Error('API Key missing. Running in simulation mode fallback is unavailable.');
          }

          if (i < delays.length - 1) {
             await new Promise(resolve => setTimeout(resolve, delays[i]));
          }
        } catch (fetchError) {
          if (i === delays.length - 1) throw fetchError;
          await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I encountered an error processing that logic.";
        setConversations(prev => prev.map(c => 
          c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', text: aiText }] } : c
        ));
      } else {
        throw new Error(`API Error: ${response ? response.status : 'Unknown'}`);
      }
    } catch (err) {
      console.error(err);
      let errorMsg = "Neural link disrupted. Please check connection.";
      if (err.message && (err.message.includes('401') || err.message.includes('invalid') || err.message.includes('missing'))) {
        errorMsg = "Authentication failed. Please ensure a valid API key is provided.";
      }
      setConversations(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', text: errorMsg }] } : c
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionIntervention = (id, action) => {
    setInterventions(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: action } : inv
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-6 selection:bg-indigo-500/30 flex flex-col">

      {/* Background Styling */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 w-full flex-1 flex flex-col space-y-4 md:space-y-6">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-xl border border-indigo-500/20 p-4 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.1)] shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center bg-slate-950 rounded-2xl border border-indigo-500/50 shadow-inner">
               <Brain className="text-indigo-400 animate-pulse" size={24} />
               <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-2xl animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">ATLAS</h1>
              <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-bold">Adaptive Teaching & Learning Assistance System</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System Status</span>
              <span className="text-xs text-emerald-400 font-black flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Optimal</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Nodes</span>
              <span className="text-xs text-cyan-400 font-black flex items-center gap-1"><Users size={12}/> {classroomContext.activeStudents}</span>
            </div>
          </div>
        </header>

        {/* MAIN THREE-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-1 min-h-0">

          {/* LEFT: Chat History */}
          <div className="lg:col-span-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80 shrink-0">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} className="text-cyan-400"/> Consultations</h2>
              <button onClick={handleNewChat} className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg" title="New Consultation">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {conversations.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    activeChatId === chat.id 
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-100 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold truncate flex items-center gap-2">
                    <MessageSquarePlus size={12} className={activeChatId === chat.id ? "text-indigo-400" : "text-slate-600"}/> 
                    {chat.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* CENTER: The ATLAS Terminal */}
          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden h-[500px] lg:h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <div className="p-5 border-b border-slate-800/50 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2"><Sparkles size={16}/> ATLAS Terminal</h2>
              <p className="text-[10px] bg-indigo-950/30 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded">
                Active: {activeChat.title}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {activeMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                  }`}>
                    {msg.role === 'model' && <Brain size={12} className="text-indigo-400 mb-2" />}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-sm p-4 border border-slate-700 flex gap-1 items-center shadow-lg">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ATLAS for insights or to draft an intervention..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Stacked Insights & Interventions */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 h-[600px] lg:h-full min-h-0">

            {/* Top Stack: High-Level Insights */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-1/2 shadow-lg">
              <div className="p-4 border-b border-slate-800/50 shrink-0">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BarChart2 size={16} className="text-blue-400"/> High-Level Insights</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {insights.map(insight => (
                  <div key={insight.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <insight.icon size={12} className={
                          insight.type === 'positive' ? 'text-emerald-400' : 
                          insight.type === 'negative' ? 'text-red-400' : 'text-cyan-400'
                        }/> 
                        {insight.title}
                      </p>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black border ${
                        insight.type === 'positive' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : 
                        insight.type === 'negative' ? 'bg-red-950/30 text-red-400 border-red-900' : 
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {insight.trend}
                      </span>
                    </div>
                    <p className="text-xl font-black text-white leading-none mb-1">{insight.value}</p>
                    <p className="text-[10px] text-slate-400 leading-snug">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stack: Interventions */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-1/2 shadow-lg">
              <div className="p-4 border-b border-slate-800/50 shrink-0">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><GitMerge size={16} className="text-emerald-400"/> AI Interventions</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {interventions.filter(i => i.status === 'pending').length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 opacity-50">
                    <ShieldAlert size={32} />
                    <p className="text-xs font-bold uppercase tracking-widest">No active interventions</p>
                  </div>
                ) : (
                  interventions.map(inv => {
                    if (inv.status !== 'pending') return null;
                    return (
                      <div key={inv.id} className="bg-slate-950 border border-slate-700 rounded-2xl p-4 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500"></div>

                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1"><User size={10}/> {inv.target}</span>
                          <span className="text-[9px] bg-red-950/50 text-red-400 px-2 py-0.5 rounded border border-red-900/50">Action Needed</span>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-2 leading-snug">{inv.issue}</h3>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 mb-4">
                          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Sparkles size={10}/> ATLAS Suggestion</p>
                          <p className="text-xs text-slate-300 leading-relaxed italic">"{inv.aiSuggestion}"</p>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => handleActionIntervention(inv.id, 'deploy_ai')} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black py-2 rounded-xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-1">
                            Deploy ATLAS
                          </button>
                          <button onClick={() => handleActionIntervention(inv.id, 'teacher_handle')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black py-2 rounded-xl transition-transform active:scale-95 shadow-lg">
                            I'll Handle It
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.5); border-radius: 4px; }
      `}} />
    </div>
  );
}
