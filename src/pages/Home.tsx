import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Share, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [meetingId, setMeetingId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const createMeeting = () => {
    // Generate a random meeting ID
    const newMeetingId = Math.random().toString(36).substring(2, 12);
    navigate(`/meeting/${newMeetingId}`);
  };

  const joinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId.trim()) {
      toast.error('Please enter a meeting code');
      return;
    }

    setIsJoining(true);
    try {
      // Navigate to the meeting room
      navigate(`/meeting/${meetingId.trim()}`);
    } catch (error) {
      toast.error('Failed to join the meeting');
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Professional Video Meetings
        </h1>
        <p className="text-xl text-gray-300">
          Secure, reliable video conferencing for teams and individuals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Start or Join Meeting</h2>
          <button
            onClick={createMeeting}
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span>Create New Meeting</span>
          </button>
          
          <form onSubmit={joinMeeting} className="space-y-4">
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting code"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isJoining}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Joining...' : 'Join Meeting'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="HD Video Conferencing"
            description="Crystal clear video and audio for up to 100 participants"
          />
          <FeatureCard
            icon={<Share className="w-8 h-8 text-green-500" />}
            title="Screen Sharing"
            description="Share your screen with one click for better collaboration"
          />
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8 text-purple-500" />}
            title="Chat & Notes"
            description="Real-time chat and collaborative notes during meetings"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 p-6 bg-gray-800 rounded-xl border border-gray-700 transition-transform hover:scale-105">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}