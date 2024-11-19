import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import StreamControls from '../components/StreamControls';
import ChatSidebar from '../components/ChatSidebar';
import useAgoraLiveStreaming from '../hooks/useAgoraLiveStreaming';
import { ClientRole } from 'agora-rtc-sdk-ng';
import toast from 'react-hot-toast';

export default function LiveStream() {
  const { id: channelName } = useParams();
  const navigate = useNavigate();
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [role] = useState<ClientRole>('host');

  const handleError = useCallback((error: Error) => {
    navigate('/', { state: { error: error.message } });
  }, [navigate]);

  const { localTracks, remoteUsers, isConnected } = useAgoraLiveStreaming({
    channelName: channelName || '',
    role,
    onError: handleError,
  });

  const toggleAudio = useCallback(() => {
    if (localTracks.audioTrack && role === 'host') {
      localTracks.audioTrack.setEnabled(!isAudioOn);
      setIsAudioOn(!isAudioOn);
      toast.success(isAudioOn ? 'Microphone muted' : 'Microphone unmuted');
    }
  }, [localTracks.audioTrack, isAudioOn, role]);

  const toggleVideo = useCallback(() => {
    if (localTracks.videoTrack && role === 'host') {
      localTracks.videoTrack.setEnabled(!isVideoOn);
      setIsVideoOn(!isVideoOn);
      toast.success(isVideoOn ? 'Camera turned off' : 'Camera turned on');
    }
  }, [localTracks.videoTrack, isVideoOn, role]);

  const endStream = useCallback(async () => {
    if (localTracks.audioTrack) {
      await localTracks.audioTrack.stop();
      await localTracks.audioTrack.close();
    }
    if (localTracks.videoTrack) {
      await localTracks.videoTrack.stop();
      await localTracks.videoTrack.close();
    }
    toast.success(role === 'host' ? 'Stream ended' : 'Left the stream');
    navigate('/');
  }, [localTracks, navigate, role]);

  if (!channelName) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 bg-gray-900 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
          {isConnected && role === 'host' && (
            <VideoPlayer
              id="local-video"
              label="You (Host)"
              isAudioMuted={!isAudioOn}
              isVideoOff={!isVideoOn}
              isHost
            />
          )}

          {remoteUsers.map((user) => (
            <VideoPlayer
              key={user.uid}
              id={`remote-video-${user.uid}`}
              label={`${role === 'host' ? 'Viewer' : 'Host'} ${user.uid}`}
              isHost={role === 'audience'}
            />
          ))}
        </div>

        <StreamControls
          isHost={role === 'host'}
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onEndStream={endStream}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
        />
      </div>

      <ChatSidebar isOpen={isChatOpen} />
    </div>
  );
}