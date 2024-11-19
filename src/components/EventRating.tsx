import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { EventRating as EventRatingType } from '../store/eventStore';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';

interface EventRatingComponentProps {
  eventId: string;
  ratings: EventRatingType[];
  averageRating: number;
  onSubmitRating: (rating: EventRatingType) => void;
}

export default function EventRatingComponent({ eventId, ratings, averageRating, onSubmitRating }: EventRatingComponentProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to rate this event');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    onSubmitRating({
      userId: user.id,
      rating,
      feedback,
      timestamp: new Date()
    });

    setRating(0);
    setFeedback('');
    setShowForm(false);
    toast.success('Thank you for your feedback!');
  };

  const userHasRated = user && ratings.some(r => r.userId === user.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= averageRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400">
            ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
        {!userHasRated && user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Rate this event
          </motion.button>
        )}
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-24"
              placeholder="Share your thoughts about this event..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Submit Rating
            </motion.button>
          </div>
        </motion.form>
      )}

      {ratings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 mt-6"
        >
          <h4 className="font-medium flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Recent Feedback</span>
          </h4>
          <div className="space-y-4">
            {ratings.map((r, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {r.feedback && <p className="text-gray-300">{r.feedback}</p>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}