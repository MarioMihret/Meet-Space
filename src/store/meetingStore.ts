import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Meeting {
  id: string;
  hostId: string;
  participants: number;
  startTime: Date;
  title?: string;
  scheduledTime?: Date;
  duration?: number;
  attendees?: string[];
}

interface MeetingState {
  activeMeetings: Meeting[];
  scheduledMeetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  removeMeeting: (id: string) => void;
  scheduleMeeting: (meeting: Meeting) => void;
  removeScheduledMeeting: (id: string) => void;
}

export const useMeetings = create<MeetingState>()(
  persist(
    (set) => ({
      activeMeetings: [],
      scheduledMeetings: [],
      addMeeting: (meeting) =>
        set((state) => ({
          activeMeetings: [...state.activeMeetings, meeting]
        })),
      removeMeeting: (id) =>
        set((state) => ({
          activeMeetings: state.activeMeetings.filter((m) => m.id !== id)
        })),
      scheduleMeeting: (meeting) =>
        set((state) => ({
          scheduledMeetings: [...state.scheduledMeetings, meeting]
        })),
      removeScheduledMeeting: (id) =>
        set((state) => ({
          scheduledMeetings: state.scheduledMeetings.filter((m) => m.id !== id)
        }))
    }),
    {
      name: 'meetings-storage'
    }
  )
);