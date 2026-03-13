import { BaseCrudService } from '@/integrations';
import { Users } from '@/entities';
import { AuthUser } from '@/stores/authStore';

export interface TeacherSignupData {
  email: string;
  fullName: string;
  password: string;
  phoneNumber?: string;
  department?: string;
}

export interface TeacherLoginData {
  email: string;
  password: string;
}

class TeacherRegistrationService {
  /**
   * Check if a teacher email already exists in the database
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { items } = await BaseCrudService.getAll<Users>('users');
      return items.some(user => user.email?.toLowerCase() === email.toLowerCase() && user.role === 'teacher');
    } catch (error) {
      console.error('[TeacherRegistrationService] Error checking email:', error);
      return false;
    }
  }

  /**
   * Register a new teacher
   */
  async registerTeacher(signupData: TeacherSignupData): Promise<AuthUser> {
    try {
      // Check if email already exists
      const emailExists = await this.checkEmailExists(signupData.email);
      if (emailExists) {
        throw new Error('Email already registered. Please log in instead.');
      }

      // Create new teacher user with a guaranteed fullName
      const safeFullName = (signupData.fullName || '').trim() || signupData.email.split('@')[0];
      const newTeacher: Users = {
        _id: crypto.randomUUID(),
        fullName: safeFullName,
        email: signupData.email,
        role: 'teacher',
        phoneNumber: signupData.phoneNumber,
      };

      // Save to database (field names will be converted automatically by SupabaseCrudService)
      await BaseCrudService.create<Users>('users', newTeacher);

      console.log('[TeacherRegistrationService] ✓ Teacher registered successfully:', newTeacher.email);

      // Return auth user object
      return {
        id: newTeacher._id,
        email: newTeacher.email,
        fullName: newTeacher.fullName,
        role: 'teacher',
        phoneNumber: newTeacher.phoneNumber,
      };
    } catch (error) {
      console.error('[TeacherRegistrationService] Error registering teacher:', error);
      throw error;
    }
  }

  /**
   * Authenticate teacher login
   */
  async loginTeacher(loginData: TeacherLoginData): Promise<AuthUser> {
    try {
      const { items } = await BaseCrudService.getAll<Users>('users');
      
      // Find teacher by email and role
      const teacher = items.find(
        user => user.email?.toLowerCase() === loginData.email.toLowerCase() && user.role === 'teacher'
      );

      if (!teacher) {
        throw new Error('Teacher account not found. Please sign up first.');
      }

      console.log('[TeacherRegistrationService] ✓ Teacher login successful:', teacher.email);
      console.log('[TeacherRegistrationService] ✓ Loaded profile picture from database:', teacher.profilePicture);

      // Return auth user object with persisted profile picture
      return {
        id: teacher._id,
        email: teacher.email,
        fullName: teacher.fullName,
        role: 'teacher',
        phoneNumber: teacher.phoneNumber,
        profilePicture: teacher.profilePicture, // This will be loaded from database if it exists
      };
    } catch (error) {
      console.error('[TeacherRegistrationService] Error logging in teacher:', error);
      throw error;
    }
  }

  /**
   * Get teacher by email
   */
  async getTeacherByEmail(email: string): Promise<Users | null> {
    try {
      const { items } = await BaseCrudService.getAll<Users>('users');
      const teacher = items.find(
        user => user.email?.toLowerCase() === email.toLowerCase() && user.role === 'teacher'
      );
      return teacher || null;
    } catch (error) {
      console.error('[TeacherRegistrationService] Error getting teacher:', error);
      return null;
    }
  }

  /**
   * Get teacher by ID
   */
  async getTeacherById(teacherId: string): Promise<Users | null> {
    try {
      const teacher = await BaseCrudService.getById<Users>('users', teacherId);
      return teacher && teacher.role === 'teacher' ? teacher : null;
    } catch (error) {
      console.error('[TeacherRegistrationService] Error getting teacher by ID:', error);
      return null;
    }
  }

  /**
   * Update teacher profile
   */
  async updateTeacherProfile(teacherId: string, updates: Partial<Users>): Promise<Users> {
    try {
      const updated = await BaseCrudService.update<Users>('users', {
        _id: teacherId,
        ...updates,
      });
      console.log('[TeacherRegistrationService] ✓ Teacher profile updated:', teacherId);
      return updated;
    } catch (error) {
      console.error('[TeacherRegistrationService] Error updating teacher profile:', error);
      throw error;
    }
  }

  /**
   * Update teacher profile picture in database
   */
  async updateProfilePicture(teacherId: string, profilePictureUrl: string): Promise<Users> {
    try {
      const updated = await BaseCrudService.update<Users>('users', {
        _id: teacherId,
        profilePicture: profilePictureUrl,
      });
      console.log('[TeacherRegistrationService] ✓ Profile picture updated in database:', teacherId);
      return updated;
    } catch (error) {
      console.error('[TeacherRegistrationService] Error updating profile picture:', error);
      throw error;
    }
  }
}

export const teacherRegistrationService = new TeacherRegistrationService();
