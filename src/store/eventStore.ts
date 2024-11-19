import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventPrivacy = 'public' | 'private';

export interface EventRating {
  userId: string;
  rating: number;
  feedback: string;
  timestamp: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  hostId: string;
  privacy: EventPrivacy;
  meetingId: string;
  attendees: string[];
  createdAt: Date;
  tags: string[];
  ratings: EventRating[];
  averageRating: number;
}

interface EventState {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByHost: (hostId: string) => Event[];
  getPublicEvents: () => Event[];
  addRating: (eventId: string, rating: EventRating) => void;
  searchEvents: (query: string, filters: { tags?: string[]; startDate?: string; endDate?: string }) => Event[];
}

export const useEvents = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, ratings: [], averageRating: 0 }]
      })),
      updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((event) => event.id !== id)
      })),
      getEventsByHost: (hostId) => {
        return get().events.filter((event) => event.hostId === hostId);
      },
      getPublicEvents: () => {
        return get().events.filter((event) => event.privacy === 'public');
      },
      addRating: (eventId, rating) => set((state) => {
        const events = state.events.map((event) => {
          if (event.id === eventId) {
            const ratings = [...event.ratings, rating];
            const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
            return { ...event, ratings, averageRating };
          }
          return event;
        });
        return { events };
      }),
      searchEvents: (query, filters) => {
        return get().events.filter((event) => {
          const matchesQuery = query === '' || 
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase()) ||
            event.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

          const matchesTags = !filters.tags?.length || 
            filters.tags.some(tag => event.tags.includes(tag));

          const eventDate = new Date(event.date);
          const matchesDateRange = (!filters.startDate || eventDate >= new Date(filters.startDate)) &&
            (!filters.endDate || eventDate <= new Date(filters.endDate));

          return matchesQuery && matchesTags && matchesDateRange;
        });
      }
    }),
    {
      name: 'events-storage'
    }
  )
);