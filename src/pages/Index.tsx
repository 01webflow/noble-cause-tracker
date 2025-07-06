
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { DonationManagement } from '@/components/DonationManagement';
import { DonorManagement } from '@/components/DonorManagement';
import { SponsorManagement } from '@/components/SponsorManagement';
import { Reports } from '@/components/Reports';
import { UserManagement } from '@/components/UserManagement';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';

export type UserRole = 'admin' | 'finance' | 'event_manager' | 'viewer';

export type ActiveSection = 'dashboard' | 'donations' | 'donors' | 'sponsors' | 'reports' | 'users';

const Index = () => {
  const { user, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <LoginForm onLogin={login} />;
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={logout} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
