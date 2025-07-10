
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/pages/Index';
import { Heart, Mail, Lock, User, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { AuthFormField } from './AuthFormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAuthProps {
  onLogin: (email: string, password: string, role: UserRole) => boolean;
}

export const EnhancedAuth = ({ onLogin }: EnhancedAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { 
    updateField, 
    validateForm, 
    resetForm, 
    getFieldValue, 
    getFieldError, 
    isFieldTouched,
    hasErrors 
  } = useFormValidation({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => {
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return null;
      }
    },
    ...(isLogin ? {} : {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          return value !== getFieldValue('password') ? 'Passwords do not match' : null;
        }
      }
    })
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    updateField(fieldName, value, validationRules[fieldName as keyof typeof validationRules]);
    
    // Revalidate confirm password when password changes
    if (fieldName === 'password' && !isLogin) {
      const confirmPassword = getFieldValue('confirmPassword');
      if (confirmPassword) {
        updateField('confirmPassword', confirmPassword, validationRules.confirmPassword);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(validationRules)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const success = onLogin(getFieldValue('email'), getFieldValue('password'), role);
      
      if (success) {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: isLogin ? "You have successfully signed in" : "Your account has been created successfully",
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (newIsLogin: boolean) => {
    setIsLogin(newIsLogin);
    resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    if (score < 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(getFieldValue('password'));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl glow">
                  <Heart className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Noble Cause Tracker
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                {isLogin ? 'Welcome back to your dashboard' : 'Join our mission to make a difference'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex rounded-2xl glass p-1 mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabSwitch(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabSwitch(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <AuthFormField
                        type="text"
                        placeholder="First Name"
                        value={getFieldValue('firstName')}
                        error={getFieldError('firstName')}
                        touched={isFieldTouched('firstName')}
                        icon={<User className="h-5 w-5" />}
                        onChange={(value) => handleFieldChange('firstName', value)}
                      />

                      <AuthFormField
                        type="text"
                        placeholder="Last Name"
                        value={getFieldValue('lastName')}
                        error={getFieldError('lastName')}
                        touched={isFieldTouched('lastName')}
                        icon={<User className="h-5 w-5" />}
                        onChange={(value) => handleFieldChange('lastName', value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AuthFormField
                  type="email"
                  placeholder="Email Address"
                  value={getFieldValue('email')}
                  error={getFieldError('email')}
                  touched={isFieldTouched('email')}
                  icon={<Mail className="h-5 w-5" />}
                  onChange={(value) => handleFieldChange('email', value)}
                />

                <div className="space-y-2">
                  <AuthFormField
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={getFieldValue('password')}
                    error={getFieldError('password')}
                    touched={isFieldTouched('password')}
                    icon={<Lock className="h-5 w-5" />}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onChange={(value) => handleFieldChange('password', value)}
                  />
                  
                  {!isLogin && getFieldValue('password') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength.score < 2 ? 'text-red-400' : 
                          passwordStrength.score < 4 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AuthFormField
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={getFieldValue('confirmPassword')}
                        error={getFieldError('confirmPassword')}
                        touched={isFieldTouched('confirmPassword')}
                        icon={<Lock className="h-5 w-5" />}
                        showPassword={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        onChange={(value) => handleFieldChange('confirmPassword', value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="pl-10 glass border-white/20 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="finance">Finance Manager</SelectItem>
                      <SelectItem value="event_manager">Event Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isLoading || hasErrors()}
                    className="w-full py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-2xl glow transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        <span>Processing...</span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isLogin ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Demo credentials: Use any email/password combination
                </p>
                {!isLogin && (
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
