
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Menu, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onSidebarCollapse?: () => void;
}

export const Header = ({ 
  user, 
  onLogout, 
  onMenuClick, 
  sidebarCollapsed = false, 
  onSidebarCollapse 
}: HeaderProps) => {
  return (
    <motion.header 
      className="glass-card border-0 border-b border-white/10 px-4 lg:px-6 py-4 sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile menu button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="lg:hidden"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="btn-3d glass hover:glass-card text-white hover:text-white p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Desktop sidebar toggle */}
          {onSidebarCollapse && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="hidden lg:block"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onSidebarCollapse}
                className="btn-3d glass hover:glass-card text-white hover:text-white p-2"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center space-x-2 lg:space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl glow"
              animate={{ rotateY: [0, 15, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Noble Cause Tracker
              </h1>
              <p className="text-xs lg:text-sm text-gray-300 hidden sm:block">
                3D Donation Management System
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <motion.div 
            className="text-right hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-300 capitalize">{user.role.replace('_', ' ')}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="glass border-2 border-white/20 w-8 h-8 lg:w-10 lg:h-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <User className="h-3 w-3 lg:h-4 lg:w-4" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="btn-3d glass border-white/20 text-white hover:glass-card hover:text-white text-xs lg:text-sm px-2 lg:px-4"
            >
              <LogOut className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
