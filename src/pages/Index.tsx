
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { DonationManagement } from '@/components/DonationManagement';
import { DonorManagement } from '@/components/DonorManagement';
import { SponsorManagement } from '@/components/SponsorManagement';
import { Reports } from '@/components/Reports';
import { UserManagement } from '@/components/UserManagement';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedAuth } from '@/components/EnhancedAuth';

export type UserRole = 'admin' | 'finance' | 'event_manager' | 'viewer';
export type ActiveSection = 'dashboard' | 'donations' | 'donors' | 'sponsors' | 'reports' | 'users';

const Index = () => {
  const { user, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) {
    return <EnhancedAuth onLogin={login} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'donations':
        return <DonationManagement userRole={user.role} />;
      case 'donors':
        return <DonorManagement userRole={user.role} />;
      case 'sponsors':
        return <SponsorManagement userRole={user.role} />;
      case 'reports':
        return <Reports userRole={user.role} />;
      case 'users':
        return user.role === 'admin' ? <UserManagement /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row min-h-screen"
      >
        <Header 
          user={user} 
          onLogout={logout} 
          onMenuClick={handleMenuClick}
        />
        
        <div className="flex flex-1 relative">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />
          
          <main className={cn(
            "flex-1 p-4 lg:p-6 relative z-10 transition-all duration-300",
            "lg:ml-64", // Default margin for desktop
            sidebarOpen ? "lg:ml-64" : "lg:ml-16" // Adjust based on sidebar state
          )}>
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
