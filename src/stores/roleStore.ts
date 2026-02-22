import { create } from 'zustand';

export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export interface RoleState {
  // Current user role
  currentRole: UserRole;
  
  // User ID for role context
  userId: string | null;
  
  // Department (for teachers/admins)
  department: string | null;
  
  // Join date
  joinDate: Date | null;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  setRole: (role: UserRole) => void;
  setUserId: (userId: string | null) => void;
  setDepartment: (department: string | null) => void;
  setJoinDate: (date: Date | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Initialize role from user data
  initializeRole: (userId: string, role: UserRole, department?: string, joinDate?: Date) => void;
  
  // Clear role data
  clearRole: () => void;
  
  // Check if user has specific role
  hasRole: (role: UserRole) => boolean;
  
  // Check if user is admin
  isAdmin: () => boolean;
  
  // Check if user is teacher
  isTeacher: () => boolean;
  
  // Check if user is student
  isStudent: () => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  currentRole: 'guest',
  userId: null,
  department: null,
  joinDate: null,
  isLoading: false,
  error: null,

  setRole: (role: UserRole) => {
    set({ currentRole: role });
    console.log(`[RoleStore] Role set to: ${role}`);
  },

  setUserId: (userId: string | null) => {
    set({ userId });
  },

  setDepartment: (department: string | null) => {
    set({ department });
  },

  setJoinDate: (date: Date | null) => {
    set({ joinDate: date });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initializeRole: (userId: string, role: UserRole, department?: string, joinDate?: Date) => {
    set({
      userId,
      currentRole: role,
      department: department || null,
      joinDate: joinDate || null,
      isLoading: false,
      error: null
    });
    console.log(`[RoleStore] Initialized role for user ${userId}: ${role}`);
  },

  clearRole: () => {
    set({
      currentRole: 'guest',
      userId: null,
      department: null,
      joinDate: null,
      isLoading: false,
      error: null
    });
    console.log('[RoleStore] Role cleared');
  },

  hasRole: (role: UserRole) => {
    return get().currentRole === role;
  },

  isAdmin: () => {
    return get().currentRole === 'admin';
  },

  isTeacher: () => {
    return get().currentRole === 'teacher';
  },

  isStudent: () => {
    return get().currentRole === 'student';
  }
}));
