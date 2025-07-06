import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import { Heart, Users, Award, TrendingUp, DollarSign, Target, Calendar, Gift } from 'lucide-react';

export const Dashboard = () => {
  const colors = [
    '#60a5fa', // Blue
    '#34d399', // Green
    '#a78bfa', // Purple
    '#fbbf24', // Yellow
    '#f472b6', // Pink
    '#3b82f6', // Indigo
  ];

  const statsData = [
    { title: 'Total Donations', value: 125000, icon: DollarSign, color: 'from-blue-500 to-purple-600', prefix: '$' },
    { title: 'Active Donors', value: 1250, icon: Users, color: 'from-green-500 to-blue-500' },
    { title: 'Sponsors', value: 45, icon: Award, color: 'from-purple-500 to-pink-500' },
    { title: 'Campaign Goal', value: 85, icon: Target, color: 'from-orange-500 to-red-500', suffix: '%' },
  ];

  const donationData = [
    { month: 'Jan', donations: 12000, donors: 85 },
    { month: 'Feb', donations: 19000, donors: 95 },
    { month: 'Mar', donations: 15000, donors: 78 },
    { month: 'Apr', donations: 22000, donors: 112 },
    { month: 'May', donations: 18000, donors: 89 },
    { month: 'Jun', donations: 25000, donors: 125 },
  ];

  const sourceData = [
    { name: 'Online', value: 45, color: '#60a5fa' },
    { name: 'Events', value: 30, color: '#34d399' },
    { name: 'Corporate', value: 20, color: '#a78bfa' },
    { name: 'Other', value: 5, color: '#fbbf24' },
  ];

  const recentActivities = [
    { id: 1, type: 'donation', donor: 'John Smith', amount: 500, time: '2 hours ago' },
    { id: 2, type: 'sponsor', sponsor: 'Tech Corp', amount: 5000, time: '4 hours ago' },
    { id: 3, type: 'donation', donor: 'Maria Garcia', amount: 250, time: '6 hours ago' },
    { id: 4, type: 'donation', donor: 'Anonymous', amount: 1000, time: '8 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome to Noble Cause Tracker
        </h1>
        <p className="text-gray-300 text-lg">Transforming generosity into impact through intelligent tracking</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.title} delay={index * 0.1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">{stat.title}</p>
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-2xl font-bold text-white"
                  />
                </div>
                <motion.div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} glow`}
                  animate={{ rotateY: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <GlassCard title="Donation Trends" delay={0.2}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Donation Sources */}
        <GlassCard title="Donation Sources" delay={0.3}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Monthly Performance */}
      <GlassCard title="Monthly Performance" delay={0.4}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  color: 'white'
                }}
              />
              <Bar dataKey="donations" fill="url(#donationGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Recent Activities */}
      <GlassCard title="Recent Activities" delay={0.5}>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-3 glass rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${activity.type === 'donation' ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                  {activity.type === 'donation' ? 
                    <Heart className="h-4 w-4 text-white" /> : 
                    <Award className="h-4 w-4 text-white" />
                  }
                </div>
                <div>
                  <p className="text-white font-medium">
                    {activity.type === 'donation' ? activity.donor : activity.sponsor}
                  </p>
                  <p className="text-gray-300 text-sm">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">${activity.amount.toLocaleString()}</p>
                <p className="text-gray-300 text-sm capitalize">{activity.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
