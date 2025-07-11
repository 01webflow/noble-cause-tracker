
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { GlassCard } from './GlassCard';

interface InsightCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export const InsightCard = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  color,
  subtitle,
  prefix,
  suffix,
  delay = 0
}: InsightCardProps) => {
  return (
    <GlassCard delay={delay} className="hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            className="text-3xl font-bold text-white mb-1"
            duration={2000}
          />
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.5 }}
              className={`flex items-center text-xs ${
                changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              <span className="mr-1">
                {changeType === 'increase' ? '↗' : '↘'}
              </span>
              {Math.abs(change)}% from last month
            </motion.div>
          )}
        </div>
        
        <motion.div
          className={`p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
          animate={{ 
            rotateY: [0, 15, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: delay 
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>
    </GlassCard>
  );
};
