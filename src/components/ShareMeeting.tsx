import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareMeetingProps {
  meetingId: string;
}

export default function ShareMeeting({ meetingId }: ShareMeetingProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingId);
      setCopied(true);
      toast.success('Meeting ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy meeting ID');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share Meeting</span>
          </>
        )}
      </button>
      <div className="px-3 py-2 bg-gray-800 rounded-lg flex items-center space-x-2">
        <code className="text-sm text-blue-400">{meetingId}</code>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}