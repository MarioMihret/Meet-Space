import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Users, Video, Plus, Trash2 } from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';
import { useMeetings } from '../store/meetingStore';

export default function Schedule() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scheduledMeetings, scheduleMeeting, removeScheduledMeeting } = useMeetings();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    duration: 30,
    participants: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduledTime = new Date(`${formData.date}T${formData.time}`);
    
    if (isBefore(scheduledTime, new Date())) {
      toast.error('Cannot schedule meetings in the past');
      return;
    }

    const newMeeting = {
      id: Math.random().toString(36).substring(2, 12),
      hostId: user?.id || '',
      participants: 0,
      startTime: new Date(),
      title: formData.title,
      scheduledTime,
      duration: formData.duration,
      attendees: formData.participants.split(',').map(email => email.trim()).filter(Boolean)
    };

    scheduleMeeting(newMeeting);
    setShowForm(false);
    setFormData({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      duration: 30,
      participants: ''
    });
    toast.success('Meeting scheduled successfully');
  };

  const startMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  const deleteMeeting = (id: string) => {
    removeScheduledMeeting(id);
    toast.success('Meeting deleted');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schedule Meeting</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Meeting</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Team Standup"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Participants (comma-separated emails)</label>
              <input
                type="text"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="john@example.com, jane@example.com"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {scheduledMeetings.length > 0 ? (
          scheduledMeetings
            .sort((a, b) => (a.scheduledTime?.getTime() || 0) - (b.scheduledTime?.getTime() || 0))
            .map((meeting) => (
              <div key={meeting.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
                    <div className="space-y-2 text-gray-400">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(meeting.scheduledTime || new Date(), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(meeting.scheduledTime || new Date(), 'h:mm a')} 
                          ({meeting.duration} minutes)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{meeting.attendees?.length || 0} participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startMeeting(meeting.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                    <button
                      onClick={() => deleteMeeting(meeting.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-4" />
            <p>No scheduled meetings. Click "New Meeting" to schedule one.</p>
          </div>
        )}
      </div>
    </div>
  );
}