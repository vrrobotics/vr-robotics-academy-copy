import { create } from 'zustand';
import { Batches, Meetings, TeacherAssignments, Students } from '@/entities';

interface BatchSyncState {
  // Batch data
  selectedBatchId: string | null;
  batches: Batches[];
  
  // Related data
  meetings: Meetings[];
  students: Students[];
  teacherAssignments: TeacherAssignments[];
  
  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  
  // Actions
  setSelectedBatch: (batchId: string) => void;
  setBatches: (batches: Batches[]) => void;
  setMeetings: (meetings: Meetings[]) => void;
  setStudents: (students: Students[]) => void;
  setTeacherAssignments: (assignments: TeacherAssignments[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSyncing: (syncing: boolean) => void;
  
  // Batch data update
  updateBatchData: (batchId: string, data: {
    meetings?: Meetings[];
    students?: Students[];
    teacherAssignments?: TeacherAssignments[];
  }) => void;
  
  // Clear state
  clearBatchData: () => void;
}

export const useBatchSyncStore = create<BatchSyncState>((set) => ({
  selectedBatchId: null,
  batches: [],
  meetings: [],
  students: [],
  teacherAssignments: [],
  isLoading: false,
  isSyncing: false,

  setSelectedBatch: (batchId: string) =>
    set({ selectedBatchId: batchId }),

  setBatches: (batches: Batches[]) =>
    set({ batches }),

  setMeetings: (meetings: Meetings[]) =>
    set({ meetings }),

  setStudents: (students: Students[]) =>
    set({ students }),

  setTeacherAssignments: (assignments: TeacherAssignments[]) =>
    set({ teacherAssignments: assignments }),

  setIsLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setIsSyncing: (syncing: boolean) =>
    set({ isSyncing: syncing }),

  updateBatchData: (batchId: string, data: {
    meetings?: Meetings[];
    students?: Students[];
    teacherAssignments?: TeacherAssignments[];
  }) =>
    set((state) => {
      // Only update if this is the selected batch
      if (state.selectedBatchId === batchId) {
        return {
          meetings: data.meetings ?? state.meetings,
          students: data.students ?? state.students,
          teacherAssignments: data.teacherAssignments ?? state.teacherAssignments,
        };
      }
      return state;
    }),

  clearBatchData: () =>
    set({
      selectedBatchId: null,
      batches: [],
      meetings: [],
      students: [],
      teacherAssignments: [],
      isLoading: false,
      isSyncing: false,
    }),
}));
