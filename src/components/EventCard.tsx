import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Globe2, Lock, Trash2, Edit2, Video, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Event } from '../store/eventStore';
import { useAuth } from '../store/authStore';
import EventRating from './EventRating';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onRate: (eventId: string, rating: any) => void;
}

export default function EventCard({ event, onEdit, onDelete, onRate }: EventCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            {event.privacy === 'public' ? (
              <Globe2 className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-gray-400">{event.description}</p>
          <div className="flex flex-wrap gap-2">
            {event.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(parseISO(event.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{event.time} ({event.duration} mins)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{event.attendees.length} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{event.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/meeting/${event.meetingId}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Join</span>
          </motion.button>
          {user && event.hostId === user.id && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(event)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Edit event"
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(event.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete event"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {event.ratings && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <EventRating
            eventId={event.id}
            ratings={event.ratings}
            averageRating={event.averageRating}
            onSubmitRating={(rating) => onRate(event.id, rating)}
          />
        </div>
      )}
    </motion.div>
  );
}