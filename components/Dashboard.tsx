
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, Server, CheckCircle, CloudIcon, Sparkles, ShieldCheck } from 'lucide-react';

const generateInitialData = () => {
  const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
  return times.map(t => ({ time: t, load: Math.floor(Math.random() * 40) + 20 }));
};

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState(generateInitialData());
  const [latency, setLatency] = useState(0.82);
  const [uptime, setUptime] = useState(99.99);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        const currentLoad = newData[lastIdx].load;
        const change = Math.floor(Math.random() * 9) - 4;
        newData[lastIdx] = { ...newData[lastIdx], load: Math.max(10, Math.min(95, currentLoad + change)) };
        return newData;
      });

      setLatency(prev => {
        const change = (Math.random() * 0.08) - 0.04;
        return parseFloat(Math.max(0.45, Math.min(1.2, prev + change)).toFixed(3));
      });
    }, 1500);

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
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Voxy Ai Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2 font-bold uppercase tracking-tighter">
            <CheckCircle size={14} className="text-emerald-500" />
            Core System Status: <span className="text-emerald-600">Secure & Online</span>
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-5 rounded-[2rem] flex items-center gap-5 border shadow-xl bg-white dark:bg-navy-900 border-slate-100 dark:border-slate-800">
              <div className="relative">
                <div className="w-4 h-4 rounded-full animate-ping absolute inset-0 opacity-20 bg-emerald-500"></div>
                <div className="w-4 h-4 rounded-full relative border-2 border-white bg-emerald-500"></div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Neural Encryption</p>
                <p className="text-sm font-black uppercase text-emerald-600">
                  AES-256 ACTIVE
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Latency', value: `${latency}ms`, icon: Cpu, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'System Guard', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Gobel SLA', value: `${uptime}%`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Cloud Status', value: 'VERIFIED', icon: CloudIcon, color: 'text-sky-500', bg: 'bg-sky-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-navy-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative cursor-default">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 ${stat.bg} dark:bg-slate-800 rounded-[1.5rem] group-hover:scale-110 transition-transform`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <div className="text-[10px] font-black text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 relative z-10 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-navy-900 p-10 rounded-[3rem] border border-slate-50 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                  <Activity size={18} className="text-sky-500" />
                  System Neural Stream
                </h3>
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
                    <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} fontWeights="700" />
                    <YAxis stroke="#cbd5e1" fontSize={10} fontWeights="700" />
                    <Tooltip contentStyle={{ borderRadius: '24px' }} />
                    <Area type="monotone" dataKey="load" stroke="#0ea5e9" fillOpacity={1} fill="url(#voxyBlue)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        <div className="bg-white dark:bg-navy-900 p-10 rounded-[3rem] flex flex-col border border-slate-50 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest flex items-center gap-3">
            <Server size={18} className="text-sky-500" /> Nodes Status
          </h3>
          <div className="space-y-4 flex-1">
            {[
              { name: 'Core Processor', status: 'Optimal', color: 'bg-emerald-400' },
              { name: 'Neural Bridge', status: 'Active', color: 'bg-sky-400' },
              { name: 'Encryption Layer', status: 'Secure', color: 'bg-indigo-400' },
              { name: 'Auth Module', status: 'Linked', color: 'bg-purple-400' }
            ].map((node, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[1.75rem] flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${node.color} animate-pulse`}></div>
                  <p className="text-[11px] font-black text-slate-800 dark:text-white tracking-tight">{node.name}</p>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{node.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
