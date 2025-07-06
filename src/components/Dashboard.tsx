import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Award, TrendingUp, Sparkles } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', donations: 15000, sponsors: 8000 },
  { month: 'Feb', donations: 18000, sponsors: 12000 },
  { month: 'Mar', donations: 22000, sponsors: 15000 },
  { month: 'Apr', donations: 19000, sponsors: 18000 },
  { month: 'May', donations: 25000, sponsors: 22000 },
  { month: 'Jun', donations: 28000, sponsors: 25000 },
];

const donationSources = [
  { name: 'Online', value: 45, color: '#60a5fa' },
  { name: 'Events', value: 30, color: '#10b981' },
  { name: 'Offline', value: 15, color: '#f59e0b' },
  { name: 'Recurring', value: 10, color: '#8b5cf6' },
];

export const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating header with 3D effect */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative"
      >
        <div className="flex items-center space-x-4 mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 rounded-2xl glass glow"
          >
            <Sparkles className="h-8 w-8 text-blue-400" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-300 mt-1">Welcome to your donation management universe</p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards with 3D animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="perspective-1000"
        >
          <GlassCard className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30" delay={0.1}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-2">Total Donations</p>
                <AnimatedCounter 
                  value={127500} 
                  prefix="$" 
                  className="text-3xl font-bold text-white"
                />
                <motion.p 
                  className="text-xs text-blue-200 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  +12% from last month
                </motion.p>
              </div>
              <motion.div
                animate={{ rotateY: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-4 bg-white/10 rounded-2xl"
              >
                <DollarSign className="h-8 w-8 text-blue-400" />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="perspective-1000"
        >
          <GlassCard className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30" delay={0.2}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium mb-2">Active Donors</p>
                <AnimatedCounter 
                  value={1284} 
                  className="text-3xl font-bold text-white"
                />
                <motion.p 
                  className="text-xs text-green-200 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  +8% from last month
                </motion.p>
              </div>
              <motion.div
                animate={{ rotateY: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="p-4 bg-white/10 rounded-2xl"
              >
                <Users className="h-8 w-8 text-green-400" />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="perspective-1000"
        >
          <GlassCard className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30" delay={0.3}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium mb-2">Active Sponsors</p>
                <AnimatedCounter 
                  value={156} 
                  className="text-3xl font-bold text-white"
                />
                <motion.p 
                  className="text-xs text-purple-200 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  +5% from last month
                </motion.p>
              </div>
              <motion.div
                animate={{ rotateY: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                className="p-4 bg-white/10 rounded-2xl"
              >
                <Award className="h-8 w-8 text-purple-400" />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="perspective-1000"
        >
          <GlassCard className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30" delay={0.4}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium mb-2">Growth Rate</p>
                <AnimatedCounter 
                  value={23} 
                  suffix="%" 
                  prefix="+" 
                  className="text-3xl font-bold text-white"
                />
                <motion.p 
                  className="text-xs text-orange-200 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  Year over year
                </motion.p>
              </div>
              <motion.div
                animate={{ rotateY: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                className="p-4 bg-white/10 rounded-2xl"
              >
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Enhanced Charts with 3D perspective */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard title="Monthly Trends" delay={0.5}>
          <motion.div
            initial={{ opacity: 0, rotateX: -20 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']} 
                />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  name="Donations" 
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sponsors" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Sponsors" 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </GlassCard>

        <GlassCard title="Donation Sources" delay={0.6}>
          <motion.div
            initial={{ opacity: 0, rotateX: -20 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelStyle={{ fill: 'white', fontSize: '12px' }}
                >
                  {donationSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                  formatter={(value) => [`${value}%`, '']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </GlassCard>
      </div>

      {/* Enhanced Recent Activity with glass morphism */}
      <GlassCard title="Recent Activities" delay={0.7}>
        <div className="space-y-4">
          {[
            { type: 'donation', amount: '$500', donor: 'John Smith', time: '2 hours ago' },
            { type: 'sponsor', amount: '$2,000', donor: 'Tech Corp Inc.', time: '4 hours ago' },
            { type: 'donation', amount: '$150', donor: 'Sarah Johnson', time: '6 hours ago' },
            { type: 'donation', amount: '$75', donor: 'Mike Davis', time: '8 hours ago' },
          ].map((activity, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="flex items-center justify-between p-4 glass rounded-2xl hover:glow transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`p-3 rounded-full ${activity.type === 'sponsor' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, delay: index }}
                >
                  {activity.type === 'sponsor' ? (
                    <Award className={`h-5 w-5 ${activity.type === 'sponsor' ? 'text-purple-400' : 'text-blue-400'}`} />
                  ) : (
                    <DollarSign className="h-5 w-5 text-blue-400" />
                  )}
                </motion.div>
                <div>
                  <p className="font-medium text-white">{activity.donor}</p>
                  <p className="text-sm text-gray-300">
                    {activity.type === 'sponsor' ? 'Sponsorship' : 'Donation'} of {activity.amount}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};
