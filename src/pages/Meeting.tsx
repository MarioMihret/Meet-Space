import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import MeetingControls from '../components/MeetingControls';
import ChatSidebar from '../components/ChatSidebar';
import ShareMeeting from '../components/ShareMeeting';
import useAgoraClient from '../hooks/useAgoraClient';
import { useMeetings } from '../store/meetingStore';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Meeting() {
  const { id: meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addMeeting, removeMeeting } = useMeetings();
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!meetingId || !user) {
      toast.error('Invalid meeting ID or not authenticated');
      navigate('/');
      return;
    }

    // Add meeting to active meetings
    addMeeting({
      id: meetingId,
      hostId: user.id,
      participants: 1,
      startTime: new Date()
    });

    return () => {
      removeMeeting(meetingId);
    };
  }, [meetingId, user, addMeeting, removeMeeting, navigate]);

  const handleError = useCallback((error: Error) => {
    console.error('Meeting error:', error);
    toast.error(error.message || 'Failed to connect to the meeting');
    navigate('/');
  }, [navigate]);

  const { localTracks, remoteUsers, isConnected, isLoading } = useAgoraClient({
    meetingId: meetingId || '',
    onError: handleError,
  });

  const toggleAudio = useCallback(() => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(!isAudioOn);
      setIsAudioOn(!isAudioOn);
      toast.success(isAudioOn ? 'Microphone muted' : 'Microphone unmuted');
    }
  }, [localTracks.audioTrack, isAudioOn]);

  const toggleVideo = useCallback(() => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(!isVideoOn);
      setIsVideoOn(!isVideoOn);
      toast.success(isVideoOn ? 'Camera turned off' : 'Camera turned on');
    }
  }, [localTracks.videoTrack, isVideoOn]);

  const endCall = useCallback(async () => {
    if (localTracks.audioTrack) {
      await localTracks.audioTrack.stop();
      await localTracks.audioTrack.close();
    }
    if (localTracks.videoTrack) {
      await localTracks.videoTrack.stop();
      await localTracks.videoTrack.close();
    }
    toast.success('Left the meeting');
    navigate('/');
  }, [localTracks, navigate]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-300">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 bg-gray-900 relative">
        <div className="absolute top-4 left-4 z-10">
          <ShareMeeting meetingId={meetingId || ''} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
          {isConnected && (
            <VideoPlayer
              id="local-video"
              label="You"
              isAudioMuted={!isAudioOn}
              isVideoOff={!isVideoOn}
              videoTrack={localTracks.videoTrack}
            />
          )}

          {remoteUsers.map((user) => (
            <VideoPlayer
              key={user.uid}
              id={`remote-video-${user.uid}`}
              label={`Participant ${user.uid}`}
              isAudioMuted={!user.audioTrack?.enabled}
              isVideoOff={!user.videoTrack?.enabled}
              videoTrack={user.videoTrack}
            />
          ))}
        </div>

        <MeetingControls
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onEndCall={endCall}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
        />
      </div>

      <ChatSidebar isOpen={isChatOpen} />
    </div>
  );
}