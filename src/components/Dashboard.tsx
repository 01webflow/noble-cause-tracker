
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Award, TrendingUp } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', donations: 15000, sponsors: 8000 },
  { month: 'Feb', donations: 18000, sponsors: 12000 },
  { month: 'Mar', donations: 22000, sponsors: 15000 },
  { month: 'Apr', donations: 19000, sponsors: 18000 },
  { month: 'May', donations: 25000, sponsors: 22000 },
  { month: 'Jun', donations: 28000, sponsors: 25000 },
];

const donationSources = [
  { name: 'Online', value: 45, color: '#3B82F6' },
  { name: 'Events', value: 30, color: '#10B981' },
  { name: 'Offline', value: 15, color: '#F59E0B' },
  { name: 'Recurring', value: 10, color: '#8B5CF6' },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your donation management overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127,500</div>
            <p className="text-xs opacity-90">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs opacity-90">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
            <Award className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs opacity-90">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs opacity-90">Year over year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="donations" stroke="#3B82F6" strokeWidth={2} name="Donations" />
                <Line type="monotone" dataKey="sponsors" stroke="#10B981" strokeWidth={2} name="Sponsors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {donationSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'donation', amount: '$500', donor: 'John Smith', time: '2 hours ago' },
              { type: 'sponsor', amount: '$2,000', donor: 'Tech Corp Inc.', time: '4 hours ago' },
              { type: 'donation', amount: '$150', donor: 'Sarah Johnson', time: '6 hours ago' },
              { type: 'donation', amount: '$75', donor: 'Mike Davis', time: '8 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${activity.type === 'sponsor' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {activity.type === 'sponsor' ? (
                      <Award className={`h-4 w-4 ${activity.type === 'sponsor' ? 'text-purple-600' : 'text-blue-600'}`} />
                    ) : (
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.donor}</p>
                    <p className="text-sm text-gray-600">
                      {activity.type === 'sponsor' ? 'Sponsorship' : 'Donation'} of {activity.amount}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
