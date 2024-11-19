import React from 'react';
import { Crown, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoPlayerProps {
  id: string;
  label: string;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
  isHost?: boolean;
  videoTrack?: any;
}

export default function VideoPlayer({ 
  id, 
  label, 
  isAudioMuted, 
  isVideoOff,
  isHost,
  videoTrack
}: VideoPlayerProps) {
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <div 
        id={id}
        className="w-full h-full bg-gray-900 flex items-center justify-center"
      >
        {(!videoTrack || isVideoOff) && (
          <div className="flex flex-col items-center space-y-2">
            <VideoOff className="w-12 h-12 text-gray-400" />
            <span className="text-gray-400">Camera Off</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="bg-gray-900 bg-opacity-75 px-3 py-1.5 rounded-lg flex items-center space-x-2">
          {isHost && <Crown className="w-4 h-4 text-yellow-400" />}
          <span className="text-sm font-medium">{label}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAudioMuted ? (
            <div className="bg-red-500 bg-opacity-75 p-1.5 rounded-lg">
              <MicOff className="w-4 h-4" />
            </div>
          ) : (
            <div className="bg-green-500 bg-opacity-75 p-1.5 rounded-lg">
              <Mic className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}