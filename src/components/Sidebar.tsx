
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Award, 
  FileText, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ActiveSection, UserRole } from '@/pages/Index';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  userRole, 
  isOpen, 
  onClose,
  isCollapsed = false,
  onToggleCollapse
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

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 }
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] glass-card border-r border-white/10 transform transition-all duration-300 ease-in-out z-50",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Fixed widths for different states
          isCollapsed ? "lg:w-16" : "lg:w-64",
          "w-64" // Mobile always full width
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <motion.h2 
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Navigation
            </motion.h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && (
            <div className="hidden lg:flex justify-end p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="text-white hover:bg-white/10 p-1"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          
          {/* Navigation menu */}
          <nav className="flex-1 px-2 lg:px-3">
            <div className="space-y-2">
              {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left group relative overflow-hidden",
                        "transition-all duration-200 hover:scale-[1.02]",
                        isActive 
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20 shadow-lg" 
                          : "text-gray-300 hover:bg-white/10 hover:text-white",
                        isCollapsed && "lg:justify-center lg:px-0"
                      )}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className={cn(
                        "flex items-center w-full",
                        isCollapsed && "lg:justify-center"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-all duration-200 flex-shrink-0",
                          isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                        )} />
                        
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              variants={itemVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="ml-3 truncate font-medium lg:block"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div 
                          className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* Footer info */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="p-4 border-t border-white/10"
              >
                <div className="text-xs text-gray-400 text-center">
                  <p>Noble Cause Tracker</p>
                  <p className="mt-1">v2.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};
