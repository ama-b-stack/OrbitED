import React, { useState } from 'react';
import { ChevronLeft, Shield, Edit2, Zap, Shirt, Coins, Clock3, ArrowLeftRight, RotateCcw, CheckCircle, User, X, Award } from 'lucide-react';
import { PixelIcon, PixelAvatar, PixelPet } from '../Shared/UIComponents.jsx';
import { userContext, petData, trophies, tradingCards, peerDecks } from '../../data/mockData.js';

const TradingCard = ({ card, isSelectable, isSelected, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(card);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`relative group perspective-1000 w-full aspect-[2.5/3.5] cursor-pointer transition-all duration-300 ease-in-out ${isSelected ? 'scale-105 z-20' : 'hover:-translate-y-2 hover:scale-105 z-10'}`} onClick={handleClick}>
      <div className={`w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-4 flex flex-col transition-all duration-300 ${isSelected ? 'border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : 'border-2 border-slate-700 shadow-2xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'}`}>
        <div className="flex justify-between items-start mb-3 relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">{card.series}</span>
          {!isSelectable && <span className="bg-cyan-500/20 text-cyan-400 font-bold text-[10px] px-2 py-1 rounded-full border border-cyan-500/30">Own: {card.owned}</span>}
        </div>

        <div className="flex-1 w-full mb-3 relative perspective-1000 z-10">
          <div className={`w-full h-full absolute inset-0 transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-black rounded-xl border-2 border-slate-800 flex flex-col items-center justify-center overflow-hidden z-10 shadow-inner" style={{ transform: 'rotateY(0deg)' }}>
              <div className="w-full h-full bg-slate-900/50 p-2 flex items-center justify-center">
                 {card.customImage ? (
                   <img src={card.customImage} alt={card.name} className="w-full h-full object-cover rounded-lg border border-slate-800 shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
                 ) : (
                   <div className="w-20 h-20 mb-2"><PixelIcon name={card.name} /></div>
                 )}
                 {!card.customImage && <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>}
              </div>

              {!isSelectable && (
                <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur-sm z-20 hover:bg-black transition-colors" onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
                  <RotateCcw size={12} className="text-white"/>
                </div>
              )}
              {isSelected && (
                <div className="absolute inset-0 bg-yellow-400/20 z-30 flex items-center justify-center backdrop-blur-[1px]">
                   <CheckCircle size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]" />
                </div>
              )}
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden bg-slate-950 rounded-xl border-2 border-slate-800 p-3 flex flex-col shadow-inner overflow-hidden z-20" style={{ transform: 'rotateY(180deg)' }}>
               <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest text-center mb-1">{card.rarity} Rarity</p>
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-2">
                 <p className="text-[10px] text-slate-300 leading-relaxed text-center italic">"{card.lore}"</p>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded p-2 flex-shrink-0 mt-auto">
                 <p className="text-[8px] text-yellow-400 uppercase font-bold mb-1 flex items-center gap-1"><Zap size={8} /> Gained From</p>
                 <p className="text-[9px] text-slate-300 leading-snug">{card.earnedFrom || "Unknown"}</p>
               </div>

               {!isSelectable && (
                 <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur-sm z-30 hover:bg-black transition-colors" onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
                   <RotateCcw size={12} className="text-white"/>
                 </div>
               )}
            </div>
          </div>
        </div>

        <h3 className="font-black text-white text-base leading-tight mb-2 relative z-10 line-clamp-2">{card.name}</h3>
        <div className="grid grid-cols-2 gap-2 mt-auto relative z-10">
          {Object.entries(card.stats).map(([stat, val]) => (
            <div key={stat} className="bg-slate-900 rounded-lg p-1.5 border border-slate-800 flex justify-between items-center">
              <p className="text-[8px] text-slate-500 uppercase font-bold">{stat}</p>
              <p className="font-mono text-xs text-cyan-400 font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LockerView = ({ onBack, wardrobe, setWardrobe, coins, setCoins, pendingTrades, setPendingTrades, cardHistory }) => {
  const [activeTab, setActiveTab] = useState('homeroom');
  const [statusMessage, setStatusMessage] = useState("Pixelated and ready to learn!");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [closetFilter, setClosetFilter] = useState('all');
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const [isClosingModal, setIsClosingModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [isClosingTrade, setIsClosingTrade] = useState(false);
  const [tradeStep, setTradeStep] = useState(1);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [mySelectedCard, setMySelectedCard] = useState(null);
  const [theirSelectedCard, setTheirSelectedCard] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const cycleDialogue = () => setCurrentDialogue((prev) => (prev + 1) % petData.dialogue.length);

  const activeTheme = wardrobe.find(i => i.type === 'theme' && i.equipped);
  const themeName = activeTheme?.name || 'Tech Room';
  const themeBgImage = activeTheme?.bgImage || '/tech_room.jpg';

  const avatarConfig = {
    skinColor: wardrobe.find(i => i.type === 'skinColor' && i.equipped)?.name || 'Fair',
    eyeColor: wardrobe.find(i => i.type === 'eyeColor' && i.equipped)?.name || 'Brown Eyes',
    hairColor: wardrobe.find(i => i.type === 'hairColor' && i.equipped)?.name || 'Black Hair',
    hairStyle: wardrobe.find(i => i.type === 'hairStyle' && i.equipped)?.name || 'Short Messy',
    top: wardrobe.find(i => i.type === 'top' && i.equipped)?.name || 'Plain White T-Shirt',
    bottom: wardrobe.find(i => i.type === 'bottom' && i.equipped)?.name || 'Blue Jeans',
    shoes: wardrobe.find(i => i.type === 'shoes' && i.equipped)?.name || 'Classic Sneakers',
    pose: wardrobe.find(i => i.type === 'pose' && i.equipped)?.name || 'Idle',
    accessory: wardrobe.filter(i => i.equipped && i.type === 'accessory').map(i => i.name)
  };

  const petConfig = { accessory: wardrobe.filter(i => i.equipped && i.type === 'pet').map(i => i.name) };

  const toggleEquip = (id) => {
    setWardrobe(prev => {
      const item = prev.find(i => i.id === id);
      if (!item?.owned) return prev;
      const isEq = !item.equipped;
      const typesToClear = ['top', 'bottom', 'shoes', 'skinColor', 'eyeColor', 'hairColor', 'hairStyle', 'theme', 'pose'];
      return prev.map(i => {
        if (isEq && i.id !== id && typesToClear.includes(item.type) && i.type === item.type) return { ...i, equipped: false };
        return i.id === id ? { ...i, equipped: isEq } : i;
      });
    });
  };

  const buyItem = (id, cost) => {
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setWardrobe(prev => prev.map(i => i.id === id ? { ...i, owned: true } : i));
    } else { alert("Not enough coins!"); }
  };

  const handleStatusChange = (text) => {
    const lower = text.toLowerCase();
    const filters = {
      selfHarm: ['suicide', 'kill myself', 'die'],
      violence: ['shoot', 'gun', 'bomb'],
      profanity: ['fuck', 'shit', 'bitch'],
      bullying: ['stupid', 'dumb', 'ugly', 'hate you']
    };

    let detectedError = "";
    if (filters.selfHarm.some(word => lower.includes(word))) detectedError = "💙 AI Monitor: We care about you. Please reach out to a counselor.";
    else if (filters.violence.some(word => lower.includes(word))) detectedError = "🚨 AI Monitor: Violent language is prohibited.";
    else if (filters.profanity.some(word => lower.includes(word))) detectedError = "⚠️ AI Monitor: Profanity detected.";
    else if (filters.bullying.some(word => lower.includes(word))) detectedError = "🛑 AI Monitor: Negative language detected.";

    setStatusError(detectedError);
    setTempStatus(text);
  };

  const saveStatus = () => { if (!statusError) { setStatusMessage(tempStatus || "Vibing"); setIsEditingStatus(false); } };

  const handleCloseTrade = () => {
    setIsClosingTrade(true);
    setTimeout(() => {
      setShowTradeModal(false);
      setIsClosingTrade(false);
      setTradeStep(1);
      setSelectedPeer(null);
      setMySelectedCard(null);
      setTheirSelectedCard(null);
    }, 500);
  };

  const handleConfirmTrade = () => {
    const newTrade = {
      id: Date.now(),
      peerName: selectedPeer.name,
      offerCard: mySelectedCard.name,
      requestCard: theirSelectedCard.name,
      status: 'Awaiting Response'
    };
    setPendingTrades([...pendingTrades, newTrade]);
    handleCloseTrade();
  };

  const filterCategories = ['all', 'clothes', 'accessories', 'pet', 'skins', 'hair', 'poses', 'room theme', 'store'];
  const categoryMap = { 'clothes': ['top', 'bottom', 'shoes'], 'accessories': ['accessory'], 'pet': ['pet'], 'skins': ['skinColor', 'eyeColor'], 'hair': ['hairColor', 'hairStyle'], 'poses': ['pose'], 'room theme': ['theme'] };

  const filteredWardrobe = wardrobe.filter(item => {
    if (closetFilter === 'store') return !item.owned;
    if (!item.owned) return false;
    if (closetFilter === 'all') return true;
    return categoryMap[closetFilter]?.includes(item.type);
  });

  return (
    <div className="h-full text-slate-200 font-sans p-4 md:p-8 selection:bg-cyan-500/30 transition-all duration-500 bg-transparent">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md transition-all duration-300">
        <div className="w-full">
          <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 font-bold text-sm flex items-center gap-1 transition-all hover:-translate-x-1 mb-2 w-max">
            <ChevronLeft size={18}/> Dashboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight flex items-center gap-3">
              <Shield className="text-cyan-400" /> Digital Locker
            </h1>
            <p className="text-slate-400 font-medium mt-1">Portfolio & Inventory for {userContext.name}</p>
          </div>
          <div className="flex gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex-wrap justify-center">
            {['homeroom', 'items', 'trophy cabinet', 'deck'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out text-sm capitalize ${activeTab === tab ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pb-24">
        {activeTab === 'homeroom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`relative bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-slate-700`}>
              <h3 className="absolute top-6 left-6 font-bold text-slate-400 text-xs z-10 flex items-center gap-2"><span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md border border-cyan-500/30">{userContext.username}</span><span className="text-[10px] text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800 uppercase tracking-widest">{themeName}</span></h3>
              <div className="absolute top-6 right-6 w-20 h-20 sm:w-24 sm:h-24 bg-slate-950 border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl z-20 flex items-center justify-center transition-transform hover:scale-105">
                 <img src="/profile_alex.jpg" className="w-full h-full object-cover" alt="Profile" onError={(e) => { e.target.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.somake.ai%2Fcdn-cgi%2Fimage%2Fwidth%3D800%2Cquality%3D80%2Ftools%2Fstardew-valley-portrait-maker_gallery_1752220455_1610.jpg&f=1&nofb=1&ipt=61bf87c55c2beb86a449a997ef9e19fe9db93d13bd40f033cdc836e149c23d74'; }} />
              </div>

              <div className="relative w-full h-64 sm:h-72 mt-12 flex items-center justify-center rounded-2xl border-2 border-slate-800/50 shadow-inner z-10 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
                <img src={themeBgImage} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" alt={themeName} onError={(e) => { e.target.style.display = 'none'; }} />
                <PixelAvatar config={avatarConfig} />
              </div>

              <div className="mt-6 w-full max-w-sm z-10">
                {isEditingStatus ? (
                  <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                    <div className="flex gap-2">
                      <input type="text" maxLength={40} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" value={tempStatus} onChange={(e) => handleStatusChange(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && saveStatus()} />
                      <button onClick={saveStatus} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95">Save</button>
                    </div>
                    {statusError && <p className="text-[10px] text-red-400 font-bold px-2 animate-pulse">{statusError}</p>}
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 cursor-text flex justify-between items-center group transition-all hover:bg-slate-900" onClick={() => { setTempStatus(statusMessage); setIsEditingStatus(true); }}>
                    <p className="text-sm text-slate-300 font-medium">{statusMessage}</p>
                    <Edit2 size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-8 shadow-xl flex flex-col transition-all duration-700 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-400/50">
               <h3 className="font-bold text-indigo-400 uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><Zap size={16} /> {petData.name}</h3>
               <div onClick={cycleDialogue} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl mb-6 cursor-pointer hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg relative group">
                 <p className="text-sm font-medium text-indigo-100">"{petData.dialogue[currentDialogue]}"</p>
                 <p className="text-[9px] text-indigo-400/50 mt-2 text-right uppercase tracking-widest font-bold group-hover:text-indigo-400 transition-colors">Tap to chat</p>
               </div>
               <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto">
                 <div className="relative w-32 h-32 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <PixelPet config={petConfig} />
                 </div>
                 <div className="flex-1 w-full space-y-4">
                   <div className="flex justify-between items-end"><h4 className="text-xl font-bold text-white">Pet Info</h4><span className="text-xs font-mono text-purple-300">Stage: {petData.stage}</span></div>
                   <div className="flex flex-wrap gap-1">{petData.traits.map(trait => (<span key={trait} className="text-[9px] uppercase bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">{trait}</span>))}</div>
                   <div className="space-y-1 bg-slate-900/50 p-4 rounded-xl border border-white/5"><div className="flex justify-between text-xs font-semibold mb-2"><span className="text-slate-400">Vitality</span><span className="text-green-400">{petData.vitality}%</span></div><div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${petData.vitality}%` }}></div></div></div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-slate-100 flex items-center gap-2"><Shirt className="text-pink-400" /> Locker Items</h2><div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl"><Coins size={16} className="text-yellow-400" /><span className="font-bold text-yellow-400">{coins}</span></div></div>
            <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-slate-800">{filterCategories.map(cat => (<button key={cat} onClick={() => setClosetFilter(cat)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all duration-300 ${closetFilter === cat ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-md' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-900 hover:-translate-y-0.5'}`}>{cat === 'store' ? '🛒 Store' : cat}</button>))}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredWardrobe.map((item, i) => (
                <div key={item.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-600 animate-in slide-in-from-bottom-4 fade-in" style={{animationDelay: `${i * 50}ms`}}>
                   <div className="w-full aspect-square bg-slate-900 rounded-xl mb-4 flex items-center justify-center border border-slate-800/50 p-4 relative overflow-hidden transition-transform group-hover:scale-105">
                     {item.type === 'theme' ? (
                        <img src={item.storeImage || item.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50" onError={(e) => { e.target.style.display = 'none'; }} />
                     ) : null}
                     {item.type === 'pose' ? (<div className="pointer-events-none scale-[1.75]"><PixelAvatar config={{...avatarConfig, pose: item.name}} isSmall={true} /></div>) : ['skinColor', 'eyeColor', 'hairColor'].includes(item.type) ? (<div className="w-16 h-16 rounded-full ring-4 ring-slate-800 relative z-10" style={{ backgroundColor: item.type === 'skinColor' ? ({ 'Fair': '#ffedd5', 'Warm': '#f5b041', 'Deep': '#8b5a2b', 'Alien Green': '#4ade80', 'Bubblegum Pink': '#f472b6' }[item.name]) : item.type === 'eyeColor' ? ({ 'Brown Eyes': '#452b11', 'Blue Eyes': '#3b82f6' }[item.name]) : ({ 'Black Hair': '#1e293b', 'Blonde Hair': '#fbbf24', 'Neon Pink Hair': '#ec4899' }[item.name]) }} />) : item.type !== 'theme' && <PixelIcon name={item.name} className="relative z-10 w-20 h-20" />}
                   </div>
                   <p className="text-xs font-bold text-slate-200 mb-4 text-center">{item.name}</p>
                   {item.owned ? (
                     <div className="w-full flex flex-col gap-2 mt-auto">
                       <button onClick={() => toggleEquip(item.id)} className={`w-full py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${item.equipped ? 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}>{item.equipped ? 'Unequip' : 'Equip'}</button>
                       {item.robloxCode && <div className="text-[9px] text-center bg-slate-900 text-green-400 py-1 rounded border border-slate-800 font-mono tracking-tighter">Code: {item.robloxCode}</div>}
                     </div>
                   ) : (
                     <button onClick={() => buyItem(item.id, item.cost)} className="w-full mt-auto py-2 rounded-xl text-xs font-bold bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 flex items-center justify-center gap-1 transition-all active:scale-95"><Coins size={14}/> {item.cost}</button>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trophy cabinet' && (
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-2">Verified Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {trophies.map((t, i) => (
                <div key={t.id} onClick={() => setSelectedTrophy(t)} className="cursor-pointer group animate-in slide-in-from-bottom-4 fade-in" style={{animationDelay: `${i * 100}ms`}}>
                   <div className="aspect-square bg-slate-950/80 rounded-2xl border-2 border-slate-800 p-4 mb-4 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:-translate-y-3 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:border-slate-600 overflow-hidden relative">
                     {t.customImage ? (
                        <img src={t.customImage} className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" alt={t.name} onError={(e) => { e.target.style.display = 'none'; }} />
                     ) : (
                        <div className="w-16 h-16"><PixelIcon name={t.name} /></div>
                     )}
                   </div>
                   <p className="text-xs font-bold text-center text-slate-400 group-hover:text-slate-200 transition-colors">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deck' && (
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-800 gap-4">
              <h2 className="text-2xl font-black text-slate-100">Trading Card Deck</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Clock3 size={16}/> History
                </button>
                <button 
                  onClick={() => setShowTradeModal(true)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all hover:-translate-y-1 active:scale-95"
                >
                  <ArrowLeftRight size={16}/> Trade Hub
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tradingCards.map((c, i) => (
                <div key={c.id} className="animate-in slide-in-from-bottom-6 fade-in duration-500" style={{animationDelay: `${i * 150}ms`}}>
                  <TradingCard card={c} />
                </div>
              ))}
            </div>

            {/* Pending Trade Requests Section */}
            {pendingTrades.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-black text-slate-300 mb-4 flex items-center gap-2">
                  <RefreshCw size={18} className="text-cyan-400 animate-spin-slow"/> Active Trade Requests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingTrades.map(trade => (
                    <div key={trade.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center shadow-lg hover:border-slate-700 transition-colors">
                      <div>
                        <p className="text-xs text-slate-400 font-bold mb-1">To: <span className="text-purple-400">{trade.peerName}</span></p>
                        <p className="text-sm font-bold text-slate-200">Offering: <span className="text-cyan-400">{trade.offerCard}</span></p>
                        <p className="text-sm font-bold text-slate-200">For: <span className="text-yellow-400">{trade.requestCard}</span></p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="bg-yellow-900/30 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-yellow-700/50 mb-2">
                          {trade.status}
                        </span>
                        <button 
                          onClick={() => setPendingTrades(prev => prev.filter(t => t.id !== trade.id))} 
                          className="text-[10px] text-slate-500 hover:text-red-400 font-bold transition-colors"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* TROPHY MODAL */}
      {selectedTrophy && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isClosingModal ? 'pointer-events-none' : ''}`}>
          <div 
            className={`absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity duration-500 ${isClosingModal ? 'opacity-0 delay-[200ms]' : 'opacity-100 animate-in fade-in duration-300'}`}
            onClick={() => {
               setIsClosingModal(true);
               setTimeout(() => { setSelectedTrophy(null); setIsClosingModal(false); }, 500);
            }}
          />
          <div className={`relative z-10 bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col ${isClosingModal ? 'animate-slide-bounce-out' : 'animate-slide-bounce'}`}>
            <div className={`h-48 bg-gradient-to-br ${selectedTrophy.color} flex items-center justify-center relative shadow-inner overflow-hidden`}>
              <div className="w-40 h-40 transform transition-transform hover:scale-110 duration-500">
                {selectedTrophy.customImage ? (
                  <img src={selectedTrophy.customImage} className="w-full h-full object-contain drop-shadow-2xl" alt={selectedTrophy.name} />
                ) : (
                  <PixelIcon name={selectedTrophy.name} className="w-full h-full object-contain drop-shadow-2xl" />
                )}
              </div>
              <button 
                onClick={() => {
                   setIsClosingModal(true);
                   setTimeout(() => { setSelectedTrophy(null); setIsClosingModal(false); }, 500);
                }} 
                className="absolute top-4 right-4 bg-slate-950/40 text-white p-2 rounded-full hover:bg-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-black text-green-400 tracking-widest uppercase border border-green-400/30 px-2 py-1 rounded">Verified Credential</span>
              <h2 className="text-2xl font-black text-white mt-4 mb-2">{selectedTrophy.name}</h2>
              <p className="text-sm text-slate-400 italic mb-6">"{selectedTrophy.profTranslation}"</p>
              <button className="w-full bg-slate-200 text-slate-900 font-bold py-3 rounded-xl hover:bg-white shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95">Export to PDF Resume</button>
            </div>
          </div>
        </div>
      )}

      {/* TRADE HUB MODAL */}
      {showTradeModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isClosingTrade ? 'pointer-events-none' : ''}`}>
          <div 
            className={`absolute inset-0 bg-slate-950/95 backdrop-blur-xl transition-opacity duration-500 ${isClosingTrade ? 'opacity-0 delay-[200ms]' : 'opacity-100 animate-in fade-in duration-300'}`}
            onClick={handleCloseTrade}
          />
          <div className={`relative z-10 bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl ${isClosingTrade ? 'animate-slide-bounce-out' : 'animate-slide-bounce'}`}>

            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 shrink-0">
              <div>
                <h2 className="text-xl font-black text-purple-400 flex items-center gap-2"><ArrowLeftRight size={20}/> Card Trade Hub</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {tradeStep === 1 ? "Step 1: Select a classmate to initiate a trade." : `Step 2: Propose a trade with ${selectedPeer?.name}`}
                </p>
              </div>
              <button onClick={handleCloseTrade} className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-800 hover:bg-slate-700 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {tradeStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
                  {peerDecks.map((peer, i) => (
                    <div 
                      key={peer.id} 
                      onClick={() => { setSelectedPeer(peer); setTradeStep(2); }}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 group flex items-center justify-between"
                      style={{animationDelay: `${i * 100}ms`}}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 group-hover:border-purple-400 transition-colors">
                          <User className="text-slate-400 group-hover:text-purple-300" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-lg">{peer.name}</h3>
                          <p className="text-xs font-bold text-cyan-400">{peer.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Deck Size</p>
                        <p className="text-lg font-black text-slate-300">{peer.deck.length} Cards</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tradeStep === 2 && selectedPeer && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500 ease-out">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

                    {/* My Deck Selection */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col">
                      <h3 className="font-black text-slate-300 uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><User size={14}/> Your Offer</h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-2 gap-4">
                        {tradingCards.map(card => (
                          <TradingCard 
                            key={card.id} 
                            card={card} 
                            isSelectable={true} 
                            isSelected={mySelectedCard?.id === card.id}
                            onSelect={setMySelectedCard}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Their Deck Selection */}
                    <div className="bg-purple-950/10 rounded-2xl border border-purple-900/30 p-6 flex flex-col">
                      <h3 className="font-black text-purple-400 uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><Zap size={14}/> {selectedPeer.name}'s Deck</h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-2 gap-4">
                        {selectedPeer.deck.map(card => (
                          <TradingCard 
                            key={card.id} 
                            card={card} 
                            isSelectable={true} 
                            isSelected={theirSelectedCard?.id === card.id}
                            onSelect={setTheirSelectedCard}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Trade Footer */}
            {tradeStep === 2 && (
              <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                  <button onClick={() => setTradeStep(1)} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">← Back to Students</button>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trade Summary</p>
                    <p className="text-xs font-bold text-slate-300">
                      {mySelectedCard ? <span className="text-cyan-400">{mySelectedCard.name}</span> : "Select Your Card"}
                      <span className="text-slate-500 mx-2">for</span>
                      {theirSelectedCard ? <span className="text-purple-400">{theirSelectedCard.name}</span> : "Select Their Card"}
                    </p>
                  </div>
                  <button 
                    onClick={handleConfirmTrade}
                    disabled={!mySelectedCard || !theirSelectedCard}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 active:scale-95 disabled:shadow-none"
                  >
                    Confirm Trade Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CARD HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowHistoryModal(false)} />
          <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl animate-slide-bounce max-h-[85vh]">

            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 shrink-0">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Clock3 size={20} className="text-blue-400"/> Collector's History</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">A permanent ledger of your trading card acquisitions.</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-800 hover:bg-slate-700 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cardHistory.map((event, i) => (
                <div key={event.id} className="flex gap-4 items-start relative pb-4 animate-in slide-in-from-left-4 fade-in" style={{animationDelay: `${i * 100}ms`}}>
                  {i !== cardHistory.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-800"></div>}

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 shadow-lg ${event.action === 'Earned' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-purple-950 border-purple-500 text-purple-400'}`}>
                    {event.action === 'Earned' ? <Award size={14}/> : <ArrowLeftRight size={14}/>}
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex-1 shadow-md hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{event.date}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${event.action === 'Earned' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'}`}>
                        {event.action}
                      </span>
                    </div>
                    <p className="font-black text-white text-base leading-tight mb-1">{event.cardName}</p>
                    <p className="text-sm text-slate-400 font-medium">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LockerView;