import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Calendar, AlertTriangle, BarChart3, Search, Flag, Ban, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth, User } from '../store/authStore';
import { useEvents, Event } from '../store/eventStore';
import toast from 'react-hot-toast';

type Tab = 'users' | 'events' | 'reports';

interface Report {
  id: string;
  userId: string;
  eventId: string;
  type: 'inappropriate' | 'spam' | 'other';
  description: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
}

// Mock data for reports
const mockReports: Report[] = [
  {
    id: '1',
    userId: '2',
    eventId: '1',
    type: 'inappropriate',
    description: 'Inappropriate content in event description',
    status: 'pending',
    createdAt: new Date()
  },
  // Add more mock reports as needed
];

export default function Admin() {
  const { user } = useAuth();
  const { events, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: new Date(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: new Date(),
      status: 'active'
    },
    // Add more mock users as needed
  ];

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleUserAction = (userId: string, action: 'suspend' | 'activate') => {
    // In a real app, this would make an API call
    toast.success(`User ${action}d successfully`);
  };

  const handleEventAction = (eventId: string, action: 'delete' | 'feature') => {
    if (action === 'delete') {
      deleteEvent(eventId);
      toast.success('Event deleted successfully');
    } else {
      toast.success('Event featured successfully');
    }
  };

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    // In a real app, this would make an API call
    toast.success(`Report ${action}d successfully`);
  };

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Joined</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(user.createdAt, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleUserAction(user.id, 'suspend')}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUserAction(user.id, 'activate')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Host</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Privacy</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Attendees</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {mockUsers.find(u => u.id === event.hostId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.privacy === 'public' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {event.privacy}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.attendees.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => handleEventAction(event.id, 'delete')}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Ban className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Event</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Reporter</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.type === 'inappropriate' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4">{report.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {events.find(e => e.id === report.eventId)?.title || 'Deleted Event'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {mockUsers.find(u => u.id === report.userId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => handleReportAction(report.id, 'resolve')}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <div className="px-4 py-2 bg-gray-800 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold">{mockUsers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending Reports</p>
              <p className="text-2xl font-bold">
                {mockReports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4" />
                <span>Reports</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>
    </div>
  );
}