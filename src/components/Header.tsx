
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Menu, User } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onMenuClick: () => void;
}

export const Header = ({ user, onLogout, onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Noble Cause Tracker</h1>
              <p className="text-sm text-gray-600">Donation Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
          
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
