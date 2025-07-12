import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, TrendingUp, Crown, Gift } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  badge_icon: string;
  earned_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  total_points: number;
  level: number;
}

interface LeaderboardEntry extends UserProfile {
  rank: number;
}

const achievementTypes = [
  { type: 'first_cause', title: 'Pioneer', description: 'Created your first cause', points: 100, icon: Target },
  { type: 'first_donation', title: 'Contributor', description: 'Made your first donation', points: 50, icon: Star },
  { type: 'cause_complete', title: 'Goal Crusher', description: 'Completed a cause goal', points: 200, icon: Trophy },
  { type: 'team_player', title: 'Team Player', description: 'Collaborated on 5 causes', points: 150, icon: Award },
  { type: 'streak_7', title: 'Dedicated', description: '7-day activity streak', points: 75, icon: Zap },
  { type: 'mentor', title: 'Mentor', description: 'Helped 10 other users', points: 300, icon: Crown },
];

const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export const Gamification = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchAchievements();
      fetchLeaderboard();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
    } else if (data) {
      setUserProfile(data);
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
    } else {
      setAchievements(data || []);
    }
  };

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      const leaderboardWithRanks = (data || []).map((profile, index) => ({
        ...profile,
        rank: index + 1
      }));
      setLeaderboard(leaderboardWithRanks);
    }
  };

  const getCurrentLevel = (points: number) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (points >= levelThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const getNextLevelProgress = (points: number) => {
    const currentLevel = getCurrentLevel(points);
    const currentThreshold = levelThresholds[currentLevel - 1] || 0;
    const nextThreshold = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
    
    if (currentLevel >= levelThresholds.length) {
      return 100; // Max level
    }

    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getPointsToNextLevel = (points: number) => {
    const currentLevel = getCurrentLevel(points);
    const nextThreshold = levelThresholds[currentLevel];
    
    if (!nextThreshold) return 0; // Max level
    
    return nextThreshold - points;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const userRank = leaderboard.findIndex(entry => entry.user_id === user?.id) + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Achievements & Progress
        </h1>
        <p className="text-muted-foreground">Track your contributions and unlock rewards</p>
      </div>

      {/* User Progress Overview */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl">
                  {userProfile.display_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {userProfile.display_name || 'User'}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="default" className="gap-1">
                    <Star className="w-3 h-3" />
                    Level {getCurrentLevel(userProfile.total_points)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Zap className="w-3 h-3" />
                    {userProfile.total_points} points
                  </Badge>
                  {userRank > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Rank #{userRank}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to next level</span>
                <span className="font-medium">
                  {getPointsToNextLevel(userProfile.total_points) > 0 
                    ? `${getPointsToNextLevel(userProfile.total_points)} points to go`
                    : 'Max level reached!'
                  }
                </span>
              </div>
              <Progress 
                value={getNextLevelProgress(userProfile.total_points)} 
                className="h-3"
              />
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Achievements ({achievements.length})
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {achievements.slice(0, 6).map((achievement, index) => {
                const achievementConfig = achievementTypes.find(t => t.type === achievement.type);
                const IconComponent = achievementConfig?.icon || Award;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <GlassCard className="p-4 border-l-4 border-l-primary">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/20">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="gap-1">
                            <Zap className="w-3 h-3" />
                            +{achievement.points}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {achievements.length === 0 && (
              <GlassCard className="p-8 text-center">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No achievements yet</h3>
                <p className="text-muted-foreground">
                  Start contributing to causes to unlock your first achievement!
                </p>
              </GlassCard>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Leaderboard
          </h2>
          
          <div className="space-y-2">
            <AnimatePresence>
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard className={`p-4 ${
                    entry.user_id === user?.id ? 'ring-2 ring-primary' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {entry.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {entry.display_name || 'Unknown User'}
                          {entry.user_id === user?.id && (
                            <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Level {entry.level}</span>
                          <span>•</span>
                          <span>{entry.total_points} points</span>
                        </div>
                      </div>

                      {entry.rank <= 3 && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        >
                          <Gift className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Available Achievements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Available Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementTypes.map((achievementType, index) => {
            const earned = achievements.some(a => a.type === achievementType.type);
            const IconComponent = achievementType.icon;
            
            return (
              <motion.div
                key={achievementType.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <GlassCard className={`p-4 ${earned ? 'border border-primary bg-primary/5' : 'opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{achievementType.title}</h3>
                        {earned && <Star className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievementType.description}</p>
                      <Badge variant="outline" className="mt-1 gap-1">
                        <Zap className="w-3 h-3" />
                        {achievementType.points} points
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};