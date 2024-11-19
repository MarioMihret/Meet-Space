import React from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, MessageSquare, Share, Users } from 'lucide-react';

interface StreamControlsProps {
  isHost: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndStream: () => void;
  onToggleChat: () => void;
}

export default function StreamControls({
  isHost,
  isAudioOn,
  isVideoOn,
  onToggleAudio,
  onToggleVideo,
  onEndStream,
  onToggleChat,
}: StreamControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900">
      <div className="flex items-center justify-center space-x-4">
        {isHost && (
          <>
            <button
              onClick={onToggleAudio}
              className={`control-button ${!isAudioOn && 'bg-red-500 hover:bg-red-600'}`}
              title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={onToggleVideo}
              className={`control-button ${!isVideoOn && 'bg-red-500 hover:bg-red-600'}`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
          </>
        )}
        
        <button
          onClick={onEndStream}
          className="control-button bg-red-500 hover:bg-red-600"
          title={isHost ? 'End stream' : 'Leave stream'}
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </button>

        <button
          onClick={onToggleChat}
          className="control-button"
          title="Toggle chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {isHost && (
          <button 
            className="control-button"
            title="Share screen"
          >
            <Share className="w-6 h-6" />
          </button>
        )}

        <button 
          className="control-button"
          title="Show participants"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}