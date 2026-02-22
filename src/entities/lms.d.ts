// LMS Entity Types
export interface LmsUser {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string; // 'Student', 'Teacher', 'Admin'
  profilePicture?: string;
  dateJoined?: Date;
  lastLogin?: Date;
}

export interface Course {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  title?: string;
  description?: string;
  price?: number;
  instructorName?: string;
  thumbnail?: string;
  courseVideoUrl?: string;
}

export interface CourseModule {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  courseId?: string;
  title?: string;
  description?: string;
  orderNumber?: number;
  estimatedDuration?: string;
  isPublished?: boolean;
}

export interface Lesson {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  moduleId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoDuration?: number;
}

export interface CourseBatch {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  batchName?: string;
  courseLevel?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
  studentCapacity?: number;
}

export interface Enrollment {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  userId?: string;
  courseId?: string;
  enrollmentDate?: Date | string;
  status?: string;
  completionDate?: Date | string;
  progress?: number;
  paymentStatus?: string;
}

export interface Assignment {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  title?: string;
  description?: string;
  instructions?: string;
  dueDate?: Date | string;
  maxPoints?: number;
  submissionType?: string;
}

export interface AssignmentSubmission {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  assignmentId?: string;
  studentId?: string;
  submittedOn?: Date | string;
  submissionContent?: string;
  submissionUrl?: string;
  grade?: number;
  instructorFeedback?: string;
}

export interface Quiz {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  quizTitle?: string;
  courseId?: string;
  passingScore?: number;
  questionsData?: string;
  quizDurationMinutes?: number;
  attemptsAllowed?: number;
}

export interface QuizResult {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  quizId?: string;
  userId?: string;
  score?: number;
  quizAttemptDate?: Date | string;
  passed?: boolean;
  timeTakenSeconds?: number;
}

export interface Payment {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  userId?: string;
  courseId?: string;
  amount?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: Date | string;
  currency?: string;
}

export interface XpGamificationEvent {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  userId?: string;
  eventType?: string;
  pointsAwarded?: number;
  description?: string;
  eventDate?: Date | string;
}

export interface Badge {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  badgeName?: string;
  description?: string;
  badgeImage?: string;
  pointsRequired?: number;
  isActive?: boolean;
}

export interface Leaderboard {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  userId?: string;
  userName?: string;
  totalXp?: number;
  rank?: number;
  leaderboardMonth?: Date | string;
  lastUpdated?: Date | string;
}

export interface Notification {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  userId?: string;
  title?: string;
  message?: string;
  notificationType?: string;
  isRead?: boolean;
  createdAt?: Date | string;
}
