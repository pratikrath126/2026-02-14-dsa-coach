import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, MessageSquare, Timer, Calendar, 
  BarChart3, ChevronRight, ExternalLink, StickyNote, Flame,
  BrainCircuit, Send, Play, Pause, RotateCcw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { striverData } from './data/striverA2Z';
import { getCoachResponse } from './lib/aiProvider';
import { supabase } from './lib/supabaseClient';

// --- Sub-components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 text-sm font-medium">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold dark:text-white">{value}</div>
  </div>
);

const FocusTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      alert("Time for a break!");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setSeconds(25 * 60); setIsActive(false); };
  
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Timer size={20} />
        <span className="font-semibold">Focus Mode</span>
      </div>
      <div className="text-4xl font-mono font-bold mb-6 text-center">{formatTime(seconds)}</div>
      <div className="flex justify-center gap-3">
        <button onClick={toggle} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={reset} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

const CoachChat = ({ completedCount }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Welcome to your DSA journey! I'm your AI Coach. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getCoachResponse(input, { 
      progress: Math.round((completedCount / 450) * 100),
      currentTopic: "Arrays" 
    });
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
        <BrainCircuit className="text-primary-500" size={20} />
        <span className="font-bold dark:text-white">AI Coach</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-primary-500 text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-slate-400">Coach is thinking...</div>}
      </div>
      <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about a problem..." 
          className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
        />
        <button onClick={handleSend} className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [completed, setCompleted] = useState({});
  const [notes, setNotes] = useState({});
  const [view, setView] = useState('dashboard'); // dashboard, sheet, analytics

  // Persistence (LocalStorage for now, Supabase hook would go here)
  useEffect(() => {
    const saved = localStorage.getItem('dsa_progress');
    if (saved) setCompleted(JSON.parse(saved));
    const savedNotes = localStorage.getItem('dsa_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  const toggleProblem = (id) => {
    const newCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(newCompleted);
    localStorage.setItem('dsa_progress', JSON.stringify(newCompleted));
  };

  const saveNote = (id, text) => {
    const newNotes = { ...notes, [id]: text };
    setNotes(newNotes);
    localStorage.setItem('dsa_notes', JSON.stringify(newNotes));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressData = [
    { name: 'Mon', problems: 4 },
    { name: 'Tue', problems: 7 },
    { name: 'Wed', problems: 5 },
    { name: 'Thu', problems: 12 },
    { name: 'Fri', problems: 8 },
    { name: 'Sat', problems: 15 },
    { name: 'Sun', problems: completedCount },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between mb-8">
        <div className="logo-container">
          <div className="logo-icon">D</div>
          <div className="logo-text">DSA<span>Coach</span></div>
        </div>
        <div className="flex gap-6">
          <button onClick={() => setView('dashboard')} className={`text-sm font-semibold ${view === 'dashboard' ? 'text-primary-600' : 'text-slate-500'}`}>Dashboard</button>
          <button onClick={() => setView('sheet')} className={`text-sm font-semibold ${view === 'sheet' ? 'text-primary-600' : 'text-slate-500'}`}>A2Z Sheet</button>
          <button onClick={() => setView('analytics')} className={`text-sm font-semibold ${view === 'analytics' ? 'text-primary-600' : 'text-slate-500'}`}>Analytics</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
            <Flame size={14} /> 7 DAY STREAK
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik" alt="avatar" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {view === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Progress" value={`${Math.round((completedCount/455)*100)}%`} icon={Trophy} color="bg-yellow-500" />
                <StatCard title="Problems Solved" value={completedCount} icon={CheckCircle2} color="bg-primary-500" />
                <StatCard title="Days Active" value="14" icon={Calendar} color="bg-indigo-500" />
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold dark:text-white">Recent Activity</h2>
                  <BarChart3 className="text-slate-400" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="problems" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorProb)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Ready for a Mock Interview?</h3>
                    <p className="text-indigo-700 dark:text-indigo-300 mb-6">Test your knowledge of Step 3: Arrays with a simulated interview.</p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                      Start Session <ChevronRight size={18} />
                    </button>
                  </div>
                  <img src="https://illustrations.popsy.co/blue/video-call.svg" className="w-48 hidden md:block" alt="mock" />
                </div>
              </div>
            </>
          )}

          {view === 'sheet' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold dark:text-white mb-8">Striver A2Z Sheet</h2>
              {striverData.map((step) => (
                <div key={step.step} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                    <span className="font-bold dark:text-white">Step {step.step}: {step.title}</span>
                    <span className="text-xs font-medium text-slate-500">{step.topics.length} topics</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {step.topics.map((topic, i) => (
                      <div key={i} className="p-4">
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{topic.name}</div>
                        <div className="space-y-2">
                          {topic.problems.map((prob, pi) => {
                            const id = `${step.step}-${i}-${pi}`;
                            return (
                              <div key={pi} className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="checkbox" 
                                    checked={!!completed[id]}
                                    onChange={() => toggleProblem(id)}
                                    className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" 
                                  />
                                  <span className={`text-sm ${completed[id] ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{prob.title}</span>
                                </div>
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a href={prob.link} target="_blank" className="text-slate-400 hover:text-primary-500"><ExternalLink size={16} /></a>
                                  <button onClick={() => {
                                    const note = prompt("Enter note for " + prob.title, notes[id] || "");
                                    if (note !== null) saveNote(id, note);
                                  }} className="text-slate-400 hover:text-indigo-500">
                                    <StickyNote size={16} fill={notes[id] ? 'currentColor' : 'none'} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'analytics' && (
            <div className="space-y-8">
               <h2 className="text-3xl font-bold dark:text-white">Progress Analytics</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold mb-4 dark:text-white">Topic Coverage</h3>
                    <div className="space-y-4">
                      {['Arrays', 'Strings', 'LinkedList', 'Trees'].map(topic => (
                        <div key={topic}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">{topic}</span>
                            <span className="font-bold dark:text-white">{topic === 'Arrays' ? '45%' : '0%'}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500" style={{width: topic === 'Arrays' ? '45%' : '0%'}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold mb-4 dark:text-white">Consistency</h3>
                    <div className="flex items-end gap-2 h-40">
                      {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-t-lg relative group" style={{height: `${h}%`}}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}m</div>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <FocusTimer />
          <CoachChat completedCount={completedCount} />
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white">
              <CheckCircle2 size={18} className="text-primary-500" /> Daily Goals
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Solve 3 Array problems', done: true },
                { label: 'Watch Recursion L3', done: false },
                { label: 'Revise Bubble Sort', done: false }
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${g.done ? 'bg-primary-500' : 'bg-slate-300'}`}></div>
                  <span className={g.done ? 'line-through opacity-50' : ''}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
