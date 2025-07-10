
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthFormFieldProps {
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  icon: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export const AuthFormField = ({
  type,
  placeholder,
  value,
  error,
  touched,
  icon,
  showPassword,
  onTogglePassword,
  onChange,
  onBlur,
  className
}: AuthFormFieldProps) => {
  const hasError = error && touched;
  const isPassword = type === 'password' || (type === 'text' && onTogglePassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-2", className)}
    >
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
        
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "pl-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400 transition-all duration-300",
            isPassword && "pr-10",
            hasError && "border-red-400 focus:border-red-400",
            !hasError && touched && value && "border-green-400 focus:border-green-400"
          )}
        />
        
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      {!hasError && touched && value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center text-green-400 text-sm"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          Valid
        </motion.div>
      )}
    </motion.div>
  );
};
