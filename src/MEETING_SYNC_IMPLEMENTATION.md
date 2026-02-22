# Meeting and Batch Sync Implementation Guide

## Overview
This document describes the meeting and batch synchronization system for the VR Robotics Academy LMS. The system enables real-time synchronization of meetings and batch assignments across Admin, Teacher, and Student portals.

## Architecture

### Collections
1. **Meetings** - Enhanced with new fields for batch and creator tracking
2. **Batches** - Existing collection, linked to meetings and teacher assignments
3. **TeacherAssignments** - New collection tracking teacher-batch relationships
4. **Students** - New collection tracking student-batch relationships

### Services

#### MeetingSyncService (`/src/services/meetingSyncService.ts`)
Core service handling all meeting and batch synchronization operations:

**Meeting Operations:**
- `createMeeting(meetingData, creatorRole)` - Create meeting (admin or teacher)
- `getMeetingsByBatch(batchId)` - Get meetings for a batch
- `getMeetingsByTeacher(teacherId)` - Get meetings created by teacher
- `getAdminMeetingsByBatch(batchId)` - Get admin-created meetings for batch
- `updateMeeting(meetingId, updateData)` - Update meeting
- `deleteMeeting(meetingId)` - Delete meeting

**Batch Assignment Operations:**
- `assignTeacherToBatch(teacherId, batchId, adminId)` - Assign teacher to batch
- `getBatchesByTeacher(teacherId)` - Get batches assigned to teacher
- `getTeachersByBatch(batchId)` - Get teachers assigned to batch
- `updateAssignmentSyncStatus(assignmentId, syncStatus)` - Update sync status
- `removeTeacherFromBatch(assignmentId)` - Remove teacher from batch
- `syncBatchAssignment(batchId, oldTeacherId, newTeacherId, adminId)` - Sync batch reassignment

**Student Operations:**
- `getStudentsByBatch(batchId)` - Get students in batch
- `getMeetingsForStudentBatch(studentBatchId)` - Get meetings for student's batch

**Unified Operations:**
- `getBatchWithRelations(batchId)` - Get batch with all related data (meetings, students, assignments)

### State Management

#### useBatchSyncStore (`/src/stores/batchSyncStore.ts`)
Zustand store managing batch sync state:
- `selectedBatchId` - Currently selected batch
- `batches` - List of batches
- `meetings` - Meetings for selected batch
- `students` - Students in selected batch
- `teacherAssignments` - Teacher assignments for selected batch
- `isLoading` - Loading state
- `isSyncing` - Sync operation state

### Custom Hook

#### useBatchSync (`/src/hooks/useBatchSync.ts`)
React hook providing batch sync functionality:

**State:**
- `selectedBatchId` - Current batch ID
- `batches` - Available batches
- `meetings` - Batch meetings
- `students` - Batch students
- `teacherAssignments` - Batch teacher assignments
- `isLoading` - Initial load state
- `isSyncing` - Sync operation state

**Actions:**
- `setSelectedBatch(batchId)` - Change selected batch
- `loadBatches()` - Load batches (filtered by role)
- `loadBatchData(batchId)` - Load data for specific batch
- `refreshBatchData()` - Refresh batch data (throttled)
- `createMeeting(meetingData, creatorRole)` - Create and sync meeting
- `updateMeeting(meetingId, updateData)` - Update and sync meeting
- `deleteMeeting(meetingId)` - Delete and sync meeting
- `assignTeacherToBatch(teacherId, batchId, adminId)` - Assign teacher
- `syncBatchAssignment(batchId, oldTeacherId, newTeacherId, adminId)` - Sync reassignment

**Real-time Sync:**
- Automatic polling every 5 seconds
- Throttled refresh (max once per 2 seconds)
- Automatic data refresh on batch selection change

## Usage Examples

### Teacher Portal
```typescript
// In TeacherDashboardPage
const {
  selectedBatchId,
  batches,
  meetings,
  isLoading,
  isSyncing,
  setSelectedBatch,
  createMeeting,
} = useBatchSync(user?.id, false);

// Change batch
const handleBatchChange = (batchId: string) => {
  setSelectedBatch(batchId);
};

// Create meeting
const handleCreateMeeting = async (meetingData) => {
  await createMeeting(meetingData, 'teacher');
};
```

### Admin Portal
```typescript
// In AdminDashboardPage
const {
  batches,
  meetings,
  isLoading,
  isSyncing,
  syncBatchAssignment,
} = useBatchSync(undefined, true);

// Reassign teacher to batch
const handleReassignTeacher = async (batchId, oldTeacherId, newTeacherId) => {
  await syncBatchAssignment(batchId, oldTeacherId, newTeacherId, user?.id);
};
```

### Student Portal
```typescript
// In StudentDashboardNewPage
const {
  meetings,
  isLoading,
} = useBatchSync(user?.batchId, false);

// Meetings are automatically loaded for student's batch
// Display meetings in calendar or list
```

## Data Structure

### Meetings Collection Fields
```typescript
{
  _id: string;                    // Unique ID
  title?: string;                 // Meeting title (legacy)
  meetingTitle?: string;          // Meeting title (new)
  startTime?: Date | string;      // Start time (legacy)
  meetingDate?: Date | string;    // Meeting date (new)
  meetingTime?: string;           // Meeting time (new)
  endTime?: Date | string;        // End time (legacy)
  meetingLink?: string;           // Meeting link/URL
  location?: string;              // Physical location
  description?: string;           // Meeting description
  batchId?: string;               // Associated batch ID
  createdBy?: string;             // Creator ('admin' or user ID)
  teacherId?: string;             // Teacher ID (for teacher-created meetings)
  timestamp?: Date | string;      // Creation timestamp
  _createdDate?: Date;            // System created date
  _updatedDate?: Date;            // System updated date
}
```

