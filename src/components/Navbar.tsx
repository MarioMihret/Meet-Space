import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, User, LogOut, Users, CalendarDays, Shield } from 'lucide-react';
import { useAuth } from '../store/authStore';
import ActiveMeetings from './ActiveMeetings';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Video className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">MeetSpace</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/events" className="nav-link">
              <CalendarDays className="w-5 h-5" />
              <span>Events</span>
            </Link>
            
            {user && (
              <>
                <ActiveMeetings />
                <Link to="/schedule" className="nav-link">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule</span>
                </Link>
                <Link to="/profile" className="nav-link">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    <Shield className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button onClick={signOut} className="nav-link text-red-400">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            
            {!user && (
              <Link to="/login" className="nav-link">
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}