
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface ReportsProps {
  userRole: UserRole;
}

const monthlyData = [
  { month: 'Jan', donations: 15000, sponsors: 8000, donors: 45, newSponsors: 3 },
  { month: 'Feb', donations: 18000, sponsors: 12000, donors: 52, newSponsors: 5 },
  { month: 'Mar', donations: 22000, sponsors: 15000, donors: 61, newSponsors: 4 },
  { month: 'Apr', donations: 19000, sponsors: 18000, donors: 48, newSponsors: 7 },
  { month: 'May', donations: 25000, sponsors: 22000, donors: 73, newSponsors: 6 },
  { month: 'Jun', donations: 28000, sponsors: 25000, donors: 68, newSponsors: 8 },
];

const donorSegmentation = [
  { name: 'High-Value', value: 25, color: '#8B5CF6' },
  { name: 'Recurring', value: 35, color: '#10B981' },
  { name: 'One-time', value: 40, color: '#3B82F6' },
];

const sponsorTypes = [
  { name: 'Corporate', value: 60, color: '#3B82F6' },
  { name: 'Individual', value: 25, color: '#10B981' },
  { name: 'Event-based', value: 15, color: '#F59E0B' },
];

const goalProgress = [
  { category: 'Donations', target: 150000, achieved: 127500, percentage: 85 },
  { category: 'Sponsors', target: 200, achieved: 156, percentage: 78 },
  { category: 'Events', target: 12, achieved: 8, percentage: 67 },
];

export const Reports = ({ userRole }: ReportsProps) => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 5, 30)
  });

  const canExport = ['admin', 'finance'].includes(userRole);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        
        {canExport && (
          <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        )}
      </div>

      {/* Report Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview Report</SelectItem>
                <SelectItem value="donations">Donation Analysis</SelectItem>
                <SelectItem value="sponsors">Sponsor Report</SelectItem>
                <SelectItem value="goals">Goal Performance</SelectItem>
              </SelectContent>
            </Select>
            
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
            
            <Button variant="outline" className="w-full">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold">$152,500</p>
                <p className="text-xs opacity-75">+15% vs last period</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Donors</p>
                <p className="text-2xl font-bold">1,284</p>
                <p className="text-xs opacity-75">+8% vs last period</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Sponsors</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs opacity-75">+12% vs last period</p>
              </div>
              <Award className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Growth Rate</p>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-xs opacity-75">Year over year</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="donations" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Donations" />
                <Area type="monotone" dataKey="sponsors" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Sponsors" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donor & Sponsor Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donors" stroke="#8B5CF6" strokeWidth={2} name="New Donors" />
                <Line type="monotone" dataKey="newSponsors" stroke="#F59E0B" strokeWidth={2} name="New Sponsors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segmentation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donor Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donorSegmentation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {donorSegmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sponsor Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sponsorTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sponsorTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{goal.category}</span>
                  <span className="text-sm text-gray-600">
                    {goal.achieved.toLocaleString()} / {goal.target.toLocaleString()} ({goal.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${goal.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
