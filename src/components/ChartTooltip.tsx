
import React from 'react';
import { motion } from 'framer-motion';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => [string, string];
}

export const ChartTooltip = ({ active, payload, label, formatter }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-3 border border-white/20 shadow-xl"
    >
      <p className="text-white font-semibold text-sm mb-2">{label}</p>
      {payload.map((entry, index) => {
        const [formattedValue, formattedName] = formatter 
          ? formatter(entry.value, entry.name)
          : [entry.value?.toLocaleString() || '', entry.name || ''];
          
        return (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-200 text-xs">{formattedName}</span>
            </div>
            <span className="text-white font-medium text-xs">{formattedValue}</span>
          </div>
        );
      })}
    </motion.div>
  );
};
