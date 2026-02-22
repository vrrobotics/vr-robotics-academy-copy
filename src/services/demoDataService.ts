import { BaseCrudService } from '@/integrations';
import { Users, Batches, TeacherAssignments } from '@/entities';

/**
 * Demo Data Service - Creates sample data for testing
 * Run this service to populate the CMS with demo data
 */
export class DemoDataService {
  /**
   * Create demo users with different roles
   */
  static async createDemoUsers(): Promise<Users[]> {
    const demoUsers: Users[] = [
      {
        _id: 'user-admin-001',
        fullName: 'Admin User',
        email: 'admin@vr-robotics.com',
        role: 'admin',
        department: 'Administration',
        phoneNumber: '+1-555-0001',
        dateOfBirth: new Date('1985-01-15'),
        profilePicture: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=admin-avatar'
      },
      {
        _id: 'user-teacher-001',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@vr-robotics.com',
        role: 'teacher',
        department: 'Robotics',
        phoneNumber: '+1-555-0002',
        dateOfBirth: new Date('1990-03-22'),
        profilePicture: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=teacher-avatar-1'
      },
      {
        _id: 'user-teacher-002',
        fullName: 'Michael Chen',
        email: 'michael.chen@vr-robotics.com',
        role: 'teacher',
        department: 'VR Development',
        phoneNumber: '+1-555-0003',
        dateOfBirth: new Date('1988-07-10'),
        profilePicture: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=teacher-avatar-2'
      },
      {
        _id: 'user-student-001',
        fullName: 'Alex Rodriguez',
        email: 'alex.rodriguez@student.com',
        role: 'student',
        department: 'Students',
        phoneNumber: '+1-555-0004',
        dateOfBirth: new Date('2008-05-14'),
        profilePicture: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=student-avatar-1'
      },
      {
        _id: 'user-student-002',
        fullName: 'Emma Wilson',
        email: 'emma.wilson@student.com',
        role: 'student',
        department: 'Students',
        phoneNumber: '+1-555-0005',
        dateOfBirth: new Date('2009-11-28'),
        profilePicture: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=student-avatar-2'
      }
    ];

    const createdUsers: Users[] = [];

    for (const user of demoUsers) {
      try {
        await BaseCrudService.create('users', user);
        createdUsers.push(user);
        console.log(`[DemoDataService] Created user: ${user.fullName} (${user.role})`);
      } catch (error) {
        console.warn(`[DemoDataService] User may already exist: ${user.fullName}`, error);
      }
    }

    return createdUsers;
  }

  /**
   * Create demo batches
   */
  static async createDemoBatches(): Promise<Batches[]> {
    const demoBatches: Batches[] = [
      {
        _id: 'batch-001',
        batchName: 'Robotics Basics - Batch A',
        batchLevel: 'Beginner',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15'),
        batchStatus: 'active',
        assignedTeacherName: 'Sarah Johnson'
      },
      {
        _id: 'batch-002',
        batchName: 'Advanced Robotics - Batch B',
        batchLevel: 'Intermediate',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-04-20'),
        batchStatus: 'active',
        assignedTeacherName: 'Michael Chen'
      },
      {
        _id: 'batch-003',
        batchName: 'VR Game Development - Batch C',
        batchLevel: 'Advanced',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-01'),
        batchStatus: 'pending',
        assignedTeacherName: 'Michael Chen'
      }
    ];

    const createdBatches: Batches[] = [];

    for (const batch of demoBatches) {
      try {
        await BaseCrudService.create('batches', batch);
        createdBatches.push(batch);
        console.log(`[DemoDataService] Created batch: ${batch.batchName}`);
      } catch (error) {
        console.warn(`[DemoDataService] Batch may already exist: ${batch.batchName}`, error);
      }
    }

    return createdBatches;
  }

  /**
   * Create demo teacher batch assignments
   */
  static async createDemoTeacherAssignments(): Promise<TeacherAssignments[]> {
    const demoAssignments: TeacherAssignments[] = [
      {
        _id: 'assignment-001',
        teacherId: 'user-teacher-001',
        batchId: 'batch-001',
        syncStatus: 'synced',
        assignmentDate: new Date('2024-01-15'),
        assignedByUserId: 'user-admin-001',
        isActive: true
      },
      {
        _id: 'assignment-002',
        teacherId: 'user-teacher-002',
        batchId: 'batch-002',
        syncStatus: 'synced',
        assignmentDate: new Date('2024-01-20'),
        assignedByUserId: 'user-admin-001',
        isActive: true
      },
      {
        _id: 'assignment-003',
        teacherId: 'user-teacher-002',
        batchId: 'batch-003',
        syncStatus: 'pending',
        assignmentDate: new Date('2024-02-01'),
        assignedByUserId: 'user-admin-001',
        isActive: false
      }
    ];

    const createdAssignments: TeacherAssignments[] = [];

    for (const assignment of demoAssignments) {
      try {
        await BaseCrudService.create('teacherassignments', assignment);
        createdAssignments.push(assignment);
        console.log(`[DemoDataService] Created teacher assignment: ${assignment._id}`);
      } catch (error) {
        console.warn(`[DemoDataService] Assignment may already exist: ${assignment._id}`, error);
      }
    }

    return createdAssignments;
  }

  /**
   * Create all demo data
   */
  static async createAllDemoData(): Promise<{
    users: Users[];
    batches: Batches[];
    assignments: TeacherAssignments[];
  }> {
    console.log('[DemoDataService] Starting demo data creation...');

    try {
      const users = await this.createDemoUsers();
      const batches = await this.createDemoBatches();
      const assignments = await this.createDemoTeacherAssignments();

      console.log('[DemoDataService] Demo data creation completed successfully');
      console.log(`[DemoDataService] Created ${users.length} users, ${batches.length} batches, ${assignments.length} assignments`);

      return { users, batches, assignments };
    } catch (error) {
      console.error('[DemoDataService] Error creating demo data:', error);
      throw error;
    }
  }

  /**
   * Clear all demo data (use with caution!)
   */
  static async clearDemoData(): Promise<void> {
    console.warn('[DemoDataService] WARNING: Clearing all demo data!');

    const demoUserIds = [
      'user-admin-001',
      'user-teacher-001',
      'user-teacher-002',
      'user-student-001',
      'user-student-002'
    ];

    const demoBatchIds = ['batch-001', 'batch-002', 'batch-003'];
    const demoAssignmentIds = ['assignment-001', 'assignment-002', 'assignment-003'];

    try {
      // Delete users
      for (const userId of demoUserIds) {
        try {
          await BaseCrudService.delete('users', userId);
          console.log(`[DemoDataService] Deleted user: ${userId}`);
        } catch (error) {
          console.warn(`[DemoDataService] Could not delete user: ${userId}`, error);
        }
      }

      // Delete batches
      for (const batchId of demoBatchIds) {
        try {
          await BaseCrudService.delete('batches', batchId);
          console.log(`[DemoDataService] Deleted batch: ${batchId}`);
        } catch (error) {
          console.warn(`[DemoDataService] Could not delete batch: ${batchId}`, error);
        }
      }

      // Delete assignments
      for (const assignmentId of demoAssignmentIds) {
        try {
          await BaseCrudService.delete('teacherassignments', assignmentId);
          console.log(`[DemoDataService] Deleted assignment: ${assignmentId}`);
        } catch (error) {
          console.warn(`[DemoDataService] Could not delete assignment: ${assignmentId}`, error);
        }
      }

      console.log('[DemoDataService] Demo data cleared successfully');
    } catch (error) {
      console.error('[DemoDataService] Error clearing demo data:', error);
      throw error;
    }
  }
}
