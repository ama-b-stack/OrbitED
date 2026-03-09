import React, { useState, useEffect, useRef } from 'react';
import { X, Brain, User, Globe, LogOut } from 'lucide-react';

export const TopBanner = ({ onLogout }) => (
  <>
    <style>{`
      @keyframes spin-slow-reverse {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      .animate-spin-slow-reverse {
        animation: spin-slow-reverse 12s linear infinite;
      }
      @keyframes orbit-meteor {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-orbit-meteor {
        animation: orbit-meteor 3s linear infinite;
      }
    `}</style>

    <div className="w-full bg-slate-950/20 backdrop-blur-md border-b border-white/5 px-6 py-4 md:px-12 sticky top-0 z-50 flex justify-between items-center">
      {/* Brand Logo - Matches Landing Page */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg overflow-hidden">
          <Globe size={24} className="z-10 animate-spin-slow-reverse" />
          <div className="absolute inset-0 z-20 pointer-events-none animate-orbit-meteor">
            <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]"></div>
          </div>
        </div>
        <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-cyan-400 transition-colors">
          Orbit<span className="text-cyan-400 group-hover:text-white">Ed</span>
        </span>
      </div>

      {/* Logout Action */}
      <div className="flex items-center justify-end w-24 md:w-32">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 transition-all hover:text-red-400 text-slate-400 group text-[10px] md:text-xs font-black tracking-[0.2em] uppercase"
          title="Log Out"
        >
          <span className="hidden sm:inline-block group-hover:tracking-[0.3em] transition-all">LOGOUT</span>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  </>
);

export const StarryBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-slate-950 overflow-hidden">
     <div className="starry-bg w-[200vw] h-[200vh] absolute top-[-50vh] left-[-50vw]"></div>
  </div>
);

export const AtlasWidget = ({ onOpenAtlas, schoolContext }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
     const persistenceInterval = schoolContext.riskLevel === 'High' ? 12000 : 35000;
     const timer = setInterval(() => { setShowPrompt(true); }, persistenceInterval);
     if(schoolContext.riskLevel === 'High') { setTimeout(() => setShowPrompt(true), 3000); }
     return () => clearInterval(timer);
  }, [schoolContext.riskLevel]);

  return (
     <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {showPrompt && (
          <div className="bg-indigo-600 border border-indigo-400/50 text-white p-4 rounded-2xl rounded-br-none shadow-[0_0_30px_rgba(79,70,229,0.5)] animate-in slide-in-from-bottom-2 fade-in max-w-[240px] pointer-events-auto relative">
             <button onClick={() => setShowPrompt(false)} className="absolute -top-2 -right-2 bg-slate-800 hover:bg-slate-700 rounded-full p-1 transition-colors"><X size={12}/></button>
             <p className="text-xs font-black mb-1.5 flex items-center gap-1.5 uppercase tracking-widest"><Brain size={14}/> ATLAS Check-in</p>
             <p className="text-[11px] opacity-90 leading-relaxed">
               {schoolContext.riskLevel === 'High' 
                 ? "Hey Alex, I've noticed recent algorithms assignments might be challenging. Let's review together to keep your momentum going!" 
                 : "Need any help understanding logic gates today?"}
             </p>
             <button onClick={() => { setShowPrompt(false); onOpenAtlas(); }} className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold py-1.5 rounded transition-colors">
               Open Study Session
             </button>
          </div>
        )}
        <button onClick={() => { setShowPrompt(false); onOpenAtlas(); }} className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-full shadow-[0_0_25px_rgba(79,70,229,0.6)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 pointer-events-auto border-2 border-indigo-300/50 group relative overflow-hidden" title="Open ATLAS AI Tutor">
           <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
           <Brain size={32} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        </button>
     </div>
  );
};

