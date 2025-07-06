
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-50",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    activeSection === item.id 
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose();
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
