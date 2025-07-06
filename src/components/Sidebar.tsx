
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Award, 
  FileText, 
  Settings,
  X
} from 'lucide-react';
import { ActiveSection, UserRole } from '@/pages/Index';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  userRole, 
  isOpen, 
  onClose 
}: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as ActiveSection, label: 'Dashboard', icon: BarChart3, roles: ['admin', 'finance', 'event_manager', 'viewer'] },
    { id: 'donations' as ActiveSection, label: 'Donations', icon: DollarSign, roles: ['admin', 'finance', 'event_manager'] },
    { id: 'donors' as ActiveSection, label: 'Donors', icon: Users, roles: ['admin', 'finance', 'event_manager'] },
    { id: 'sponsors' as ActiveSection, label: 'Sponsors', icon: Award, roles: ['admin', 'finance', 'event_manager'] },
    { id: 'reports' as ActiveSection, label: 'Reports', icon: FileText, roles: ['admin', 'finance', 'event_manager', 'viewer'] },
    { id: 'users' as ActiveSection, label: 'User Management', icon: Settings, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleItemClick = (sectionId: ActiveSection) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay - only visible when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-card transform transition-all duration-300 ease-in-out z-50",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Smooth animation for width changes on desktop
        "lg:transition-[width] lg:duration-300",
        // Hover behavior - expand on desktop when collapsed
        "lg:hover:w-64 lg:group-hover:w-64"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation menu */}
          <nav className="flex-1">
            <div className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left group relative overflow-hidden",
                      "transition-all duration-200 hover:scale-[1.02]",
                      isActive 
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20 shadow-lg" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex items-center w-full">
                      <Icon className={cn(
                        "h-5 w-5 transition-all duration-200",
                        isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                      )} />
                      <span className={cn(
                        "ml-3 transition-all duration-200 lg:opacity-100",
                        "truncate font-medium"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer info */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs text-gray-400 text-center">
              <p>Noble Cause Tracker</p>
              <p className="mt-1">v2.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
