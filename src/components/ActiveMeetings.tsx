import React from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMeetings } from '../store/meetingStore';

export default function ActiveMeetings() {
  const { activeMeetings } = useMeetings();

  if (activeMeetings.length === 0) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex -space-x-2">
        {activeMeetings.slice(0, 3).map((meeting) => (
          <Link
            key={meeting.id}
            to={`/meeting/${meeting.id}`}
            className="relative inline-block"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-gray-800">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-800"></span>
          </Link>
        ))}
      </div>
      {activeMeetings.length > 3 && (
        <span className="text-sm text-gray-400">+{activeMeetings.length - 3} more</span>
      )}
    </div>
  );
}