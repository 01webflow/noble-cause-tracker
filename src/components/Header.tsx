
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Menu, User, LogOut } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onMenuClick: () => void;
}

export const Header = ({ user, onLogout, onMenuClick }: HeaderProps) => {
  return (
    <motion.header 
      className="glass-card border-0 border-b border-white/10 px-6 py-4 sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden btn-3d glass hover:glass-card text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl glow"
              animate={{ rotateY: [0, 15, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Noble Cause Tracker
              </h1>
              <p className="text-sm text-gray-300">3D Donation Management System</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div 
            className="text-right hidden sm:block"
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
            <Avatar className="glass border-2 border-white/20">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="btn-3d glass border-white/20 text-white hover:glass-card hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