export const PixelIcon = ({ name, className }) => {
  const getSmallIcon = () => {
    switch(name) {
      case 'Plain White T-Shirt': return <><rect x="12" y="14" width="8" height="7" fill="#f8fafc" /><rect x="9" y="14" width="3" height="4" fill="#f8fafc" /><rect x="20" y="14" width="3" height="4" fill="#f8fafc" /><rect x="12" y="20" width="8" height="1" fill="rgba(0,0,0,0.15)" /></>;
      case 'Neon Tech Hoodie': return <><rect x="12" y="14" width="8" height="7" fill="#06b6d4" /><rect x="9" y="14" width="3" height="4" fill="#06b6d4" /><rect x="20" y="14" width="3" height="4" fill="#06b6d4" /><rect x="12" y="20" width="8" height="1" fill="rgba(0,0,0,0.15)" /><rect x="15" y="14" width="2" height="7" fill="#ec4899" /></>;
      case 'Blue Jeans': return <><rect x="12" y="20" width="8" height="3" fill="#1e40af" /><rect x="12" y="23" width="3" height="3" fill="#1e40af" /><rect x="17" y="23" width="3" height="3" fill="#1e40af" /></>;
      case 'Classic Sneakers': return <><rect x="11" y="28" width="4" height="2" fill="#e2e8f0" /><rect x="17" y="28" width="4" height="2" fill="#e2e8f0" /><rect x="11" y="29" width="4" height="1" fill="rgba(0,0,0,0.15)" /><rect x="17" y="29" width="4" height="1" fill="rgba(0,0,0,0.15)" /></>;
      case 'Cyberpunk Visor': return <><rect x="10" y="9" width="12" height="3" fill="#06b6d4" rx="1" /><rect x="10" y="10" width="12" height="1" fill="#cffafe" opacity="0.5" /></>;
      case 'Diamond Grills': return <><rect x="14" y="12" width="4" height="1" fill="#ffffff" /></>;
      case 'Bear Glass Cup': return <><rect x="20" y="17" width="4" height="5" fill="#fef3c7" rx="1" /><rect x="22" y="15" width="1" height="3" fill="#22c55e" /></>;
      case 'Rare Green Sword': return <><rect x="7" y="11" width="2" height="11" fill="#4ade80" /><rect x="6" y="21" width="4" height="1" fill="#1e293b" /><rect x="7" y="22" width="2" height="3" fill="#8b5a2b" /></>;
      case 'Pet Cyber Visor': return <><rect x="9" y="8" width="6" height="5" fill="#0891b2" rx="1" /><rect x="17" y="8" width="6" height="5" fill="#0891b2" rx="1" /></>;
      case 'Pet Top Hat': return <><rect x="12" y="2" width="8" height="6" fill="#1e293b" /><rect x="10" y="7" width="12" height="1" fill="#1e293b" /><rect x="12" y="6" width="8" height="1" fill="#ef4444" /></>;
      default: return <><circle cx="16" cy="16" r="6" fill="#475569" /></>;
    }
  }
  return <svg viewBox="0 0 32 32" className={`w-full h-full drop-shadow-lg ${className}`} style={{ imageRendering: 'pixelated' }}>{getSmallIcon()}</svg>;
};

