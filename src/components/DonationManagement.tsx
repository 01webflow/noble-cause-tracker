
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Download, Edit, Trash2 } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface Donation {
  id: string;
  amount: number;
  donor: string;
  source: 'online' | 'offline' | 'event' | 'campaign' | 'recurring';
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DonationManagementProps {
  userRole: UserRole;
}

export const DonationManagement = ({ userRole }: DonationManagementProps) => {
  const [donations] = useState<Donation[]>([
    { id: '1', amount: 500, donor: 'John Smith', source: 'online', date: '2024-01-15', status: 'completed' },
    { id: '2', amount: 1000, donor: 'Sarah Johnson', source: 'event', date: '2024-01-14', status: 'completed' },
    { id: '3', amount: 250, donor: 'Mike Davis', source: 'offline', date: '2024-01-13', status: 'pending' },
    { id: '4', amount: 750, donor: 'Emily Wilson', source: 'campaign', date: '2024-01-12', status: 'completed' },
    { id: '5', amount: 100, donor: 'David Brown', source: 'recurring', date: '2024-01-11', status: 'completed' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || donation.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

  const canEdit = ['admin', 'finance'].includes(userRole);

  const getSourceBadgeColor = (source: string) => {
    const colors = {
      online: 'bg-blue-100 text-blue-800',
      offline: 'bg-gray-100 text-gray-800',
      event: 'bg-green-100 text-green-800',
      campaign: 'bg-purple-100 text-purple-800',
      recurring: 'bg-orange-100 text-orange-800',
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all donations</p>
        </div>
        
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Donation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Donor Name" />
                <Input type="number" placeholder="Amount" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Add Donation</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donations ({filteredDonations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  {canEdit && <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{donation.donor}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">${donation.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={getSourceBadgeColor(donation.source)}>
                        {donation.source}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{donation.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeColor(donation.status)}>
                        {donation.status}
                      </Badge>
                    </td>
                    {canEdit && (
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
