import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  ClientRole
} from 'agora-rtc-sdk-ng';
import toast from 'react-hot-toast';
import { agoraConfig } from '../config/agora';

interface UseLiveStreamingProps {
  channelName: string;
  role: ClientRole;
  uid?: number;
  onError?: (error: Error) => void;
}

export default function useAgoraLiveStreaming({ 
  channelName, 
  role, 
  uid = Math.floor(Math.random() * 1000000),
  onError 
}: UseLiveStreamingProps) {
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
  const connectionAttemptRef = useRef<boolean>(false);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({ 
        mode: "live", 
        codec: "vp8",
        role
      });
    }
    const client = clientRef.current;

    const cleanup = async () => {
      if (localTracks.audioTrack) {
        await localTracks.audioTrack.stop();
        await localTracks.audioTrack.close();
      }
      if (localTracks.videoTrack) {
        await localTracks.videoTrack.stop();
        await localTracks.videoTrack.close();
      }
      if (isConnected && client) {
        await client.leave();
      }
      setLocalTracks({ audioTrack: null, videoTrack: null });
      setIsConnected(false);
      connectionAttemptRef.current = false;
    };

    const initializeLiveStream = async () => {
      if (connectionAttemptRef.current || !channelName) return;
      connectionAttemptRef.current = true;

      try {
        await cleanup();
        await client.setClientRole(role);

        await client.join(agoraConfig.appId, channelName, agoraConfig.token, uid);

        if (role === 'host') {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          
          setLocalTracks({
            audioTrack,
            videoTrack,
          });

          await client.publish([audioTrack, videoTrack]);
          videoTrack.play('local-video');
        }

        setIsConnected(true);
        toast.success(`Successfully joined as ${role}`);
      } catch (error: any) {
        console.error('Failed to initialize live stream:', error);
        toast.error(error.message || 'Failed to join the stream');
        onError?.(error);
        await cleanup();
      }
    };

    const handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      
      if (mediaType === "video") {
        setRemoteUsers(prev => {
          if (prev.some(u => u.uid === user.uid)) return prev;
          return [...prev, user];
        });
        user.videoTrack?.play(`remote-video-${user.uid}`);
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    };

    const handleUserLeft = (user: any) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    if (channelName) {
      initializeLiveStream();
    }

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-left", handleUserLeft);
      cleanup();
    };
  }, [channelName, role, uid, onError]);

  return {
    client: clientRef.current,
    localTracks,
    remoteUsers,
    isConnected,
  };
}