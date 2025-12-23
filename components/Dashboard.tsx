
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, Server, CheckCircle, CloudIcon, Sparkles, Key, ShieldCheck } from 'lucide-react';

const generateInitialData = () => {
  const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
  return times.map(t => ({ time: t, load: Math.floor(Math.random() * 40) + 20 }));
};

const Dashboard: React.FC = () => {
  const isKeyLinked = localStorage.getItem('voxy_neural_link_trusted') === 'true';
  const [chartData, setChartData] = useState(generateInitialData());
  const [latency, setLatency] = useState(0.82);
  const [uptime, setUptime] = useState(99.99);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update chart data randomly with more frequent small jumps
      setChartData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        const currentLoad = newData[lastIdx].load;
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        newData[lastIdx] = { ...newData[lastIdx], load: Math.max(10, Math.min(95, currentLoad + change)) };
        return newData;
      });

      // Fluctuate Latency
      setLatency(prev => {
        const change = (Math.random() * 0.08) - 0.04;
        return parseFloat(Math.max(0.45, Math.min(1.2, prev + change)).toFixed(3));
      });

      // Stability check simulation
      if (Math.random() > 0.99) {
        setUptime(99.98);
        setTimeout(() => setUptime(99.99), 1000);
      }
    }, 1500); // More frequent updates for real-time feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-smooth">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-sky-500/10 text-sky-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100 flex items-center gap-2">
                <Sparkles size={12} className="animate-pulse" /> Gobel Developer Ecosystem
             </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Voxy Ai Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2 font-bold uppercase tracking-tighter">
            <CheckCircle size={14} className="text-emerald-500" />
            Core System Status: <span className="text-emerald-600">Active & Syncing</span>
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className={`px-8 py-5 rounded-[2rem] flex items-center gap-5 border shadow-xl transition-all ${
             isKeyLinked ? 'bg-white border-emerald-50 shadow-emerald-100/20' : 'bg-red-50 border-red-100 shadow-red-100/20'
           }`}>
              <div className="relative">
                <div className={`w-4 h-4 rounded-full animate-ping absolute inset-0 opacity-20 ${isKeyLinked ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div className={`w-4 h-4 rounded-full relative border-2 border-white ${isKeyLinked ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Neural Link Integrity</p>
                <p className={`text-sm font-black uppercase ${isKeyLinked ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isKeyLinked ? 'SECURE & VERIFIED' : 'ACTION REQUIRED'}
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Latency', value: `${latency}ms`, icon: Cpu, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Key Stability', value: isKeyLinked ? '100%' : '0%', icon: Key, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Gobel SLA Uptime', value: `${uptime}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cloud Verification', value: 'PASSED', icon: CloudIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-sky-100 transition-all group overflow-hidden relative cursor-default active:scale-[0.98]">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 ${stat.bg} rounded-[1.5rem] group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <div className="text-[10px] font-black text-slate-300 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1 relative z-10 tracking-tight">{stat.value}</p>
            <div className="absolute -bottom-4 -right-4 text-slate-50/50 transform group-hover:scale-110 transition-transform">
               <stat.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Activity size={18} className="text-sky-500" />
                  </div>
                  System Neural Load (Real-time Stream)
                </h3>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Monitoring</span>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="voxyBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeights="700" />
                    <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} fontWeights="700" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="load" stroke="#0ea5e9" fillOpacity={1} fill="url(#voxyBlue)" strokeWidth={4} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10 rotate-6 group-hover:rotate-0 transition-transform">
                        <ShieldCheck size={40} className="text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black tracking-tight">Voxy Ai Neural Lock</h4>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Advanced cryptographic tunneling active</p>
                    </div>
                </div>
                <button className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 active:scale-95 relative z-10">
                    System Refresh
                </button>
            </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] flex flex-col border border-slate-50 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
            <Server size={18} className="text-sky-500" /> Active Neural Nodes
          </h3>
          <div className="space-y-4 flex-1">
            {[
              { name: 'Core Processor', status: 'Optimal', delay: '4ms', color: 'bg-emerald-400' },
              { name: 'Neural Link', status: 'Stable', delay: '62ms', color: 'bg-sky-400' },
              { name: 'Encryption Layer', status: 'Active', delay: '1ms', color: 'bg-indigo-400' },
              { name: 'Auth Bridge', status: 'Secure', delay: '12ms', color: 'bg-purple-400' }
            ].map((node, i) => (
              <div key={i} className="bg-slate-50 p-5 rounded-[1.75rem] flex items-center justify-between group hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${node.color} shadow-lg shadow-current opacity-70 animate-pulse`}></div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800 tracking-tight">{node.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{node.status}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300">Live</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Lead Developer</p>
             <h5 className="text-[11px] font-black text-slate-900 mt-1 uppercase">Gobel Developer</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
