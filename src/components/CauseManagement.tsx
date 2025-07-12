import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Target, Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Cause {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  target_date: string;
  status: string;
  created_at: string;
}

const categories = [
  'Environmental',
  'Educational',
  'Humanitarian',
  'Healthcare',
  'Community',
  'Animal Welfare',
  'Arts & Culture',
  'Technology'
];

const statusColors = {
  active: 'bg-accent text-accent-foreground',
  completed: 'bg-primary text-primary-foreground',
  paused: 'bg-muted text-muted-foreground'
};

export const CauseManagement = () => {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCause, setEditingCause] = useState<Cause | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    target_date: '',
    status: 'active'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    const { data, error } = await supabase
      .from('causes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch causes",
        variant: "destructive"
      });
    } else {
      setCauses(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const causeData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      goal_amount: parseFloat(formData.goal_amount),
      target_date: formData.target_date,
      status: formData.status
    };

    try {
      if (editingCause) {
        const { error } = await supabase
          .from('causes')
          .update(causeData)
          .eq('id', editingCause.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Cause updated successfully" });
      } else {
        const { error } = await supabase
          .from('causes')
          .insert([causeData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Cause created successfully" });
      }

      setIsDialogOpen(false);
      setEditingCause(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        goal_amount: '',
        target_date: '',
        status: 'active'
      });
      fetchCauses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save cause",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (cause: Cause) => {
    setEditingCause(cause);
    setFormData({
      title: cause.title,
      description: cause.description || '',
      category: cause.category,
      goal_amount: cause.goal_amount.toString(),
      target_date: cause.target_date,
      status: cause.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cause?')) return;

    const { error } = await supabase
      .from('causes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete cause",
        variant: "destructive"
      });
    } else {
      toast({ title: "Success", description: "Cause deleted successfully" });
      fetchCauses();
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cause Management</h1>
          <p className="text-muted-foreground">Create and manage your causes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => {
              setEditingCause(null);
              setFormData({
                title: '',
                description: '',
                category: '',
                goal_amount: '',
                target_date: '',
                status: 'active'
              });
            }}>
              <Plus className="w-4 h-4" />
              New Cause
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCause ? 'Edit Cause' : 'Create New Cause'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Cause title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
              
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="Goal amount"
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                required
                min="0"
                step="0.01"
              />
              
              <Input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                required
              />
              
              <Select
                value={formData.status}
                onValueChange={(value) => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCause ? 'Update' : 'Create'} Cause
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {causes.map((cause) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground truncate">
                        {cause.title}
                      </h3>
                      <Badge className={`mt-1 ${statusColors[cause.status]}`}>
                        {cause.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(cause)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(cause.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cause.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        ${cause.current_amount.toLocaleString()} / ${cause.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(cause.current_amount, cause.goal_amount)} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {getProgressPercentage(cause.current_amount, cause.goal_amount).toFixed(1)}% completed
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {cause.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(cause.target_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {causes.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No causes yet</h3>
          <p className="text-muted-foreground mb-4">Create your first cause to get started</p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Cause
          </Button>
        </div>
      )}
    </div>
  );
};