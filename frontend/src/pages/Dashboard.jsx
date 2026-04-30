import React from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { 
    Users, 
    TrendingUp, 
    Activity, 
    Database, 
    AlertCircle, 
    ChevronRight,
    LayoutDashboard,
    Stethoscope,
    ArrowUpRight
} from "lucide-react";
import { 
    Area, 
    AreaChart, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis, 
    CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const data = [
  { name: "Mon", scans: 45, alerts: 12 },
  { name: "Tue", scans: 52, alerts: 8 },
  { name: "Wed", scans: 48, alerts: 15 },
  { name: "Thu", scans: 61, alerts: 10 },
  { name: "Fri", scans: 55, alerts: 14 },
  { name: "Sat", scans: 32, alerts: 5 },
  { name: "Sun", scans: 38, alerts: 7 },
];

const stats = [
  { title: "Total Scans", value: "1,284", icon: Activity, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Critical Alerts", value: "42", icon: AlertCircle, trend: "-5%", color: "text-red-600", bg: "bg-red-50" },
  { title: "Active Pharmacists", value: "18", icon: Users, trend: "+2", color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Database Status", value: "Live", icon: Database, trend: "Stable", color: "text-zinc-600", bg: "bg-zinc-50" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="flex flex-col gap-6 w-full pb-8 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            Clinical Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time analytics and medication safety metrics for the facility.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/pharmacist')}
          className="gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Stethoscope className="w-4 h-4" />
          Launch Pharmacist Mode
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
                <span className="text-emerald-600 dark:text-emerald-400 mr-1 font-semibold">{stat.trend}</span>
                vs last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-full lg:col-span-4 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Interaction Trends</CardTitle>
            <CardDescription>Scan volume and detected clinical risks across all stations</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorScans)" />
                  <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Categories */}
        <Card className="col-span-full lg:col-span-3 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Risk Summary</CardTitle>
            <CardDescription>Most frequent clinical flags this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { class: "NSAIDs + Anticoagulants", count: 85, risk: "High" },
                { class: "Statins + Macrolides", count: 42, risk: "Moderate" },
                { class: "SSRIs + Tramadol", count: 28, risk: "Critical" },
              ].map((item, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700 group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.risk === 'Critical' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                    item.risk === 'High' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {item.count}
                  </div>
                  <div className="ml-3 space-y-0.5">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.class}</p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">{item.risk} SEVERITY</p>
                  </div>
                  <ChevronRight className="ml-auto w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs font-semibold text-zinc-500 h-9 rounded-lg group">
              View Detailed Analytics
              <ArrowUpRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
