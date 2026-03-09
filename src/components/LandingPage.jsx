import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Lock, 
  User, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Globe,
  ChevronRight,
  Brain,
  Zap,
  CheckCircle2,
  X,
  Target,
  Terminal,
  Cpu,
  MousePointer2,
  Layout,
  Waves,
  Heart,
  Lightbulb,
  Compass
} from 'lucide-react';

// --- Sub-Components ---

const StarBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden pointer-events-none">
      {/* Animated Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            opacity: Math.random(),
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      {/* Nebula Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full" />
    </div>
  );
};

const ExplorationView = ({ onBack }) => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
          <Terminal size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">System Briefing v1.0</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
          MISSION <span className="text-cyan-400 font-serif italic">EXPLORATION</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
          Welcome, Judges. This page serves as your tactical overlay for the OrbitEd demo. 
          Discover how we bridge the neural gap between traditional education and student engagement.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* The Problem & Solution */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
              <Target className="text-red-400" /> THE OBJECTIVE
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">The Gap</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  While 99% of school administrators identify student engagement as the #1 predictor of success (Education Insights, 2026), the reality on the ground is a structural crisis. As of 2026, chronic absenteeism remains at 23%—nearly double pre-pandemic levels—and only 29% of high schoolers report being able to learn things they are actually interested in. This 'Disengagement Gap' isn't a student failure; it’s a failure of our tools to bridge the distance between a 19th-century classroom model and a 21st-century digital world.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-2">The Bridge</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Can't beat them? Join them. Students today are 'Digital Natives' who thrive in environments defined by rapid feedback loops and clear progression. The Bridge meets them at their home planet, translating rigid curriculum into a 'Mission-Based' framework. By turning assignments and opportunities into bounties, we leverage the same psychological mechanics that drive the $26 billion game-based learning market to foster a growth mindset, turning the daily grind of school into a rewarding journey toward career-ready mastery.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] group hover:bg-slate-800/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">ATLAS Intelligence</h3>
              <p className="text-slate-400 text-sm">The "Brain" of the platform. An AI-driven companion that analyzes student performance as well as scraped school data to provide curated learning paths and instant 1-on-1 tutoring.</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] group hover:bg-slate-800/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">Digital Locker</h3>
              <p className="text-slate-400 text-sm">Self-expression meets utility. Students manage their Pixel Avatars, Pets, and inventory earned through academic achievements.</p>
            </div>
          </div>
        </div>

        {/* Walkthrough Sidebar */}
        <div className="bg-gradient-to-b from-indigo-900/20 to-slate-900/40 backdrop-blur-xl border border-indigo-500/20 p-8 rounded-[2rem]">
          <h2 className="text-xl font-black text-white flex items-center gap-3 mb-8 uppercase tracking-tighter">
            <MousePointer2 className="text-yellow-400" /> JUDGE'S WALKTHROUGH
          </h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Launch Portal", desc: "Select 'Student Launchpad' and use the provided demo credentials." },
              { step: "02", title: "Check Missions", desc: "View the 'Mission Board' to see real-time synced gradebook tasks." },
              { step: "03", title: "Sync Atlas", desc: "Open the ATLAS Brain to experience AI-guided study sessions." },
              { step: "04", title: "Social Loop", desc: "Put in a request to trade your cards!" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-xs font-black text-indigo-500 mt-1 uppercase">{item.step}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={onBack}
            className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
          >
            Start Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-10 rounded-[3rem] text-center">
        <Cpu className="mx-auto mb-6 text-cyan-400 animate-pulse" size={40} />
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Technical Architecture</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8">
          Built on a real-time reactive stack, OrbitEd will use BrightData scrapers for tailoring ATLAS, 
          Large Language Models for the ATLAS tutoring engine, and a custom Pixel Engine 
          for avatar rendering.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {['React 18', 'Tailwind CSS', 'Gemini AI', 'Lucide Logic', 'BrightData'].map((tech) => (
            <span key={tech} className="px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NexusView = () => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-indigo-500/10 border-indigo-500/30 text-indigo-400">
          <Waves size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">The Nexus Point</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
          TEAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">TINYTIDE</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          We are TinyTide—a collective of creators, learners, and dreamers dedicated to making 
          the digital ocean of education easier to navigate for everyone.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Our Motivation</h3>
              <p className="text-slate-400 leading-relaxed">
                I’m a Montgomery native—born and raised. Like many of you, I love this city, but I’m clear-eyed about the crisis we’re in. Today, Montgomery ranks in the bottom 9% for safety in the U.S., with the projected cost of crime reaching $200 million last year alone.
                Growing up, I saw the educational disparity firsthand. This isn’t just a problem; it’s a hollowing out of our future. We no longer have the luxury of debating 'screen time' versus 'traditional' methods. To lower crime and boost our local economy, we must meet our youth where they actually are. OrbitEd is my dream for my hometown: a tool that transforms the digital world our kids already live in into a bridge toward safety, jobs, and a stronger Montgomery. It all starts with Education.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Student-First Design</h3>
              <p className="text-slate-400 leading-relaxed">
                OrbitEd was built by reverse-engineering the three psychological drivers of modern digital life: Agency, Progression, and Community. While traditional classroom tech provides feedback in weeks, we provide it in seconds—leveraging a 'High-Fidelity' feedback loop that research shows can increase content retention from 30% to nearly 90%. By replacing rigid compliance with a 'Mission-Based' framework, we eliminate the friction between a student’s digital identity and their academic reality, igniting a genuine love for learning through a proven RPG-style mastery loop.
              </p>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem]">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">Core Principles</h4>
            <ul className="space-y-4">
              {['Gamified Agency', 'Neural Tutoring', 'Community Vibe', 'Academic Transparency'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 font-bold">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Target, label: "MISSIONS", sub: "Assignments with weight." },
          { icon: Brain, label: "ATLAS", sub: "Neural study companion." },
          { icon: Layout, label: "LOCKER", sub: "Personal identity hub." },
          { icon: Compass, label: "ORBIT", sub: "Guided learning paths." }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-slate-950/40 border border-slate-900 rounded-3xl text-center hover:border-slate-700 transition-all">
            <item.icon className="mx-auto mb-4 text-slate-500" size={24} />
            <h5 className="text-sm font-black text-white tracking-widest uppercase mb-1">{item.label}</h5>
            <p className="text-[10px] text-slate-500 font-bold uppercase">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ onLoginSuccess }) => {
  const [view, setView] = useState('landing'); // 'landing', 'login-student', 'login-teacher', 'exploration', 'nexus'
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock Login Credentials
  const credentials = {
    student: { user: 'alex_j_vibes', pass: 'orbit123' },
    teacher: { user: 'prof_nova', pass: 'stellar456' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      const role = view.split('-')[1];
      if (formData.username === credentials[role].user && formData.password === credentials[role].pass) {
        setUserRole(role);
        // Alert App.jsx that login was successful so it can switch views!
        if (onLoginSuccess) {
          onLoginSuccess(role);
        }
      } else {
        setError('Invalid mission coordinates (username or password).');
      }
      setIsLoading(false);
    }, 1200);
  };

  const renderLanding = () => (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center animate-in fade-in duration-700">
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-indigo-500/10 border-indigo-500/30 text-indigo-300">
        <Sparkles size={16} />
        <span className="text-sm font-bold tracking-widest uppercase">The Future of Education is Orbital</span>
      </div>

      <h1 className="max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
        Bridge the Gap. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase tracking-tighter">
          Shoot for the Stars.
        </span>
      </h1>

      <p className="max-w-2xl mt-8 text-lg leading-relaxed text-slate-400 md:text-xl font-medium">
        OrbitEd is the next-gen neural bridge between educators and explorers. 
        Transforming classrooms into cosmic missions where every grade is a milestone 
        and every student is a star.
      </p>

      <div className="flex flex-col w-full gap-4 mt-12 sm:flex-row sm:justify-center">
        <button 
          onClick={() => setView('login-student')}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 font-black text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
        >
          <Rocket size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          STUDENT LAUNCHPAD
        </button>
        <button 
          onClick={() => setView('login-teacher')}
          className="flex items-center justify-center gap-3 px-8 py-4 font-black transition-all border text-slate-300 border-slate-700 bg-slate-900/50 backdrop-blur-md rounded-2xl hover:bg-slate-800 hover:border-slate-500"
        >
          <Users size={20} />
          TEACHER COMMAND
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-24 md:grid-cols-3 max-w-6xl">
        {[
          { icon: Brain, title: "Neural Sync", desc: "AI-driven insights that adapt to individual learning trajectories." },
          { icon: Zap, title: "Real-time Bounties", desc: "Instant feedback loops that reward effort with digital assets." },
          { icon: ShieldCheck, title: "Secure Orbit", desc: "Encrypted communications between teachers, students, and parents." }
        ].map((feat, i) => (
          <div key={i} className="p-8 text-left transition-all border bg-slate-900/40 backdrop-blur-xl border-slate-800 rounded-3xl hover:border-indigo-500/50 group">
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <feat.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogin = (role) => (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-8 border bg-slate-900/80 backdrop-blur-2xl border-slate-700 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setView('landing')}
          className="mb-8 text-sm font-bold transition-colors text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest"
        >
          <ArrowRight className="rotate-180" size={16} /> Back to Orbit
        </button>

        <div className="mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${role === 'student' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {role === 'student' ? <GraduationCap size={32} /> : <User size={32} />}
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{role} Portal</h2>
          <p className="mt-2 text-slate-400 font-medium">Enter your credentials to re-sync.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest uppercase text-slate-500 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={role === 'student' ? 'alex_j_vibes' : 'prof_nova'}
                className="w-full h-14 pl-12 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-bold"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest uppercase text-slate-500 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-bold"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
              <X size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full h-14 mt-4 font-black text-white rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest ${
              role === 'student' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Initiate Sync <ChevronRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Demo Credentials: <span className="text-slate-300 font-black">{credentials[role].user} / {credentials[role].pass}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <StarBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg overflow-hidden">
            {/* Planet - Rotates Counter-Clockwise */}
            <Globe size={24} className="z-10 animate-spin-slow-reverse" />

            {/* Orbiting Meteor Effect - Rotates Clockwise */}
            <div className="absolute inset-0 z-20 pointer-events-none animate-orbit-meteor">
              <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]">
              </div>
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-cyan-400 transition-colors">Orbit<span className="text-cyan-400 group-hover:text-white">Ed</span></span>
        </div>

        <div className="flex gap-8 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-slate-400">
          <button 
            onClick={() => setView('exploration')} 
            className={`transition-all hover:text-white hover:tracking-[0.3em] ${view === 'exploration' ? 'text-cyan-400' : ''}`}
          >
            EXPLORATION
          </button>
          <button 
            onClick={() => setView('nexus')} 
            className={`transition-all hover:text-white hover:tracking-[0.3em] ${view === 'nexus' ? 'text-indigo-400' : ''}`}
          >
            NEXUS
          </button>
        </div>

        <div className="w-24 md:w-32" /> {/* Spacer to keep nav balanced */}
      </nav>

      {/* Dynamic Views */}
      {view === 'landing' && renderLanding()}
      {view === 'exploration' && <ExplorationView onBack={() => setView('login-student')} />}
      {view === 'nexus' && <NexusView />}
      {view.startsWith('login') && renderLogin(view.split('-')[1])}

      <footer className="relative z-10 py-12 text-center border-t border-slate-900 bg-slate-950/50">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-600">
          &copy; 2026. OrbitEd by TinyTide. All systems operational. Prepare for liftoff.
        </p>
      </footer>

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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
