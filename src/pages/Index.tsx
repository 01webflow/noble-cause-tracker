import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header 
          user={user} 
          onLogout={logout} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex relative">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 p-6 lg:ml-64 relative z-10">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 50, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -50, rotateY: 10 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
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
