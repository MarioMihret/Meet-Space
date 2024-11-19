import React from 'react';

interface ChatSidebarProps {
  isOpen: boolean;
}

export default function ChatSidebar({ isOpen }: ChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 p-4">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-4">Meeting Chat</h3>
        <div className="flex-1 overflow-y-auto">
          {/* Chat messages will go here */}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}