import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Event, EventPrivacy } from '../store/eventStore';

interface EventFormProps {
  event?: Event;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || format(new Date(), 'yyyy-MM-dd'),
    time: event?.time || format(new Date(), 'HH:mm'),
    duration: event?.duration || 30,
    privacy: event?.privacy || 'public' as EventPrivacy,
    attendees: event?.attendees?.join(', ') || '',
    tags: event?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Team Workshop"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-24"
            placeholder="Event description..."
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

        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">Privacy</label>
            <select
              value={formData.privacy}
              onChange={(e) => setFormData({ ...formData, privacy: e.target.value as EventPrivacy })}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="technology, business, education"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Participants (comma-separated emails)</label>
          <input
            type="text"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="john@example.com, jane@example.com"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}