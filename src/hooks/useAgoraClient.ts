import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  ILocalTrack
} from 'agora-rtc-sdk-ng';
import toast from 'react-hot-toast';
import { initializeAgoraClient, leaveAgoraChannel, agoraConfig } from '../config/agora';

interface UseAgoraClientProps {
  meetingId: string;
  onError?: (error: Error) => void;
}

export default function useAgoraClient({ meetingId, onError }: UseAgoraClientProps) {
  const clientRef = useRef<IAgoraRTCClient>();
  const [localTracks, setLocalTracks] = useState<{
    audioTrack: IMicrophoneAudioTrack | null;
    videoTrack: ICameraVideoTrack | null;
  }>({
    audioTrack: null,
    videoTrack: null,
  });
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false);
  const videoTrackRef = useRef<ICameraVideoTrack | null>(null);

  useEffect(() => {
    let mounted = true;

    const cleanup = async () => {
      try {
        if (localTracks.audioTrack) {
          await localTracks.audioTrack.stop();
          await localTracks.audioTrack.close();
        }
        if (localTracks.videoTrack) {
          await localTracks.videoTrack.stop();
          await localTracks.videoTrack.close();
        }
        if (clientRef.current) {
          await leaveAgoraChannel(clientRef.current);
        }
        if (mounted) {
          setLocalTracks({ audioTrack: null, videoTrack: null });
          setIsConnected(false);
          setRemoteUsers([]);
        }
        videoTrackRef.current = null;
      } catch (error) {
        console.error('Cleanup error:', error);
      }
      initializingRef.current = false;
      setIsLoading(false);
    };

    const createLocalTracks = async (): Promise<ILocalTrack[]> => {
      const tracks: ILocalTrack[] = [];

      try {
        // Release any existing media streams first
        const existingStreams = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        existingStreams.getTracks().forEach(track => track.stop());

        // Create audio track
        try {
          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            encoderConfig: {
              sampleRate: 48000,
              stereo: true,
              bitrate: 128
            }
          });
          tracks.push(audioTrack);
        } catch (error) {
          console.warn('Failed to create audio track:', error);
          toast.error('Could not access microphone');
        }

        // Create video track with optimal settings
        try {
          const videoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              frameRate: 30,
              bitrateMin: 400,
              bitrateMax: 2000
            },
            optimizationMode: "detail",
            facingMode: "user"
          });
          
          videoTrackRef.current = videoTrack;
          tracks.push(videoTrack);
        } catch (error: any) {
          console.error('Failed to create video track:', error);
          
          if (error.name === "NotReadableError") {
            toast.error('Please close other applications using your camera');
          } else if (error.name === "NotAllowedError") {
            toast.error('Camera permission denied. Please allow camera access');
          } else {
            toast.error('Camera initialization failed. Try refreshing the page');
          }
        }

        if (tracks.length === 0) {
          throw new Error('Could not create any media tracks');
        }

        return tracks;
      } catch (error) {
        console.error('Failed to create media tracks:', error);
        throw error;
      }
    };

    const initializeAgora = async () => {
      if (initializingRef.current || !meetingId) return;
      initializingRef.current = true;
      setIsLoading(true);

      try {
        await cleanup();

        clientRef.current = AgoraRTC.createClient({ 
          mode: "rtc", 
          codec: "vp8" 
        });

        const channelToUse = agoraConfig.channel;
        await initializeAgoraClient(clientRef.current, channelToUse);

        const tracks = await createLocalTracks();
        
        if (!mounted) {
          tracks.forEach(track => track.close());
          return;
        }

        const audioTrack = tracks.find(track => track.trackMediaType === 'audio') as IMicrophoneAudioTrack;
        const videoTrack = tracks.find(track => track.trackMediaType === 'video') as ICameraVideoTrack;

        setLocalTracks({
          audioTrack,
          videoTrack
        });

        if (tracks.length > 0) {
          await clientRef.current.publish(tracks);
        }

        if (videoTrack) {
          const container = document.getElementById('local-video');
          if (container) {
            videoTrack.play(container);
          }
        }

        setIsConnected(true);
        setIsLoading(false);
        toast.success('Successfully joined the meeting');

      } catch (error: any) {
        console.error('Failed to initialize Agora:', error);
        if (onError) {
          onError(error);
        }
        await cleanup();
      }
    };

    const handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
      if (!clientRef.current || !mounted) return;
      
      try {
        await clientRef.current.subscribe(user, mediaType);
        
        if (mediaType === "video") {
          setRemoteUsers(prev => {
            if (prev.some(u => u.uid === user.uid)) return prev;
            return [...prev, user];
          });

          const container = document.getElementById(`remote-video-${user.uid}`);
          if (container) {
            user.videoTrack?.play(container);
          }
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      } catch (error) {
        console.error('Failed to subscribe to user:', error);
        toast.error('Failed to connect to participant');
      }
    };

    const handleUserLeft = (user: any) => {
      if (mounted) {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      }
    };

    if (meetingId && !isConnected) {
      if (clientRef.current) {
        clientRef.current.on("user-published", handleUserPublished);
        clientRef.current.on("user-left", handleUserLeft);
      }
      
      initializeAgora();
    }

    return () => {
      mounted = false;
      cleanup();
    };
  }, [meetingId, onError]);

  return {
    client: clientRef.current,
    localTracks,
    remoteUsers,
    isConnected,
    isLoading
  };
}