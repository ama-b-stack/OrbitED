import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Brain, Coins, TrendingUp, Activity, MessageSquare, Plus, MessageSquarePlus, Archive, Sparkles, Send, Calendar, CheckCircle, Clock, ChevronRight, Target, X, Timer, Network, BookOpen, Lightbulb, Mic, MicOff, Settings2 } from 'lucide-react';
import { StreamableMarkdown } from '../Shared/UIComponents.jsx';
import { userContext, atlasActionItems, atlasSuggestions, atlasConversations } from '../../data/mockData.js';

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

// 1. ADD studentSettings TO THE PROPS HERE
const AtlasView = ({ onBack, coins, awardCoins, setQuests, schoolContext, studentSettings }) => {
  const [actionItems, setActionItems] = useState(atlasActionItems);
  const [suggestions, setSuggestions] = useState(atlasSuggestions);

  const [showBountyModal, setShowBountyModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [bountyTab, setBountyTab] = useState('reasoning'); 

  const [isListening, setIsListening] = useState(false);
  const [transcriptBuffer, setTranscriptBuffer] = useState("");
  const [liveQuestion, setLiveQuestion] = useState(null);
  const [showDemoTools, setShowDemoTools] = useState(false);
  const [isGeneratingCheck, setIsGeneratingCheck] = useState(false);

  const [conversations, setConversations] = useState(atlasConversations);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let recognition = null;
    if (isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
               finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
             setTranscriptBuffer(prev => {
                const newBuffer = prev + finalTranscript;
                if (newBuffer.split(' ').length > 40) {
                   generateLiveQuestion(newBuffer);
                   return ""; 
                }
                return newBuffer;
             });
          }
        };
        recognition.onend = () => {
           if (isListening) recognition.start(); 
        };
        try {
          recognition.start();
        } catch(e) { console.error("Mic error", e); }
      } else {
         alert("Microphone API not supported in this iframe/browser. Use the Hackathon Demo Tools to simulate!");
         setIsListening(false);
      }
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  const generateLiveQuestion = async (transcript) => {
      setIsGeneratingCheck(true);
      try {
         const payload = {
            contents: [{ role: "user", parts: [{ text: `Based on the following live lecture transcript, act as a teacher and generate a single, highly relevant 4-option multiple-choice question to test the student's understanding of what was just said. You must format your response EXACTLY as a raw JSON object matching this schema: {"question": "Question text here?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0}\n\nTranscript: ${transcript}` }] }],
            generationConfig: { responseMimeType: "application/json" }
         };

         if (!apiKey) {
            setTimeout(() => {
               setLiveQuestion({
                  question: "Based on the simulated lecture, what algorithm is considered to have O(N^2) efficiency?",
                  options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Binary Search"],
                  correctIndex: 1
               });
               setIsGeneratingCheck(false);
            }, 1500);
            return;
         }

         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
         });

         if(response.ok) {
             const data = await response.json();
             const jsonText = data.candidates[0].content.parts[0].text;
             const qData = JSON.parse(jsonText);
             setLiveQuestion(qData);
         } else {
             throw new Error("Failed to generate check");
         }
      } catch(e) {
         console.error("Quiz Gen Error", e);
         setLiveQuestion({
             question: "What is the primary function of an AND gate?",
             options: ["Outputs True if ANY input is True", "Outputs True only if ALL inputs are True", "Inverts the input signal", "Outputs False always"],
             correctIndex: 1
         });
      } finally {
         setIsGeneratingCheck(false);
      }
  };

  const handleLiveAnswer = (index) => {
      if (index === liveQuestion.correctIndex) {
         awardCoins(150, "Live Lecture Check Passed!");
      } else {
         setSuggestions(prev => [{
            id: Date.now(),
            title: "Review Recent Lecture",
            reason: "ATLAS noticed you missed the recent pop-up check during the live lecture. It's recommended to review the material.",
            actionText: "Open Transcript",
            actionType: "textbook"
          }, ...prev]);
      }
      setLiveQuestion(null);
  };

  const handleDismissSuggestion = (id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations.find(c => !c.isArchived) || conversations[0];
  const activeMessages = activeChat?.messages || [];

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [activeMessages.length, isTyping]);

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: `Study Session ${conversations.length + 1}`,
      isRequired: false,
      isArchived: false,
      interactionCount: 0,
      messages: [{ role: 'model', text: "ATLAS standing by. What topic would you like to focus on today, Alex?", isNew: true }]
    };
    setConversations([newChat, ...conversations]);
    setActiveChatId(newId);
  };

  const handleOpenChat = (chatId) => { if (chatId) setActiveChatId(chatId); };

  const handleArchiveChat = (e, chatId) => {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, isArchived: true } : c);
      if (chatId === activeChatId) {
        const nextChat = updated.find(c => !c.isArchived) || updated[0];
        if (nextChat) setActiveChatId(nextChat.id);
      }
      return updated;
    });
  };

  const handleActionClick = (item) => {
    if (item.type === 'tutoring') { 
      handleOpenChat(item.linkedChatId); 
    } 
    else if (item.type === 'assignment' || item.type === 'knowledge_check') {
      const newId = Date.now();
      const newChat = { 
        id: newId, 
        title: item.type === 'assignment' ? `Lab Help: ${item.title}` : `Knowledge Check: ${item.title}`, 
        isRequired: false, 
        isArchived: false, 
        linkedItemId: item.id, // Linking ensures coins are granted AFTER meaningful interactions
        interactionCount: 0,
        messages: [{ 
            role: 'model', 
            text: item.type === 'assignment' 
              ? `ATLAS standing by. I have pulled up your progress on the ${item.title}. Where are you getting stuck?`
              : `Let's see what you remember from ${item.title}. First question: Can you explain how logic gate combinations change the output of a standard circuit?`, 
            isNew: true 
        }] 
      };
      setConversations(prev => [newChat, ...prev]);
      setActiveChatId(newId);

      // Only schedule the hint suggestion for Knowledge Checks
      if(item.type === 'knowledge_check') {
        setTimeout(() => {
          setSuggestions(prev => [{ 
            id: Date.now(), 
            title: "Re-read Chapter 5", 
            reason: "ATLAS detected hesitations regarding logic gate combinations during the recent knowledge check. Re-reading pages 112-145 is highly recommended.", 
            actionText: "Open Digital Textbook", 
            actionType: "textbook" 
          }, ...prev]);
        }, 5000);
      }
    } 
  };

  const handleCloseModal = (callback) => {
    setIsClosingModal(true);
    setTimeout(() => {
      setShowBountyModal(false);
      setIsClosingModal(false);
      if (callback) callback();
    }, 550); 
  };

  const handleSuggestionAction = (sugg) => {
    if (sugg.actionType === 'review') {
      const newId = Date.now();
      const newChat = { 
        id: newId, 
        title: `Quick Review: ${sugg.title}`, 
        isRequired: false, 
        isArchived: false, 
        interactionCount: 0,
        messages: [{ role: 'model', text: "Let's review Truth Tables. We'll start with the AND gate. Can you tell me what happens when Input A is **True** and Input B is **False**?", isNew: true }] 
      };
      setConversations(prev => [newChat, ...prev]);
      setActiveChatId(newId);
      if (sugg.coins) awardCoins(sugg.coins, "Review Initialized");
      setSuggestions(prev => prev.filter(s => s.id !== sugg.id));
    } 
    else if (sugg.actionType === 'bounty') { 
      setBountyTab('reasoning');
      setShowBountyModal(true); 
    } 
    else if (sugg.actionType === 'textbook') {
      alert("Opening External Resource: Digital Textbook Viewer...");
      setSuggestions(prev => prev.filter(s => s.id !== sugg.id));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const userText = input.trim();
    const currentInteractionCount = (activeChat.interactionCount || 0) + 1;

    setConversations(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, interactionCount: currentInteractionCount, messages: [...c.messages, { role: 'user', text: userText, isNew: false }] } : c 
    ));
    setInput('');
    setIsTyping(true);

    // 2. UPDATE THIS VARIABLE TO INJECT THE STUDENT SETTINGS
    const systemInstruction = `You are ATLAS (Adaptive Teaching & Learning Assistance System), a personalized AI tutor for the student ${userContext.name}. Your goal is to guide them through logic assignments. Use markdown for bold and LaTeX for math formulas like $A \\land B$ or block formulas with $$. Be encouraging but never just give the answer. 
    Context on Student's Environment: ${schoolContext.details}
    Custom AI Instructions based on District Data: ${schoolContext.atlasInstructions}

    CRITICAL STUDENT LEARNING PREFERENCES:
    - Learning Style: ${studentSettings?.learningStyle || 'Standard'}. Heavily adapt your explanations to match this specific style.
    - Shy Learner: ${studentSettings?.isShy ? 'YES. The student is easily overwhelmed. Be extremely gentle, validate their efforts enthusiastically, use a very warm tone, and avoid harsh corrections.' : 'NO.'}`;

    try {
      const recentMessages = activeMessages.slice(-10);
      const apiHistory = recentMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const delays = [1000, 2000, 4000];
      let response;

      if (!apiKey) throw new Error("No API Key");

      for (let i = 0; i < delays.length; i++) {
        try {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [...apiHistory, { role: "user", parts: [{ text: userText }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { maxOutputTokens: 600 }
            })
          });
          if (response.ok) break; 
          await new Promise(r => setTimeout(r, delays[i]));
        } catch (fetchError) {
          if (i === delays.length - 1) throw fetchError;
          await new Promise(r => setTimeout(r, delays[i]));
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication error.";
        setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', text: aiText, isNew: true }] } : c ));
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error(err);
      const fallbackResponse = "ATLAS processing offline... (Simulation mode).\n\nIn logical notation, we represent this as $A \\land B$. Since $T \\land F = F$, you've got the core concept down.\n\nNow, let's evaluate: if $P$ is **True** and $Q$ is **False**, what is the value of:\n\n$$(P \\land Q) \\lor (\\neg Q)$$\n\nTell me what $(P \\land Q)$ evaluates to first.";
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', text: fallbackResponse, isNew: true }] } : c ));
    } finally {
      setIsTyping(false);

      // Evaluate Assignment/Knowledge Check Completion (Requires 3 chat interactions)
      if (activeChat.linkedItemId && currentInteractionCount === 3) {
         const linkedItem = actionItems.find(i => i.id === activeChat.linkedItemId);
         if (linkedItem && linkedItem.coins) {
             awardCoins(linkedItem.coins, `${linkedItem.title} Progress Validated!`);
             setActionItems(prev => prev.filter(i => i.id !== activeChat.linkedItemId));
         }
      }
    }
  };

  return (
    <div className="h-full text-slate-200 p-4 md:p-6 selection:bg-indigo-500/30 flex flex-col relative transition-all duration-500 bg-transparent">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* HACKATHON DEMO TOOLS (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showDemoTools && (
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl mb-4 animate-in fade-in slide-in-from-bottom-4 w-64 space-y-3">
             <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2"><Zap size={14}/> Demo Actions</h3>
             <button 
               onClick={() => {
                 generateLiveQuestion("So when we look at algorithmic efficiency, specifically Big O notation, O of N squared represents an algorithm whose performance is directly proportional to the square of the size of the input data set. This is common with algorithms that involve nested iterations over the data set, like Bubble Sort. It's generally considered poor efficiency for large data sets compared to O of N log N algorithms like Merge Sort.");
                 setShowDemoTools(false);
               }}
               className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg border border-slate-600 text-left flex justify-between items-center transition-colors"
             >
               Force Live Knowledge Check <Timer size={12}/>
             </button>
          </div>
        )}
        <button onClick={() => setShowDemoTools(!showDemoTools)} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 border-2 border-indigo-400/50" title="Toggle Hackathon Demo Tools">
          <Settings2 size={20} />
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 w-full flex-1 flex flex-col space-y-4 md:space-y-6">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 p-4 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.05)] shrink-0 transition-all duration-300">
          <div className="w-full md:w-auto">
             <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-1 transition-all hover:-translate-x-1 mb-2 md:mb-0">
               <ChevronLeft size={18}/> Dashboard
             </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center bg-slate-950 rounded-2xl border border-indigo-500/50 shadow-inner">
               <Brain className="text-indigo-400 animate-pulse" size={24} />
               <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">ATLAS</h1>
              <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-bold">Adaptive Teaching & Learning Assistance System</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {/* LIVE CLASS SYNC TOGGLE */}
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                isListening ? 'bg-red-950/30 border border-red-500/50 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {isListening ? <Mic size={14} /> : <MicOff size={14} />}
              {isListening ? "Class Audio Synced" : "Sync Class Audio"}
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Coins</span>
              <span className="text-xs text-yellow-400 font-black flex items-center gap-1"><Coins size={12}/> {coins}</span>
            </div>
            <div className="w-px h-8 bg-slate-800 mx-1"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Current Grade</span>
              <span className="text-xs text-emerald-400 font-black flex items-center gap-1"><TrendingUp size={12}/> {userContext.overallGrade}</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Focus Streak</span>
              <span className="text-xs text-cyan-400 font-black flex items-center gap-1"><Activity size={12}/> {userContext.streak}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-1 min-h-0">
          {/* Chat History */}
          <div className="lg:col-span-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-full shadow-lg transition-all duration-300 hover:border-slate-700">
            <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80 shrink-0">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} className="text-cyan-400"/> My Sessions</h2>
              <button onClick={handleNewChat} className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg active:scale-95" title="New Study Session">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {conversations.filter(c => !c.isArchived).map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 ease-in-out border relative group ${
                    activeChatId === chat.id 
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-100 shadow-[0_0_15px_rgba(79,70,229,0.15)] scale-[1.02]' 
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate flex items-center gap-2 pr-6">
                      <MessageSquarePlus size={12} className={activeChatId === chat.id ? "text-indigo-400" : "text-slate-600"}/> 
                      {chat.title}
                    </p>
                    {!chat.isRequired && (
                      <div
                        onClick={(e) => handleArchiveChat(e, chat.id)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-800 rounded-md text-slate-500 hover:text-red-400 transition-all duration-200"
                        title="Archive Session"
                      >
                        <Archive size={12} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden h-[500px] lg:h-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <div className="p-5 border-b border-slate-800/50 flex justify-between items-center shrink-0 bg-slate-900/50">
              <h2 className="text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2"><Sparkles size={16}/> ATLAS Terminal</h2>
              <div className="flex items-center gap-2">
                 {isGeneratingCheck && (
                   <span className="text-[10px] bg-yellow-950/50 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded animate-pulse flex items-center gap-1">
                     <Brain size={10}/> Analyzing Lecture...
                   </span>
                 )}
                 <p className="text-[10px] bg-indigo-950/30 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded transition-all">
                   Active: {activeChat?.title || 'None'}
                 </p>
              </div>
            </div>

            <div key={activeChatId} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {activeMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out`}>
                  <div className={`max-w-[90%] rounded-2xl p-4 text-sm shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/80'
                  }`}>
                    {msg.role === 'model' && <Brain size={12} className="text-indigo-400 mb-2 opacity-80" />}

                    {msg.role === 'model' ? (
                      <StreamableMarkdown text={msg.text} isNew={msg.isNew} onUpdate={() => messagesEndRef.current?.scrollIntoView({behavior: "auto"})} />
                    ) : (
                      <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    )}

                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-sm p-4 border border-slate-700 flex gap-1.5 items-center shadow-lg">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSendMessage} className="relative flex items-center group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ATLAS for homework help or logic explanations..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-full py-3.5 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all duration-300 shadow-inner group-hover:border-slate-600"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out active:scale-90 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Stacked Actions & Suggestions */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 h-[600px] lg:h-full min-h-0">

            {/* Action Board */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-1/2 shadow-lg transition-all duration-300 hover:border-slate-700">
              <div className="p-4 border-b border-slate-800/50 shrink-0 flex justify-between items-center bg-slate-900/50">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={16} className="text-blue-400"/> Action Board</h2>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-md font-bold">{actionItems.length} Pending</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {actionItems.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 opacity-50">
                     <CheckCircle size={32} />
                     <p className="text-xs font-bold uppercase tracking-widest">Board Clear!</p>
                   </div>
                ) : (
                  actionItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                    <div key={item.id} className={`border rounded-2xl p-4 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      item.type === 'tutoring' 
                        ? 'bg-indigo-950/20 border-indigo-900/50 hover:bg-indigo-950/30' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}>
                      {item.type === 'tutoring' && <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>}

                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${item.type === 'tutoring' ? 'text-indigo-400' : 'text-cyan-400'}`}>
                          <IconComponent size={12} /> 
                          {item.type === 'tutoring' ? 'Required Tutoring' : item.type === 'knowledge_check' ? 'Knowledge Check' : 'Assignment'}
                        </p>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black border flex items-center gap-1 ${
                          item.type === 'tutoring' ? 'bg-red-950/30 text-red-400 border-red-900' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          <Clock size={10} /> {item.due}
                        </span>
                      </div>
                      <p className="text-sm font-black text-white leading-tight mb-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400 leading-snug mb-4 flex-1">{item.description}</p>

                      {/* Displaying dynamic coins! */}
                      {item.coins && <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400 mb-3"><Coins size={12}/> Reward: {item.coins} Coins (Validated After Chat)</div>}

                      <button 
                        onClick={() => handleActionClick(item)} 
                        className={`mt-auto w-full text-white text-[11px] font-black py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-1.5 ${
                          item.type === 'tutoring' ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]' :
                          item.type === 'assignment' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]' :
                          'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        }`}
                      >
                        {item.actionLabel} <ChevronRight size={14} />
                      </button>
                    </div>
                  );})
                )}
              </div>
            </div>

            {/* Suggestion Board */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden h-1/2 shadow-lg transition-all duration-300 hover:border-slate-700">
              <div className="p-4 border-b border-slate-800/50 shrink-0 bg-slate-900/50">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={16} className="text-emerald-400"/> Suggested Actions</h2>
                <p className="text-[10px] text-slate-500 mt-1">Tailored for you based on recent performance.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {suggestions.map(sugg => (
                    <div key={sugg.id} className="bg-slate-950 border border-slate-700 rounded-2xl p-4 shadow-lg relative overflow-hidden group transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-slate-600 flex flex-col">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500"></div>

                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded-full"><Sparkles size={10}/> ATLAS Insight</span>
                        <button onClick={() => handleDismissSuggestion(sugg.id)} className="text-slate-500 hover:text-white transition-colors p-1" title="Dismiss"><X size={12}/></button>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-2 leading-snug">{sugg.title}</h3>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 mb-4 shadow-inner flex-1">
                        <p className="text-xs text-slate-300 leading-relaxed">"{sugg.reason}"</p>
                      </div>

                      {sugg.potentialCoins && <div className="text-[10px] font-bold text-yellow-400 mb-3 flex items-center gap-1"><Coins size={12}/> Potential Reward: {sugg.potentialCoins}</div>}
                      {sugg.coins && <div className="text-[10px] font-bold text-yellow-400 mb-3 flex items-center gap-1"><Coins size={12}/> Reward: +{sugg.coins} Coins</div>}

                      <button onClick={() => handleSuggestionAction(sugg)} className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-black py-2.5 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 mt-auto">
                        {sugg.actionText} <ChevronRight size={14}/>
                      </button>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOUNTY ANALYSIS MODAL */}
      {showBountyModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosingModal ? 'pointer-events-none' : ''}`}>
          <div 
            className={`absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity duration-500 ${isClosingModal ? 'opacity-0 delay-[200ms]' : 'opacity-100 animate-in fade-in duration-300'}`}
            onClick={() => handleCloseModal()}
          />

          <div className={`relative z-10 bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col ${isClosingModal ? 'animate-slide-bounce-out' : 'animate-slide-bounce'}`}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Network size={16}/> S-Rank Bounty</h2>
              <button onClick={() => handleCloseModal()} className="text-slate-500 hover:text-white transition-colors p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full"><X size={18} /></button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-950/50">
               <button 
                 onClick={() => setBountyTab('reasoning')} 
                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${bountyTab === 'reasoning' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-950/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 ATLAS Reasoning
               </button>
               <button 
                 onClick={() => setBountyTab('details')} 
                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${bountyTab === 'details' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Bounty Details
               </button>
            </div>

            <div className="p-8 space-y-6">
              {bountyTab === 'reasoning' ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-inner"><Brain className="text-indigo-400" size={24} /></div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Proficiency Analysis</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Student <span className="text-cyan-400 font-bold">@alex_j_vibes</span> has demonstrated a consistent 88% success rate in algorithmic sequencing tasks over the past 14 days.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-inner"><Lightbulb className="text-yellow-400" size={24} /></div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Opportunity Mapping</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">The <span className="text-orange-300 font-bold">Library Shelf Organization</span> bounty requires intermediate knowledge of sorting algorithms (specifically QuickSort or MergeSort). Student profile indicates readiness.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl shadow-inner"><Target className="text-emerald-400" size={24} /></div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-400 mb-1">Conclusion</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">Probability of completion is high. Pushing recommendation to student interface to encourage skill stretching.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><BookOpen size={12}/> What to do</h3>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">Sort the virtual library database using an optimized QuickSort or MergeSort algorithm, reducing search latency by 15%.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Network size={12}/> Where</h3>
                      <p className="text-sm text-slate-200 font-medium">Digital Library Terminal (Server #4)</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> When</h3>
                      <p className="text-sm text-slate-200 font-medium">Due Friday, 11:59 PM (Flexible Task)</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-950/30 to-amber-950/30 p-5 rounded-xl border border-yellow-900/50 flex flex-col items-center justify-center shadow-lg mt-2">
                    <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Possible Reward</h3>
                    <span className="text-2xl font-black text-yellow-400 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"><Coins size={24}/> 500 Coins</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                 <button onClick={() => handleCloseModal()} className="flex-1 bg-slate-800 text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-700 transition-colors text-xs border border-slate-700 active:scale-95">Decline for Now</button>
                 <button 
                   onClick={() => handleCloseModal(() => { 
                      // id 4 belongs to Library Shelf Organization in mockData.js!
                      setQuests(prev => prev.map(q => q.id === 4 ? { ...q, status: "pending", type: "s-rank" } : q));
                      handleDismissSuggestion(102); 
                   })} 
                   className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95 text-xs"
                 >
                   Accept Challenge
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE LECTURE KNOWLEDGE CHECK MODAL (Kept intact) */}
      {liveQuestion && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-slide-bounce relative">
              <div className="h-1 w-full bg-slate-800 absolute top-0 left-0">
                 <div className="h-full bg-emerald-500 w-full animate-[shrink_15s_linear_forwards]"></div>
              </div>
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-emerald-950/20">
                <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Timer className="animate-pulse" size={16}/> Live Knowledge Check</h2>
              </div>
              <div className="p-8 space-y-6">
                 <p className="text-lg font-bold text-white leading-relaxed">{liveQuestion.question}</p>
                 <div className="space-y-3">
                   {liveQuestion.options.map((opt, idx) => (
                      <button 
                         key={idx}
                         onClick={() => handleLiveAnswer(idx)}
                         className="w-full text-left bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 p-4 rounded-xl text-slate-200 transition-all font-medium"
                      >
                         <span className="font-black text-emerald-500 mr-2">{['A','B','C','D'][idx]}.</span> {opt}
                      </button>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AtlasView;
