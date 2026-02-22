import { useEffect, useCallback, useRef } from 'react';
import { useBatchSyncStore } from '@/stores/batchSyncStore';
import { MeetingSyncService } from '@/services/meetingSyncService';
import { BaseCrudService } from '@/integrations';
import { Batches } from '@/entities';

/**
 * Custom hook for batch and meeting synchronization
 * Handles real-time data loading and updates across portals
 */
export const useBatchSync = (teacherId?: string, isAdmin?: boolean) => {
  const {
    selectedBatchId,
    batches,
    meetings,
    students,
    teacherAssignments,
    isLoading,
    isSyncing,
    setSelectedBatch,
    setBatches,
    setMeetings,
    setStudents,
    setTeacherAssignments,
    setIsLoading,
    setIsSyncing,
    updateBatchData,
  } = useBatchSyncStore();

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(0);

  /**
   * Load initial batch data
   */
  const loadBatches = useCallback(async () => {
    try {
      setIsLoading(true);

      // Defensive check: ensure teacherId or isAdmin is provided
      if (!teacherId && !isAdmin) {
        console.warn('[useBatchSync] No teacherId or isAdmin provided, skipping batch load');
        setBatches([]);
        setIsLoading(false);
        return;
      }

      if (isAdmin) {
        // Admin sees all batches
        console.log('[useBatchSync] Loading all batches for admin');
        const { items: allBatches } = await BaseCrudService.getAll<Batches>('batches');
        
        // Defensive check: validate batches array
        if (!Array.isArray(allBatches)) {
          console.error('[useBatchSync] Invalid batches response - not an array:', allBatches);
          setBatches([]);
          return;
        }
        
        console.log(`[useBatchSync] Loaded ${allBatches.length} batches for admin`);
        setBatches(allBatches);
        
        if (allBatches.length > 0 && !selectedBatchId) {
          const firstBatchId = allBatches[0]?._id;
          if (firstBatchId) {
            console.log(`[useBatchSync] Setting first batch as selected: ${firstBatchId}`);
            setSelectedBatch(firstBatchId);
          }
        }
      } else if (teacherId) {
        // Teacher sees only assigned batches via TeacherAssignments
        console.log(`[useBatchSync] Loading batches for teacher: ${teacherId}`);
        try {
          const teacherBatches = await MeetingSyncService.getBatchesByTeacher(teacherId);
          
          // Defensive check: validate batches array
          if (!Array.isArray(teacherBatches)) {
            console.error('[useBatchSync] Invalid teacher batches response - not an array:', teacherBatches);
            setBatches([]);
            return;
          }
          
          console.log(`[useBatchSync] Query result for teacher ${teacherId}: ${teacherBatches.length} batches found`);
          
          // Log batch details for debugging
          teacherBatches.forEach((batch, index) => {
            console.log(`[useBatchSync] Batch ${index + 1}: ID=${batch._id}, Name=${batch.batchName}, Level=${batch.batchLevel}`);
          });
          
          setBatches(teacherBatches);
          
          if (teacherBatches.length > 0 && !selectedBatchId) {
            const firstBatchId = teacherBatches[0]?._id;
            if (firstBatchId) {
              console.log(`[useBatchSync] Setting first batch as selected: ${firstBatchId}`);
              setSelectedBatch(firstBatchId);
            }
          } else if (teacherBatches.length === 0) {
            console.warn(`[useBatchSync] No batches assigned to teacher ${teacherId}`);
          }
        } catch (error) {
          console.error(`[useBatchSync] Error loading teacher batches for ${teacherId}:`, error);
          setBatches([]);
        }
      }
    } catch (error) {
      console.error('[useBatchSync] Error loading batches:', error);
      setBatches([]);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, isAdmin, selectedBatchId, setSelectedBatch, setBatches, setIsLoading]);

  /**
   * Load data for selected batch
   */
  const loadBatchData = useCallback(async (batchId: string) => {
    try {
      // Defensive check: validate batchId
      if (!batchId || typeof batchId !== 'string' || batchId.trim() === '') {
        console.warn('[useBatchSync] Invalid batchId provided:', batchId);
        setMeetings([]);
        setStudents([]);
        setTeacherAssignments([]);
        return;
      }

      console.log(`[useBatchSync] Loading data for batch: ${batchId}`);
      setIsSyncing(true);
      
      const data = await MeetingSyncService.getBatchWithRelations(batchId);

      // Defensive checks: validate response data
      if (!data) {
        console.error('[useBatchSync] getBatchWithRelations returned null or undefined');
        setMeetings([]);
        setStudents([]);
        setTeacherAssignments([]);
        return;
      }

      // Validate meetings array
      if (!Array.isArray(data.meetings)) {
        console.error('[useBatchSync] Invalid meetings response - not an array:', data.meetings);
        data.meetings = [];
      } else {
        console.log(`[useBatchSync] Query result for batch ${batchId}: ${data.meetings.length} meetings found`);
        data.meetings.forEach((meeting, index) => {
          console.log(`[useBatchSync] Meeting ${index + 1}: ID=${meeting._id}, Title=${meeting.title || meeting.meetingTitle}, BatchID=${meeting.batchId}`);
        });
      }

      // Validate students array
      if (!Array.isArray(data.students)) {
        console.error('[useBatchSync] Invalid students response - not an array:', data.students);
        data.students = [];
      }

      // Validate teacherAssignments array
      if (!Array.isArray(data.teacherAssignments)) {
        console.error('[useBatchSync] Invalid teacherAssignments response - not an array:', data.teacherAssignments);
        data.teacherAssignments = [];
      }

      setMeetings(data.meetings);
      setStudents(data.students);
      setTeacherAssignments(data.teacherAssignments);
    } catch (error) {
      console.error(`[useBatchSync] Error loading batch data for ${batchId}:`, error);
      setMeetings([]);
      setStudents([]);
      setTeacherAssignments([]);
    } finally {
      setIsSyncing(false);
    }
  }, [setMeetings, setStudents, setTeacherAssignments, setIsSyncing]);

  /**
   * Refresh batch data (for real-time sync)
   */
  const refreshBatchData = useCallback(async () => {
    if (!selectedBatchId) {
      console.debug('[useBatchSync] No selectedBatchId, skipping refresh');
      return;
    }

    // Defensive check: validate selectedBatchId
    if (typeof selectedBatchId !== 'string' || selectedBatchId.trim() === '') {
      console.warn('[useBatchSync] Invalid selectedBatchId:', selectedBatchId);
      return;
    }

    const now = Date.now();
    // Throttle refreshes to once per 2 seconds
    if (now - lastSyncRef.current < 2000) return;
    lastSyncRef.current = now;

    try {
      const data = await MeetingSyncService.getBatchWithRelations(selectedBatchId);
      
      // Defensive checks: validate response data
      if (!data) {
        console.error('[useBatchSync] getBatchWithRelations returned null or undefined during refresh');
        return;
      }

      // Validate arrays before updating
      const validMeetings = Array.isArray(data.meetings) ? data.meetings : [];
      const validStudents = Array.isArray(data.students) ? data.students : [];
      const validAssignments = Array.isArray(data.teacherAssignments) ? data.teacherAssignments : [];

      updateBatchData(selectedBatchId, {
        meetings: validMeetings,
        students: validStudents,
        teacherAssignments: validAssignments,
      });
    } catch (error) {
      console.error(`[useBatchSync] Error refreshing batch data for ${selectedBatchId}:`, error);
    }
  }, [selectedBatchId, updateBatchData]);

  /**
   * Initialize batch data on component mount
   */
  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  /**
   * Load batch data when selected batch changes
   */
  useEffect(() => {
    if (selectedBatchId) {
      loadBatchData(selectedBatchId);
    }
  }, [selectedBatchId, loadBatchData]);

  /**
   * Set up real-time sync polling
   */
  useEffect(() => {
    if (selectedBatchId) {
      // Initial refresh
      refreshBatchData();

      // Set up polling for real-time updates
      syncIntervalRef.current = setInterval(() => {
        refreshBatchData();
      }, 5000); // Refresh every 5 seconds

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [selectedBatchId, refreshBatchData]);

  /**
   * Create a meeting and sync
   */
  const createMeeting = useCallback(
    async (meetingData: any, creatorRole: 'admin' | 'teacher') => {
      try {
        setIsSyncing(true);
        await MeetingSyncService.createMeeting(meetingData, creatorRole);
        // Refresh batch data after creating meeting
        await refreshBatchData();
      } catch (error) {
        console.error('Error creating meeting:', error);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshBatchData, setIsSyncing]
  );

  /**
   * Update meeting and sync
   */
  const updateMeeting = useCallback(
    async (meetingId: string, updateData: any) => {
      try {
        setIsSyncing(true);
        await MeetingSyncService.updateMeeting(meetingId, updateData);
        // Refresh batch data after updating meeting
        await refreshBatchData();
      } catch (error) {
        console.error('Error updating meeting:', error);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshBatchData, setIsSyncing]
  );

  /**
   * Delete meeting and sync
   */
  const deleteMeeting = useCallback(
    async (meetingId: string) => {
      try {
        setIsSyncing(true);
        await MeetingSyncService.deleteMeeting(meetingId);
        // Refresh batch data after deleting meeting
        await refreshBatchData();
      } catch (error) {
        console.error('Error deleting meeting:', error);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshBatchData, setIsSyncing]
  );

  /**
   * Assign teacher to batch and sync
   */
  const assignTeacherToBatch = useCallback(
    async (teacherId: string, batchId: string, adminId: string) => {
      try {
        setIsSyncing(true);
        await MeetingSyncService.assignTeacherToBatch(teacherId, batchId, adminId);
        // Reload batches to reflect new assignment
        await loadBatches();
      } catch (error) {
        console.error('Error assigning teacher:', error);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [loadBatches, setIsSyncing]
  );

  /**
   * Sync batch assignment (reassign/remove teacher)
   */
  const syncBatchAssignment = useCallback(
    async (batchId: string, oldTeacherId: string | null, newTeacherId: string, adminId: string) => {
      try {
        setIsSyncing(true);
        await MeetingSyncService.syncBatchAssignment(batchId, oldTeacherId, newTeacherId, adminId);
        // Reload batches to reflect changes
        await loadBatches();
      } catch (error) {
        console.error('Error syncing batch assignment:', error);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [loadBatches, setIsSyncing]
  );

  return {
    // State
    selectedBatchId,
    batches,
    meetings,
    students,
    teacherAssignments,
    isLoading,
    isSyncing,

    // Actions
    setSelectedBatch,
    loadBatches,
    loadBatchData,
    refreshBatchData,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    assignTeacherToBatch,
    syncBatchAssignment,
  };
};
