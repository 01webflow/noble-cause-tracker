
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Award, Building, User, Calendar } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface Sponsor {
  id: string;
  name: string;
  type: 'corporate' | 'individual' | 'event-based';
  contactPerson: string;
  email: string;
  phone: string;
  totalContributions: number;
  contributionType: 'monetary' | 'in-kind' | 'both';
  lastContribution: string;
  status: 'active' | 'inactive' | 'pending';
}

interface SponsorManagementProps {
  userRole: UserRole;
}

export const SponsorManagement = ({ userRole }: SponsorManagementProps) => {
  const [sponsors] = useState<Sponsor[]>([
    { 
      id: '1', 
      name: 'Tech Corp Inc.', 
      type: 'corporate', 
      contactPerson: 'Alice Manager',
      email: 'alice@techcorp.com', 
      phone: '(555) 111-2222', 
      totalContributions: 25000, 
      contributionType: 'monetary',
      lastContribution: '2024-01-15', 
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Green Solutions LLC', 
      type: 'corporate', 
      contactPerson: 'Bob Director',
      email: 'bob@greensolutions.com', 
      phone: '(555) 222-3333', 
      totalContributions: 15000, 
      contributionType: 'both',
      lastContribution: '2024-01-12', 
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'Robert Philanthropist', 
      type: 'individual', 
      contactPerson: 'Robert Philanthropist',
      email: 'robert@email.com', 
      phone: '(555) 333-4444', 
      totalContributions: 50000, 
      contributionType: 'monetary',
      lastContribution: '2024-01-10', 
      status: 'active' 
    },
    { 
      id: '4', 
      name: 'Local Events Co.', 
      type: 'event-based', 
      contactPerson: 'Emma Coordinator',
      email: 'emma@localevents.com', 
      phone: '(555) 444-5555', 
      totalContributions: 8000, 
      contributionType: 'in-kind',
      lastContribution: '2024-01-08', 
      status: 'pending' 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sponsor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const canEdit = ['admin', 'finance', 'event_manager'].includes(userRole);

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      'corporate': 'bg-blue-100 text-blue-800',
      'individual': 'bg-green-100 text-green-800',
      'event-based': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getContributionTypeBadgeColor = (type: string) => {
    const colors = {
      'monetary': 'bg-green-100 text-green-800',
      'in-kind': 'bg-orange-100 text-orange-800',
      'both': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'corporate':
        return <Building className="w-4 h-4" />;
      case 'individual':
        return <User className="w-4 h-4" />;
      case 'event-based':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsor Management</h1>
          <p className="text-gray-600 mt-1">Manage sponsor relationships and contributions</p>
        </div>
        
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Sponsor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sponsor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Sponsor Name" />
                <Input placeholder="Contact Person" />
                <Input type="email" placeholder="Email Address" />
                <Input placeholder="Phone Number" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sponsor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="event-based">Event-based</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Contribution Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monetary">Monetary</SelectItem>
                    <SelectItem value="in-kind">In-kind</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Add Sponsor</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Corporate</p>
                <p className="text-2xl font-bold">{sponsors.filter(s => s.type === 'corporate').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Individual</p>
                <p className="text-2xl font-bold">{sponsors.filter(s => s.type === 'individual').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Event-based</p>
                <p className="text-2xl font-bold">{sponsors.filter(s => s.type === 'event-based').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  ${sponsors.reduce((sum, s) => sum + s.totalContributions, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sponsors..."
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
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="event-based">Event-based</SelectItem>
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
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Award className="w-4 h-4 mr-2" />
              Generate Recognition
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sponsors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsors ({filteredSponsors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sponsor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contributions</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contribution Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredSponsors.map((sponsor) => (
                  <tr key={sponsor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getTypeIcon(sponsor.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sponsor.name}</p>
                          <p className="text-sm text-gray-600">{sponsor.contactPerson}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getTypeBadgeColor(sponsor.type)}>
                        {sponsor.type.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{sponsor.email}</p>
                        <p className="text-gray-600">{sponsor.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      ${sponsor.totalContributions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getContributionTypeBadgeColor(sponsor.contributionType)}>
                        {sponsor.contributionType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeColor(sponsor.status)}>
                        {sponsor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{sponsor.lastContribution}</td>
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
