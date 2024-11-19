import React, { useState } from 'react';
import { Search, Tag, Calendar } from 'lucide-react';

interface EventSearchProps {
  onSearch: (query: string, filters: { tags?: string[]; startDate?: string; endDate?: string }) => void;
}

const POPULAR_TAGS = ['Technology', 'Business', 'Education', 'Entertainment', 'Networking'];

export default function EventSearch({ onSearch }: EventSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = () => {
    onSearch(query, {
      tags: selectedTags,
      startDate,
      endDate
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Tag className="w-4 h-4 text-gray-400" />
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-1 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-1 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}