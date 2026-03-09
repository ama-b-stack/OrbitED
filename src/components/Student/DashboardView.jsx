import React from 'react';
import { 
  MapPin, Sun, Calendar, Clock, School, Shield, Bell, Inbox, 
  MessageSquare, Zap, Coins, Activity, CheckCircle, Circle, 
  Clock3, AlertTriangle, RefreshCw, BookOpen, Lock, Brain 
} from 'lucide-react';
import { userContext, announcements, inboxMessages, vibeFeed } from '../../data/mockData.js';

const DashboardView = ({ onOpenLocker, onOpenAtlas, coins, quests, setQuests, wardrobe }) => {
  const activeTheme = wardrobe.find(i => i.type === 'theme' && i.equipped);
  const themeName = activeTheme?.name || 'Tech Room';
  const themeBgImage = activeTheme?.bgImage || '/tech_room.jpg';

  const handleQuestClick = (quest) => {
    if (quest.type === "synced") {
      alert("This is a Gradebook-synced task. It will automatically mark as complete when your teacher grades it!");
      return;
    }
    setQuests(prev => prev.map(q => {
      if (q.id === quest.id) {
        if (q.status === "not-started") return { ...q, status: "pending" };
        if (q.status === "pending") return { ...q, status: "not-started" };
      }
      return q;
    }));
  };

  const getStatusIcon = (status, type) => {
    if (status === "completed") return <CheckCircle size={18} className="text-green-400" />;
    if (status === "in-progress") return <RefreshCw size={18} className="text-blue-400 animate-spin-slow" />;
    if (status === "pending") return <Clock3 size={18} className="text-yellow-400" />;
    if (type === "synced") return <Lock size={18} className="text-slate-500" />;
    return <Circle size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />;
  };

  return (
    <div className="h-full text-slate-200 font-sans selection:bg-cyan-500/30 relative transition-all duration-500 bg-transparent">
      {/* Reduced opacity of themeBgImage to let Starry Sky show through clearly */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply"></div>
         <img src={themeBgImage} className="w-full h-full object-cover opacity-20" alt={themeName} onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      <div className="relative z-10 h-full p-4 md:p-6 lg:p-8 transition-all duration-300">
        <header className="max-w-7xl mx-auto mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 shadow-md">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300"><MapPin size={14} className="text-red-400"/> {userContext.location}</span>
              <span className="flex items-center gap-1 text-slate-300"><Sun size={14} className="text-yellow-400"/> {userContext.weather}</span>
              <span className="hidden sm:flex items-center gap-1"><Calendar size={14} className="text-blue-400"/> {userContext.date}</span>
              <span className="flex items-center gap-1 text-white bg-slate-800/80 px-2 py-1 rounded"><Clock size={14} className="text-cyan-400"/> {userContext.time}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300"><School size={14} className="text-purple-400"/> {userContext.school}</span>
              <span className="flex items-center gap-1 text-white bg-indigo-900/50 border border-indigo-500/30 px-2 py-1 rounded">{userContext.period}</span>
              {userContext.inSchool ? (
                <span className="flex items-center gap-1 text-green-400 bg-green-950/50 border border-green-500/30 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> IN SCHOOL
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span> OUT OF SCHOOL
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/70 backdrop-blur-lg p-5 rounded-3xl border border-slate-700 shadow-[0_0_40px_rgba(6,182,212,0.05)] gap-4 transition-all duration-300 hover:border-slate-600">
            <div className="flex items-center gap-4">
              {/* Uploaded Avatar Image */}
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-lg overflow-hidden flex-shrink-0">
                <img 
                  src="/profile_alex.jpg" 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.somake.ai%2Fcdn-cgi%2Fimage%2Fwidth%3D800%2Cquality%3D80%2Ftools%2Fstardew-valley-portrait-maker_gallery_1752220455_1610.jpg&f=1&nofb=1&ipt=61bf87c55c2beb86a449a997ef9e19fe9db93d13bd40f033cdc836e149c23d74'; }} 
                />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white leading-tight">{userContext.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{userContext.username}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button onClick={onOpenAtlas} className="w-full md:w-auto bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-indigo-400/50 backdrop-blur-sm">
                <Brain size={20} />
                Open ATLAS
              </button>
              <button onClick={onOpenLocker} className="w-full md:w-auto bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-cyan-400/50 backdrop-blur-sm">
                <Shield size={20} />
                Open Digital Locker
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3 transition-all hover:shadow-xl hover:border-slate-600 hover:-translate-y-1">
               {/* Uploaded Pet Image */}
               <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center shadow-inner overflow-hidden p-1">
                  <img 
                    src="/pet_owl.png" 
                    alt="Pet Companion" 
                    className="w-full h-full object-contain drop-shadow-md" 
                    onError={(e) => { e.target.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.f_70nZpqqt9UrWD7QOgUTAHaHa%3Fpid%3DApi&f=1&ipt=deda2cfc03d4372e21f1743768dc79d8847f0ed6cf6033c9c453da41bb5ad450&ipo=images'; }} 
                  />
               </div>
               <div>
                 <h3 className="font-bold text-sm text-indigo-300">{userContext.pet ? userContext.pet.name : 'Unknown Pet'}</h3>
                 <p className="text-[10px] text-green-400 font-bold uppercase">{userContext.pet ? userContext.pet.status : ''}</p>
               </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-lg transition-all hover:border-slate-600">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4"><Bell size={16}/> Notice Board</h2>
              <div className="space-y-3">
                {announcements.map((a, i) => (
                  <div key={a.id} className={`p-3 rounded-xl border backdrop-blur-sm animate-in slide-in-from-left-4 fade-in duration-500 ${a.type === 'warning' ? 'bg-red-950/30 border-red-900/50' : 'bg-blue-950/30 border-blue-900/50'}`} style={{animationDelay: `${i * 100}ms`}}>
                    <h3 className={`text-xs font-bold mb-1 flex items-center gap-1 ${a.type === 'warning' ? 'text-red-400' : 'text-blue-400'}`}>
                      {a.type === 'warning' ? <AlertTriangle size={12}/> : <Calendar size={12}/>} {a.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-snug">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col h-[300px] transition-all hover:border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Inbox size={16}/> Comms</h2>
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-emerald-950/50 text-emerald-400 px-2 py-1 rounded border border-emerald-900/50">
                  <Shield size={10}/> AI Shield Active
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {inboxMessages.map((m, i) => (
                  <div key={m.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 animate-in slide-in-from-left-4 fade-in duration-500" style={{animationDelay: `${i * 100}ms`}}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold ${m.isTeacher ? 'text-purple-400' : 'text-cyan-400'}`}>{m.sender}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.text}</p>
                    {!m.isTeacher && (
                      <div className="mt-2 flex gap-2">
                        <button className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-800/50 hover:bg-cyan-800/50 transition-colors active:scale-95">Accept Trade</button>
                        <button className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors active:scale-95">Decline</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl h-full flex flex-col transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-slate-600">
              <div className="flex justify-between items-end mb-6 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2"><BookOpen className="text-yellow-400" /> Mission Board</h2>
                  <p className="text-sm text-slate-400 mt-1">Complete assignments, bounties, and special missions to earn rewards.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {quests.map((quest, i) => (
                  <div 
                    key={quest.id} 
                    onClick={() => handleQuestClick(quest)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ease-in-out hover:-translate-y-1 group animate-in slide-in-from-bottom-4 fade-in backdrop-blur-sm ${
                      quest.type === 'synced' ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' : 
                      quest.status === 'pending' ? 'bg-yellow-950/30 border-yellow-900/50 cursor-pointer hover:bg-yellow-950/40' :
                      quest.type === 's-rank' ? 'bg-gradient-to-r from-orange-950/50 to-red-950/50 border-orange-500/50 hover:from-orange-900/50 hover:to-red-900/50 cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]' :
                      'bg-indigo-950/30 border-indigo-900/50 cursor-pointer hover:bg-indigo-900/40 hover:border-indigo-500/50'
                    }`}
                    style={{animationDelay: `${i * 100}ms`}}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(quest.status, quest.type)}
                      <div>
                        <h3 className={`font-bold transition-colors ${quest.status === 'completed' ? 'text-slate-500 line-through' : quest.type === 's-rank' ? 'text-orange-100' : 'text-slate-200'}`}>
                          {quest.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                            quest.type === 'synced' ? 'bg-slate-900/80 text-slate-400 border-slate-700' : 
                            quest.type === 's-rank' ? 'bg-orange-900/50 text-orange-400 border-orange-500/50' :
                            'bg-indigo-900/50 text-indigo-300 border-indigo-700'
                          }`}>
                            {quest.source}
                          </span>
                          {quest.status === 'pending' && <span className="text-[9px] uppercase font-black tracking-widest bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded border border-yellow-700">Awaiting Approval</span>}
                          {quest.type === 's-rank' && quest.status !== 'pending' && quest.status !== 'completed' && <span className="text-[9px] uppercase font-black tracking-widest bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-700 animate-pulse">High Risk / Reward</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`flex items-center gap-1 font-mono font-bold ${quest.status === 'completed' ? 'text-slate-600' : quest.type === 's-rank' ? 'text-orange-400 text-lg drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-yellow-400'}`}>
                        +{quest.coins} <Coins size={quest.type === 's-rank' ? 16 : 12} />
                      </span>
                      {quest.type === 's-rank' && <span className="text-[8px] text-orange-300 font-bold uppercase tracking-wider">+ Skin & Trophy</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-lg transition-all hover:border-slate-600">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4"><Coins size={16}/> Wallet Stats</h2>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 mb-4 flex items-center justify-between">
                <span className="text-slate-400 font-bold">Total Balance</span>
                <span className="text-2xl font-black text-yellow-400 flex items-center gap-2">{coins} <Coins size={20}/></span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs"><span className="text-slate-400 flex items-center gap-1"><Activity size={12}/> Attendance Sync</span><span className="font-bold text-green-400">+500</span></div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[40%] rounded-full"></div></div>
                <div className="flex justify-between items-center text-xs mt-2"><span className="text-slate-400 flex items-center gap-1"><BookOpen size={12}/> Grades Sync</span><span className="font-bold text-blue-400">+600</span></div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[50%] rounded-full"></div></div>
                <div className="flex justify-between items-center text-xs mt-2"><span className="text-slate-400 flex items-center gap-1"><MessageSquare size={12}/> Tutoring Bounties</span><span className="font-bold text-purple-400">+150</span></div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[10%] rounded-full"></div></div>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col h-[350px] transition-all hover:border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={16} className="text-cyan-400"/> The Vibe</h2>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {vibeFeed.map((vibe, i) => (
                  <div key={vibe.id} className="relative pl-4 border-l-2 border-slate-800 animate-in slide-in-from-right-4 fade-in duration-500" style={{animationDelay: `${i * 100}ms`}}>
                     <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-700"></div>
                     <p className="text-xs text-slate-300 leading-relaxed">
                       {vibe.text.split(' ').map((word, j) => (
                         <span key={j} className={word.startsWith('@') ? "font-bold text-cyan-400" : ""}>{word}{" "}</span>
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

export default DashboardView;