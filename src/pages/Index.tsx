
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
import { CauseManagement } from '@/components/CauseManagement';
import { EventCalendar } from '@/components/EventCalendar';
import { MessageCenter } from '@/components/MessageCenter';
import { Gamification } from '@/components/Gamification';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedAuth } from '@/components/EnhancedAuth';
import { cn } from '@/lib/utils';

export type UserRole = 'admin' | 'finance' | 'event_manager' | 'viewer';
export type ActiveSection = 'dashboard' | 'donations' | 'donors' | 'sponsors' | 'reports' | 'users' | 'causes' | 'events' | 'messages' | 'achievements';

const Index = () => {
  const { user, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on desktop based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
        // Auto-collapse on smaller desktop screens
        setSidebarCollapsed(window.innerWidth < 1280);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

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
      case 'causes':
        return <CauseManagement />;
      case 'events':
        return <EventCalendar />;
      case 'messages':
        return <MessageCenter />;
      case 'achievements':
        return <Gamification />;
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

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col min-h-screen"
      >
        <Header 
          user={user} 
          onLogout={logout} 
          onMenuClick={handleMenuClick}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarCollapse={handleSidebarCollapse}
        />
        
        <div className="flex flex-1 relative">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleSidebarCollapse}
          />
          
          <main className={cn(
            "flex-1 p-4 lg:p-6 relative z-10 transition-all duration-300 ease-in-out",
            // Dynamic margin based on sidebar state
            "lg:ml-0", // Default no margin
            !sidebarCollapsed && "lg:ml-64", // Full sidebar width
            sidebarCollapsed && "lg:ml-16" // Collapsed sidebar width
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
