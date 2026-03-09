import React, { useState, useEffect } from 'react';
import { Coins, Settings, X } from 'lucide-react';
import LandingPage from './components/LandingPage.jsx';
import DashboardView from './components/Student/DashboardView.jsx';
import LockerView from './components/Student/LockerView.jsx';
import AtlasView from './components/Student/AtlasView.jsx';
import { TopBanner, StarryBackground, AtlasWidget } from './components/Shared/UIComponents.jsx';
import { initialClosetItems, initialQuests, initialCardHistory, userContext, atlasConversations } from './data/mockData.js';

// Retrieve API key dynamically
const getApiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_GEMINI_API_KEY || "";
    }
  } catch (e) {}
  return "";
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'locker', 'atlas'
  const [wardrobe, setWardrobe] = useState(initialClosetItems);
  const [coins, setCoins] = useState(userContext.coins);
  const [quests, setQuests] = useState(initialQuests);
  const [toast, setToast] = useState(null);

  const [pendingTrades, setPendingTrades] = useState([]);
  const [cardHistory, setCardHistory] = useState(initialCardHistory);

  const [schoolContext, setSchoolContext] = useState({ 
    riskLevel: 'Normal', 
    details: 'Analyzing district data...',
    atlasInstructions: 'Provide standard academic support.'
  });

  // --- NEW: Persisting Student Settings ---
  const [studentSettings, setStudentSettings] = useState({
    isShy: true,
    learningStyle: 'Visual (Images & Diagrams)'
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const awardCoins = (amount, message) => {
    setCoins(prev => prev + amount);
    setToast({ amount, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoginSuccess = (role) => {
    if (role === 'student') {
      setCurrentView('dashboard');
    } else {
      alert("Teacher Command Center is under construction. Log in as a Student to see the demo!");
    }
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  useEffect(() => {
    const scriptId = 'tailwind-cdn-fix';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchUrbanDataAndAnalyze = async () => {
      try {
        const geminiApiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : "";
        const brightDataToken = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_BRIGHTDATA_TOKEN : "API_TOKEN";

        if (!geminiApiKey) {
           console.warn("No Gemini API key found. Proceeding with fallback local context.");
           throw new Error("Missing Gemini API Key");
        }

        console.group("BrightData Web Scraper & Gemini Analysis");
        console.log("Triggering BrightData collector for Urban Institute Data...");

        const scraperRes = await fetch("https://api.brightdata.com/dca/trigger?collector=c_mmigtntx1x0kzbh4xa&queue_next=1", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${brightDataToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify([{ "url": "https://educationdata.urban.org/data-explorer/explorer" }])
        });

        const scrapedData = await scraperRes.json().catch(() => ({ status: "Scraper triggered successfully, awaiting data."}));
        console.log("BrightData Response:", scrapedData);

        const chatHistory = atlasConversations && atlasConversations[0] 
          ? atlasConversations[0].messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n') 
          : "No recent history.";

        const analysisPrompt = `
          You are an educational data analyst and AI tutor settings configurator.
          Analyze the following crawled school data for the student's district, their personal settings, and their recent ATLAS AI tutor conversation history. 

          Student Context: ${JSON.stringify(userContext)}
          Recent Chat History: ${chatHistory}
          Crawled District Data: ${JSON.stringify(scrapedData)}

          Determine if the student's school environment is 'High' or 'Normal' risk based on factors like absenteeism, demographic funding, or discipline incidents. 
          Then, tailor instructions for how the ATLAS AI tutor should proactively communicate with this student. 
          (e.g., higher risk needs more frequent, encouraging check-ins, scaffolding, and persistent alerts; normal risk needs standard academic support).

          Respond ONLY with a valid JSON object matching this exact schema:
          {
            "riskLevel": "High" | "Normal",
            "details": "A brief 2-sentence explanation of the risk assessment.",
            "atlasInstructions": "Specific instructions for the AI tutor's personality, communication style, and check-in frequency based on the assessment."
          }
        `;

        console.log("Data collected. Sending to Gemini for Context Analysis...");

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        if (!geminiRes.ok) throw new Error("Gemini API request failed.");

        const geminiData = await geminiRes.json();
        const analysisText = geminiData.candidates[0].content.parts[0].text;
        const analysis = JSON.parse(analysisText);

        setSchoolContext({
           riskLevel: analysis.riskLevel || 'Normal',
           details: analysis.details || 'Analysis complete.',
           atlasInstructions: analysis.atlasInstructions || 'Provide standard support.'
        });

        console.log("Analysis Complete:", analysis);
        console.groupEnd();

      } catch (error) {
        console.warn("Crawler or Analysis error. Defaulting to high-risk fallback context.", error);
        setSchoolContext({ 
          riskLevel: 'High', 
          details: 'Fallback Profile: Montgomery High School. Elevated risk metrics detected in local area data. Provide extra scaffolding.',
          atlasInstructions: 'Student requires highly proactive check-ins, shorter learning intervals, and significant encouragement during STEM subjects.'
        });
      }
    };

    fetchUrbanDataAndAnalyze();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap');
        body, div, span, p, h1, h2, h3, h4, h5, h6, button, input, textarea, a { font-family: 'Outfit', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 1); }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes float-fast { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        @keyframes slideBounce { 0% { transform: translateX(80px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        .animate-slide-bounce { animation: slideBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes slideBounceOut { 0% { transform: translateX(0); opacity: 1; } 20% { transform: translateX(-20px); opacity: 1; } 100% { transform: translateX(200px); opacity: 0; } }
        .animate-slide-bounce-out { animation: slideBounceOut 0.5s ease-in forwards; }
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        .katex-display { margin: 0; overflow-x: auto; overflow-y: hidden; text-align: center; }
        .katex { font-size: 1.15em; color: #a5b4fc; } 
        .markdown-container * { max-width: 100%; }

        .starry-bg {
           background-image: 
              radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 4px),
              radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 3px),
              radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 4px),
              radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 3px);
           background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
           background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
           animation: backgroundTwinkle 120s linear infinite;
        }
        @keyframes backgroundTwinkle {
           from { transform: translateY(0); }
           to { transform: translateY(-500px); }
        }
      `}} />

      {currentView === 'landing' && (
        <LandingPage onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView !== 'landing' && (
        <>
          <StarryBackground />
          <TopBanner onLogout={handleLogout} />

          {toast && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border border-emerald-500 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 z-50">
              <div className="bg-yellow-500/20 p-1.5 rounded-full"><Coins size={20} className="text-yellow-400" /></div>
              <div>
                 <p className="font-black text-emerald-400 text-sm leading-tight">+{toast.amount} Coins Earned</p>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">{toast.message}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
            {currentView === 'dashboard' && (
              <DashboardView 
                onOpenLocker={() => setCurrentView('locker')} 
                onOpenAtlas={() => setCurrentView('atlas')}
                wardrobe={wardrobe}
                coins={coins}
                quests={quests}
                setQuests={setQuests}
              />
            )}

            {currentView === 'locker' && (
              <LockerView 
                onBack={() => setCurrentView('dashboard')} 
                wardrobe={wardrobe}
                setWardrobe={setWardrobe}
                coins={coins}
                setCoins={setCoins}
                pendingTrades={pendingTrades}
                setPendingTrades={setPendingTrades}
                cardHistory={cardHistory}
              />
            )}

            {currentView === 'atlas' && (
              <AtlasView 
                onBack={() => setCurrentView('dashboard')}
                coins={coins}
                awardCoins={awardCoins}
                setQuests={setQuests}
                schoolContext={schoolContext}
                studentSettings={studentSettings}
              />
            )}
          </div>

          {/* Floating Settings Button */}
          {['dashboard', 'locker'].includes(currentView) && (
            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="fixed bottom-24 right-6 z-40 bg-slate-800 p-4 rounded-full border border-slate-700 text-slate-400 hover:text-white shadow-xl hover:scale-110 transition-transform"
            >
              <Settings size={24} />
            </button>
          )}

          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-black text-white">Learning Profile</h2>
                     <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                     <label className="flex items-start gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/50 transition-colors">
                       <input 
                         type="checkbox" 
                         checked={studentSettings.isShy} 
                         onChange={e => setStudentSettings({...studentSettings, isShy: e.target.checked})} 
                         className="mt-1 w-5 h-5 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-900 cursor-pointer" 
                       />
                       <div>
                         <p className="font-black text-white text-base leading-none mb-1">I am a Shy Learner</p>
                         <p className="text-xs text-slate-400 leading-relaxed">Instructs ATLAS to be extra gentle with feedback and alerts your teacher to avoid cold-calling you.</p>
                       </div>
                     </label>
                     <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preferred Learning Style</p>
                        <select 
                          value={studentSettings.learningStyle} 
                          onChange={e => setStudentSettings({...studentSettings, learningStyle: e.target.value})} 
                          className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl p-4 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <option>Visual (Images & Diagrams)</option>
                          <option>Auditory (Listening & Speaking)</option>
                          <option>Reading/Writing (Text & Lists)</option>
                          <option>Kinesthetic (Hands-on & Examples)</option>
                        </select>
                     </div>
                     <button onClick={() => setShowSettingsModal(false)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-transform active:scale-95 shadow-lg mt-4">
                       Save Profile
                     </button>
                  </div>
               </div>
            </div>
          )}

          {currentView !== 'atlas' && (
             <AtlasWidget 
                onOpenAtlas={() => setCurrentView('atlas')} 
                schoolContext={schoolContext} 
             />
          )}
        </>
      )}
    </div>
  );
}