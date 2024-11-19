import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';
import { useEvents, Event } from '../store/eventStore';
import LoadingSpinner from '../components/LoadingSpinner';
import EventSearch from '../components/EventSearch';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';

export default function Events() {
  const { user } = useAuth();
  const { events, addEvent, deleteEvent, getEventsByHost, getPublicEvents, addRating, searchEvents } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'my' | 'public'>('public');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    tags: [] as string[],
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, [viewMode]);

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const handleSubmit = (formData: any) => {
    const meetingId = Math.random().toString(36).substring(2, 12);
    
    const newEvent: Event = {
      id: editingEvent?.id || Math.random().toString(36).substring(2, 12),
      ...formData,
      hostId: user?.id || '',
      meetingId,
      attendees: formData.attendees.split(',').map((email: string) => email.trim()).filter(Boolean),
      createdAt: new Date(),
      ratings: [],
      averageRating: 0,
      tags: formData.tags
    };

    if (editingEvent) {
      addEvent({ ...editingEvent, ...newEvent });
      toast.success('Event updated successfully');
    } else {
      addEvent(newEvent);
      toast.success('Event created successfully');
    }

    setShowForm(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toast.success('Event deleted');
  };

  const filteredEvents = searchEvents(searchQuery, searchFilters);
  const displayedEvents = viewMode === 'my' 
    ? (user ? getEventsByHost(user.id) : [])
    : filteredEvents;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Events</h1>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'my' ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => setViewMode('public')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'public' ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              Public Events
            </button>
          </div>
        </div>
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(!showForm);
              setEditingEvent(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Create Event</span>
          </motion.button>
        )}
      </div>

      <EventSearch onSearch={handleSearch} />

      <AnimatePresence>
        {showForm && (
          <EventForm
            event={editingEvent}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {displayedEvents.length > 0 ? (
              displayedEvents
                .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                .map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRate={(eventId, rating) => addRating(eventId, rating)}
                  />
                ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>No events found. {user ? 'Create one to get started!' : 'Log in to create events.'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}