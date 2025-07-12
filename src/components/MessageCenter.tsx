import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Mail, MailOpen, Trash2, Reply, Users } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  cause_id: string | null;
  subject: string;
  content: string;
  read_at: string | null;
  created_at: string;
  causes?: {
    title: string;
  };
}

interface User {
  id: string;
  display_name: string;
  email: string;
}

export const MessageCenter = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [causes, setCauses] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent'>('all');
  const [formData, setFormData] = useState({
    recipient_id: '',
    cause_id: '',
    subject: '',
    content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchUsers();
      fetchCauses();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        causes (title)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } else {
      setMessages(data || []);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, display_name')
      .neq('user_id', user?.id);

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data?.map(u => ({ id: u.user_id, display_name: u.display_name || 'Unknown User', email: '' })) || []);
    }
  };

  const fetchCauses = async () => {
    const { data, error } = await supabase
      .from('causes')
      .select('id, title')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching causes:', error);
    } else {
      setCauses(data || []);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          recipient_id: formData.recipient_id,
          cause_id: formData.cause_id || null,
          subject: formData.subject,
          content: formData.content
        }]);

      if (error) throw error;

      toast({ title: "Success", description: "Message sent successfully" });
      setIsComposeOpen(false);
      setFormData({
        recipient_id: '',
        cause_id: '',
        subject: '',
        content: ''
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('recipient_id', user.id);

    if (!error) {
      fetchMessages();
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    } else {
      toast({ title: "Success", description: "Message deleted successfully" });
      setSelectedMessage(null);
      fetchMessages();
    }
  };

  const handleReply = (message: Message) => {
    setFormData({
      recipient_id: message.sender_id,
      cause_id: message.cause_id || '',
      subject: `Re: ${message.subject}`,
      content: `\n\n--- Original Message ---\n${message.content}`
    });
    setIsComposeOpen(true);
  };

  const filteredMessages = messages.filter(message => {
    if (!user) return false;
    
    switch (filter) {
      case 'unread':
        return message.recipient_id === user.id && !message.read_at;
      case 'sent':
        return message.sender_id === user.id;
      default:
        return true;
    }
  });

  const unreadCount = messages.filter(m => m.recipient_id === user?.id && !m.read_at).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Message Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Communicate with team members and stakeholders</p>
        </div>
        
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Select
                value={formData.recipient_id}
                onValueChange={(value) => setFormData({ ...formData, recipient_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.cause_id}
                onValueChange={(value) => setFormData({ ...formData, cause_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Related cause (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {causes.map((cause) => (
                    <SelectItem key={cause.id} value={cause.id}>
                      {cause.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <Textarea
                placeholder="Message content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={6}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Send Message
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsComposeOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({messages.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'sent' ? 'default' : 'outline'}
          onClick={() => setFilter('sent')}
          size="sm"
        >
          Sent ({messages.filter(m => m.sender_id === user?.id).length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-3">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-4 cursor-pointer transition-all glass-card ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                  } ${
                    message.recipient_id === user?.id && !message.read_at ? 'border-l-4 border-l-accent' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.recipient_id === user?.id && !message.read_at) {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                         <AvatarFallback>
                           U
                         </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          {message.recipient_id === user?.id && !message.read_at && (
                            <Mail className="w-3 h-3 text-accent" />
                          )}
                          {message.recipient_id === user?.id && message.read_at && (
                            <MailOpen className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {message.sender_id === user?.id 
                              ? `To: User` 
                              : 'User'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                      {message.causes && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {message.causes.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <GlassCard className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No messages</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'unread' ? 'No unread messages' : 'Start a conversation'}
              </p>
            </GlassCard>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span>
                        From: User
                      </span>
                      <span>
                        To: User
                      </span>
                        <span>
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </span>
                      </div>
                      {selectedMessage.causes && (
                        <Badge variant="outline" className="mt-2">
                          Related to: {selectedMessage.causes.title}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {selectedMessage.sender_id !== user?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReply(selectedMessage)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-card/30 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                      {selectedMessage.content}
                    </pre>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="p-8 text-center h-full flex items-center justify-center">
              <div>
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Select a message</h3>
                <p className="text-muted-foreground">
                  Choose a message from the list to view its contents
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};