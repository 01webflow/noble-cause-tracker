
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTooltipProps {
  steps: TooltipStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const GuidedTooltip = ({ steps, isActive, onComplete, onSkip }: GuidedTooltipProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const element = document.querySelector(steps[currentStep].target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      element.style.position = 'relative';
      element.style.zIndex = '1000';
      element.classList.add('guided-highlight');
    }

    return () => {
      if (element) {
        element.style.zIndex = '';
        element.classList.remove('guided-highlight');
      }
    };
  }, [currentStep, isActive, steps]);

  if (!isActive || !targetElement || !steps[currentStep]) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const getTooltipPosition = () => {
    const rect = targetElement.getBoundingClientRect();
    const position = steps[currentStep].position;
    
    switch (position) {
      case 'top':
        return {
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
        onClick={onSkip}
      />
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed z-[1001] max-w-sm"
        style={getTooltipPosition()}
      >
        <div className="glass-card rounded-2xl p-4 border border-white/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-semibold text-lg">
              {steps[currentStep].title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-white/70 hover:text-white p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-white/80 text-sm mb-4">
            {steps[currentStep].content}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-xs">
              {currentStep + 1} of {steps.length}
            </span>
            
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
