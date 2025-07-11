
import { useState, useEffect } from 'react';

interface OnboardingState {
  isFirstVisit: boolean;
  completedSteps: string[];
  isActive: boolean;
}

export const useOnboarding = () => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isFirstVisit: true,
    completedSteps: [],
    isActive: false
  });

  useEffect(() => {
    const savedState = localStorage.getItem('onboarding-state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setOnboardingState({
        ...parsed,
        isActive: parsed.isFirstVisit && !parsed.completedSteps.includes('dashboard-tour')
      });
    } else {
      setOnboardingState(prev => ({ ...prev, isActive: true }));
    }
  }, []);

  const completeOnboarding = () => {
    const newState = {
      isFirstVisit: false,
      completedSteps: [...onboardingState.completedSteps, 'dashboard-tour'],
      isActive: false
    };
    
    setOnboardingState(newState);
    localStorage.setItem('onboarding-state', JSON.stringify(newState));
  };

  const skipOnboarding = () => {
    const newState = {
      ...onboardingState,
      isActive: false
    };
    
    setOnboardingState(newState);
    localStorage.setItem('onboarding-state', JSON.stringify(newState));
  };

  const resetOnboarding = () => {
    const newState = {
      isFirstVisit: true,
      completedSteps: [],
      isActive: true
    };
    
    setOnboardingState(newState);
    localStorage.setItem('onboarding-state', JSON.stringify(newState));
  };

  return {
    ...onboardingState,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};