### TeacherAssignments Collection Fields
```typescript
{
  _id: string;                    // Unique ID
  teacherId?: string;             // Teacher ID
  batchId?: string;               // Batch ID
  syncStatus?: string;            // 'synced' | 'pending' | 'error'
  assignmentDate?: Date | string; // Assignment creation date
  assignedByUserId?: string;      // Admin who created assignment
  isActive?: boolean;             // Whether assignment is active
  _createdDate?: Date;            // System created date
  _updatedDate?: Date;            // System updated date
}
```

### Students Collection Fields
```typescript
{
  _id: string;                    // Unique ID
  firstName?: string;             // Student first name
  lastName?: string;              // Student last name
  email?: string;                 // Student email
  dateOfBirth?: Date | string;    // Date of birth
  enrollmentDate?: Date | string; // Enrollment date
  batchId?: string;               // Batch ID
  _createdDate?: Date;            // System created date
  _updatedDate?: Date;            // System updated date
}
```

## Real-time Sync Behavior

### Admin Creates Meeting
1. Admin creates meeting with `batchId` and `createdBy: 'admin'`
2. Meeting appears in Teacher Portal with "Added by Admin" label
3. Meeting appears in Student Portal for that batch
4. Real-time refresh updates all portals

### Teacher Creates Meeting
1. Teacher creates meeting with `batchId` and `teacherId`
2. Meeting appears in Teacher Portal immediately
3. Meeting appears in Student Portal for that batch
4. Meeting appears in Admin Portal
5. Real-time refresh updates all portals

### Admin Assigns Teacher to Batch
1. Admin creates TeacherAssignment with `isActive: true`
2. Teacher's batch dropdown updates in real-time
3. Teacher sees new batch in portal
4. All related meetings sync to teacher

### Admin Reassigns Teacher
1. Old assignment marked `isActive: false`
2. New assignment created with `isActive: true`
3. Old teacher loses access to batch
4. New teacher gains access to batch
5. All portals update in real-time

### Admin Removes Teacher
1. Assignment marked `isActive: false`
2. Teacher loses access to batch
3. Batch removed from teacher's dropdown
4. All portals update in real-time

## Integration Points

### TeacherDashboardPage
- Uses `useBatchSync(user?.id, false)` for teacher-specific batches
- Batch dropdown populated from `batches` state
- Meetings filtered by selected batch
- Real-time updates every 5 seconds

### AdminDashboardPage
- Uses `useBatchSync(undefined, true)` for all batches
- Can create meetings with `createMeeting(data, 'admin')`
- Can manage teacher assignments with `syncBatchAssignment()`
- Real-time updates every 5 seconds

### StudentDashboardNewPage
- Uses `useBatchSync(user?.batchId, false)` for student's batch
- Meetings automatically loaded for student's batch
- Real-time updates every 5 seconds

## Error Handling

All service methods include error handling:
- Errors are logged to console
- Errors are re-thrown for component handling
- Sync status can be set to 'error' for failed operations
- UI shows loading/syncing states during operations

## Performance Considerations

1. **Polling Interval:** 5 seconds for real-time updates
2. **Throttling:** Refresh throttled to once per 2 seconds
3. **Batch Filtering:** Teachers only see assigned batches
4. **Data Caching:** Zustand store caches batch data
5. **Selective Updates:** Only selected batch data is refreshed

## Future Enhancements

1. WebSocket integration for true real-time updates
2. Optimistic updates for better UX
3. Conflict resolution for concurrent edits
4. Batch notifications for new meetings
5. Meeting reminders and notifications
6. Attendance tracking integration
7. Meeting recording storage

## Testing

### Unit Tests
- Test MeetingSyncService methods
- Test useBatchSync hook
- Test store actions

### Integration Tests
- Test admin creating meeting
- Test teacher creating meeting
- Test batch assignment sync
- Test real-time updates

### E2E Tests
- Test complete admin workflow
- Test complete teacher workflow
- Test complete student workflow
- Test real-time sync across portals

## Troubleshooting

### Meetings not appearing
1. Check `batchId` is set correctly
2. Verify batch exists in database
3. Check `createdBy` field is populated
4. Verify user role is correct

### Batch dropdown not updating
1. Check `TeacherAssignments` collection
2. Verify `isActive` flag is true
3. Check `teacherId` matches user ID
4. Verify `syncStatus` is 'synced'

### Real-time updates not working
1. Check browser console for errors
2. Verify polling interval is running
3. Check network requests in DevTools
4. Verify data is being returned from API

## Related Files
- `/src/services/meetingSyncService.ts` - Core sync service
- `/src/stores/batchSyncStore.ts` - Zustand store
- `/src/hooks/useBatchSync.ts` - React hook
- `/src/components/pages/TeacherDashboardPage.tsx` - Teacher portal
- `/src/components/pages/AdminDashboardPage.tsx` - Admin portal
- `/src/components/pages/StudentDashboardNewPage.tsx` - Student portal
- `/src/entities/index.ts` - Entity type definitions
