
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Mail, Eye, Edit } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalDonations: number;
  lastDonation: string;
  type: 'one-time' | 'recurring' | 'high-value';
  status: 'active' | 'inactive';
}

interface DonorManagementProps {
  userRole: UserRole;
}

export const DonorManagement = ({ userRole }: DonorManagementProps) => {
  const [donors] = useState<Donor[]>([
    { id: '1', name: 'John Smith', email: 'john@email.com', phone: '(555) 123-4567', totalDonations: 2500, lastDonation: '2024-01-15', type: 'high-value', status: 'active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 234-5678', totalDonations: 1200, lastDonation: '2024-01-14', type: 'recurring', status: 'active' },
    { id: '3', name: 'Mike Davis', email: 'mike@email.com', phone: '(555) 345-6789', totalDonations: 250, lastDonation: '2024-01-13', type: 'one-time', status: 'active' },
    { id: '4', name: 'Emily Wilson', email: 'emily@email.com', phone: '(555) 456-7890', totalDonations: 750, lastDonation: '2024-01-12', type: 'recurring', status: 'active' },
    { id: '5', name: 'David Brown', email: 'david@email.com', phone: '(555) 567-8901', totalDonations: 500, lastDonation: '2023-12-01', type: 'one-time', status: 'inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || donor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const canEdit = ['admin', 'finance'].includes(userRole);

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      'one-time': 'bg-blue-100 text-blue-800',
      'recurring': 'bg-green-100 text-green-800',
      'high-value': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Management</h1>
          <p className="text-gray-600 mt-1">Manage donor profiles and relationships</p>
        </div>
        
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Donor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Donor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Input placeholder="Phone Number" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Donor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="high-value">High-value</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Add Donor</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
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
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="high-value">High-value</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Thank You
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-green-600">
                  {donors.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">High-Value Donors</p>
                <p className="text-2xl font-bold text-purple-600">
                  {donors.filter(d => d.type === 'high-value').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donors ({filteredDonors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Donations</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Donation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{donor.name}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{donor.email}</p>
                        <p className="text-gray-600">{donor.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      ${donor.totalDonations.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getTypeBadgeColor(donor.type)}>
                        {donor.type.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeColor(donor.status)}>
                        {donor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{donor.lastDonation}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
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