export const PixelAvatar = ({ config, isSmall = false }) => {
  const colors = {
    skin: { 'Fair': '#ffedd5', 'Warm': '#f5b041', 'Deep': '#8b5a2b', 'Alien Green': '#4ade80', 'Bubblegum Pink': '#f472b6' },
    eyes: { 'Brown Eyes': '#452b11', 'Blue Eyes': '#3b82f6' },
    hair: { 'Black Hair': '#1e293b', 'Blonde Hair': '#fbbf24', 'Neon Pink Hair': '#ec4899' },
    top: { 'Plain White T-Shirt': '#f8fafc', 'Neon Tech Hoodie': '#06b6d4', 'Varsity Jacket': '#ef4444' },
    bottom: { 'Blue Jeans': '#1e40af', 'Black Tech Joggers': '#0f172a' },
    shoes: { 'Classic Sneakers': '#e2e8f0', 'Neon High-Tops': '#a855f7' }
  };
  const getC = (cat, name) => colors[cat]?.[name] || '#94a3b8';
  return (
    <div className={`${isSmall ? 'w-20 h-20' : 'w-56 h-56 relative z-10'} transform transition-transform ${!isSmall ? 'animate-float' : ''}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" style={{ imageRendering: 'pixelated' }}>
        {!isSmall && <ellipse cx="16" cy="30" rx="7" ry="1.5" fill="rgba(0,0,0,0.4)" />}
        {config.hairStyle === 'Long Wavy' && (<><rect x="7" y="8" width="18" height="14" fill={getC('hair', config.hairColor)} /><rect x="6" y="12" width="20" height="8" fill={getC('hair', config.hairColor)} /><rect x="7" y="22" width="4" height="2" fill={getC('hair', config.hairColor)} /><rect x="21" y="22" width="4" height="2" fill={getC('hair', config.hairColor)} /><rect x="12" y="22" width="8" height="1" fill={getC('hair', config.hairColor)} /></>)}
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
        {config.accessory?.includes('Rare Green Sword') && (<><rect x="7" y="11" width="2" height="11" fill="#4ade80" /><rect x="8" y="12" width="1" height="9" fill="#fff" opacity="0.6"/><rect x="6" y="21" width="4" height="1" fill="#1e293b" /><rect x="7" y="22" width="2" height="3" fill="#8b5a2b" /></>)}
        {config.pose === 'Hands in Pockets' ? (<><rect x="10" y="15" width="2" height="6" fill={getC('skin', config.skinColor)} /><rect x="20" y="15" width="2" height="6" fill={getC('skin', config.skinColor)} /></>) : config.pose === 'Victory Pose' ? (<><rect x="9" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /><rect x="21" y="8" width="3" height="6" fill={getC('skin', config.skinColor)} /> </>) : (<><rect x="9" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /><rect x="20" y="15" width="3" height="6" fill={getC('skin', config.skinColor)} /></>)}
        <rect x="12" y="14" width="8" height="7" fill={getC('top', config.top)} />
        <rect x="9" y="14" width="3" height="4" fill={getC('top', config.top)} /> 
        {config.pose === 'Victory Pose' ? <rect x="20" y="12" width="4" height="3" fill={getC('top', config.top)} /> : <rect x="20" y="14" width="3" height="4" fill={getC('top', config.top)} />}
        <rect x="12" y="20" width="8" height="1" fill="rgba(0,0,0,0.15)" />
        <rect x="9" y="17" width="3" height="1" fill="rgba(0,0,0,0.15)" />
        {config.accessory?.includes('Bear Glass Cup') && config.pose !== 'Victory Pose' && (<><rect x="20" y="17" width="4" height="5" fill="#fef3c7" opacity="0.8" rx="1" /><rect x="22" y="15" width="1" height="3" fill="#22c55e" /><rect x="21" y="19" width="1" height="1" fill="#000" opacity="0.3" /><rect x="23" y="19" width="1" height="1" fill="#000" opacity="0.3" /></>)}
        <rect x="14" y="13" width="4" height="2" fill={getC('skin', config.skinColor)} />
        <rect x="11" y="5" width="10" height="9" fill={getC('skin', config.skinColor)} rx="1" />
        <rect x="12" y="9" width="2" height="2" fill="#fff" />
        <rect x="13" y="9" width="1" height="2" fill={getC('eyes', config.eyeColor)} />
        <rect x="18" y="9" width="2" height="2" fill="#fff" />
        <rect x="18" y="9" width="1" height="2" fill={getC('eyes', config.eyeColor)} />
        {config.hairStyle === 'Short Messy' && (<><rect x="10" y="3" width="12" height="4" fill={getC('hair', config.hairColor)} rx="1" /><rect x="11" y="2" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="15" y="1" width="2" height="3" fill={getC('hair', config.hairColor)} /><rect x="19" y="2" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="9" y="5" width="2" height="5" fill={getC('hair', config.hairColor)} /><rect x="21" y="5" width="2" height="5" fill={getC('hair', config.hairColor)} /><rect x="11" y="6" width="2" height="3" fill={getC('hair', config.hairColor)} /><rect x="15" y="6" width="2" height="2" fill={getC('hair', config.hairColor)} /><rect x="19" y="6" width="2" height="3" fill={getC('hair', config.hairColor)} /></>)}
        {config.hairStyle === 'Long Wavy' && (<><rect x="10" y="3" width="12" height="3" fill={getC('hair', config.hairColor)} rx="1" /><rect x="9" y="5" width="3" height="6" fill={getC('hair', config.hairColor)} /><rect x="20" y="5" width="3" height="6" fill={getC('hair', config.hairColor)} /><rect x="11" y="5" width="6" height="2" fill={getC('hair', config.hairColor)} /></>)}
        {config.accessory?.includes('Cyberpunk Visor') && (<><rect x="10" y="9" width="12" height="3" fill="#06b6d4" opacity="0.8" rx="1" /><rect x="10" y="10" width="12" height="1" fill="#cffafe" opacity="0.5" /></>)}
        {config.accessory?.includes('Diamond Grills') && <rect x="14" y="12" width="4" height="1" fill="#ffffff" />}
      </svg>
    </div>
  );
};

export const PixelPet = ({ config }) => {
  const safeConfig = { accessory: [], ...config };
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

          {/* Pixel the Owl */}
          <rect x="10" y="12" width="12" height="14" fill="#8b5a2b" rx="4" />
          <rect x="12" y="16" width="8" height="10" fill="#d2b48c" rx="3" />
          <rect x="8" y="15" width="2" height="8" fill="#5c4033" rx="1" />
          <rect x="22" y="15" width="2" height="8" fill="#5c4033" rx="1" />
          {!safeConfig.accessory.includes('Pet Cyber Visor') && (
            <><rect x="12" y="14" width="3" height="3" fill="#fff" /><rect x="17" y="14" width="3" height="3" fill="#fff" /><rect x="13" y="15" width="1" height="1" fill="#000" /><rect x="18" y="15" width="1" height="1" fill="#000" /></>
          )}
          <rect x="15" y="17" width="2" height="2" fill="#f59e0b" />

          {/* Shared Accessories */}
          {safeConfig.accessory.includes('Pet Cyber Visor') && (
            <><rect x="8" y={15} width="16" height="2" fill="#1e293b" /><rect x="9" y={14} width="6" height="5" fill="#0891b2" rx="1" /><rect x="17" y={14} width="6" height="5" fill="#0891b2" rx="1" /><rect x="10" y={15} width="4" height="3" fill="#22d3ee" rx="0.5" /><rect x="18" y={15} width="4" height="3" fill="#22d3ee" rx="0.5" /><rect x="10" y={16} width="4" height="1" fill="#cffafe" opacity="0.6" /><rect x="18" y={16} width="4" height="1" fill="#cffafe" opacity="0.6" /></>
          )}
          {safeConfig.accessory.includes('Pet Top Hat') && (
            <><rect x="12" y={6} width="8" height="6" fill="#1e293b" /><rect x="10" y={11} width="12" height="1" fill="#1e293b" /><rect x="12" y={10} width="8" height="1" fill="#ef4444" /></>
          )}
        </svg>
      </div>
    </div>
  );
};

export const StreamableMarkdown = ({ text, isNew, onUpdate }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? '' : text);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isNew) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    const chunkSize = Math.max(1, Math.floor(text.length / 60)); 

    const timer = setInterval(() => {
      i += chunkSize;
      if (i >= text.length) {
        setDisplayedText(text);
        clearInterval(timer);
      } else {
        setDisplayedText(text.slice(0, i));
      }
      if (onUpdate) onUpdate();
    }, 25); 

    return () => clearInterval(timer);
  }, [text, isNew]);

  const renderText = (rawText) => {
    let processed = rawText;
    if (window.katex) {
        try {
            processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
                return `<div class="overflow-x-auto custom-scrollbar py-3 my-2 max-w-full bg-slate-900/30 rounded-xl px-4 border border-indigo-500/10 math-display">${window.katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
            });
            processed = processed.replace(/\$([\s\S]+?)\$/g, (match, formula) => {
                return window.katex.renderToString(formula, { displayMode: false, throwOnError: false });
            });
        } catch (e) {
            console.error("Katex error", e)
        }
    }
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-indigo-100">$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-indigo-200">$1</em>');
    processed = processed.replace(/```([\s\S]+?)```/g, '<pre class="bg-slate-950/50 p-4 rounded-xl overflow-x-auto custom-scrollbar text-xs font-mono my-3 border border-slate-800/80 shadow-inner max-w-full"><code>$1</code></pre>');
    processed = processed.replace(/`(.*?)`/g, '<code class="bg-slate-950/50 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs break-all">$1</code>');
    processed = processed.replace(/\n/g, '<br/>');

    return { __html: processed };
  };

  return (
    <div 
        ref={containerRef}
        className="markdown-container text-sm leading-relaxed overflow-x-hidden w-full break-words"
        dangerouslySetInnerHTML={renderText(displayedText)}
    />
  );
};
