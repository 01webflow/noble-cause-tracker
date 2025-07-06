
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export const GlassCard = ({ 
  title, 
  children, 
  className = '', 
  animate = true,
  delay = 0 
}: GlassCardProps) => {
  const MotionCard = motion(Card);

  return (
    <MotionCard
      className={`glass-card rounded-3xl border-0 overflow-hidden ${className}`}
      initial={animate ? { opacity: 0, y: 50, rotateX: -20 } : {}}
      animate={animate ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-white font-bold text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="relative">
        {children}
      </CardContent>
    </MotionCard>
  );
};
