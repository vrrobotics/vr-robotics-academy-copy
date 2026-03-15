/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: admissionprocesssteps
 * Interface for AdmissionProcessSteps
 */
export interface AdmissionProcessSteps {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  stepNumber?: number;
  title?: string;
  description?: string;
  illustration?: string;
  callToActionText?: string;
  callToActionUrl?: string;
}


/**
 * Collection ID: assignments
 * Interface for Assignments
 */
export interface Assignments {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  title?: string;
  description?: string;
  instructions?: string;
  dueDate?: Date | string;
  maxPoints?: number;
  submissionType?: string;
}


/**
 * Collection ID: assignmentsubmissions
 * Interface for AssignmentSubmissions
 */
export interface AssignmentSubmissions {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  assignmentId?: string;
  studentId?: string;
  submittedOn?: Date | string;
  submissionContent?: string;
  submissionUrl?: string;
  grade?: number;
  instructorFeedback?: string;
}


/**
 * Collection ID: attendance
 * Interface for AttendanceRecords
 */
export interface AttendanceRecords {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  attendanceDate?: Date | string;
  studentName?: string;
  batchIdentifier?: string;
  attendanceStatus?: string;
  teacherNotes?: string;
}


/**
 * Collection ID: badges
 * Interface for Badges
 */
export interface Badges {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  badgeName?: string;
  description?: string;
  badgeImage?: string;
  pointsRequired?: number;
  isActive?: boolean;
}


/**
 * Collection ID: batches
 * Interface for Batches
 */
export interface Batches {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  batchName?: string;
  batchLevel?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  batchStatus?: string;
  assignedTeacherName?: string;
}


/**
 * Collection ID: certificateexamples
 * Interface for CertificateExamples
 */
export interface CertificateExamples {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  certificateName?: string;
  certificateImage?: string;
  awardedFor?: string;
  recipientType?: string;
  issuingAuthority?: string;
  certificateDescription?: string;
}


/**
 * Collection ID: coursebatches
 * Interface for CourseBatches
 */
export interface CourseBatches {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  batchName?: string;
  courseLevel?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
  studentCapacity?: number;
}


/**
 * Collection ID: coursemodules
 * Interface for CourseModules
 */
export interface CourseModules {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  courseId?: string;
  title?: string;
  description?: string;
  orderNumber?: number;
  estimatedDuration?: string;
  isPublished?: boolean;
}


/**
 * Collection ID: courses
 * Interface for Courses
 */
export interface Courses {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  title?: string;
  description?: string;
  price?: number;
  instructorName?: string;
  thumbnail?: string;
  courseVideoUrl?: string;
}


/**
 * Collection ID: curriculummodules
 * Interface for CurriculumModules
 */
export interface CurriculumModules {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  classCount?: number;
  gradeLevel?: string;
  conceptCount?: number;
  projectCount?: number;
  moduleName?: string;
  moduleNumber?: number;
  cardImage?: string;
  shortDescription?: string;
  detailedDescription?: string;
  learningOutcomes?: string;
  difficultyLevel?: string;
}


/**
 * Collection ID: demosessions
 * Interface for DemoSessions
 */
export interface DemoSessions {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  childName?: string;
  childAge?: number;
  preferredDate?: Date | string;
  preferredTime?: any;
  status?: string;
  teacherId?: string;
}


/**
 * Collection ID: enrollments
 * Interface for Enrollments
 */
export interface Enrollments {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  userId?: string;
  courseId?: string;
  enrollmentDate?: Date | string;
  status?: string;
  completionDate?: Date | string;
  progress?: number;
  paymentStatus?: string;
}


/**
 * Collection ID: featuredcourses
 * Interface for FeaturedCourses
 */
export interface FeaturedCourses {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  courseId?: string;
  courseName?: string;
  description?: string;
  courseImage?: string;
  videoUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}


/**
 * Collection ID: gamemissions
 * Interface for GameMissions
 */
export interface GameMissions {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  missionName?: string;
  missionDescription?: string;
  missionOrder?: number;
  missionImage?: string;
  rewardXP?: number;
  unlockConditionDescription?: string;
  challengeType?: string;
}


/**
 * Collection ID: leaderboards
 * Interface for Leaderboards
 */
export interface Leaderboards {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  userId?: string;
  userName?: string;
  totalXp?: number;
  rank?: number;
  leaderboardMonth?: Date | string;
  lastUpdated?: Date | string;
}


/**
 * Collection ID: lessons
 * Interface for Lessons
 */
export interface Lessons {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  moduleId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoDuration?: number;
}


/**
 * Collection ID: lmsusers
 * Interface for LMSUsers
 */
export interface LMSUsers {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  dateJoined?: Date | string;
  lastLogin?: Date | string;
}


/**
 * Collection ID: meetings
 * Interface for Meetings
 */
export interface Meetings {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  teacherId?: string;
  timestamp?: Date | string;
  meetingTime?: any;
  meetingDate?: Date | string;
  meetingTitle?: string;
  createdBy?: string;
  title?: string;
  batchId?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  meetingLink?: string;
  location?: string;
  description?: string;
}


/**
 * Collection ID: minigames
 * Interface for MiniGames
 */
export interface MiniGames {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  title?: string;
  description?: string;
  gameType?: string;
  difficultyLevel?: number;
  previewImage?: string;
  playUrl?: string;
}


/**
 * Collection ID: notifications
 * Interface for Notifications
 */
export interface Notifications {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  senderName?: string;
  senderEmail?: string;
  userId?: string;
  title?: string;
  message?: string;
  notificationType?: string;
  isRead?: boolean;
  createdAt?: Date | string;
}


/**
 * Collection ID: payments
 * Interface for Payments
 */
export interface Payments {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  userId?: string;
  courseId?: string;
  amount?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: Date | string;
  currency?: string;
}


/**
 * Collection ID: programfees
 * Interface for ProgramFees
 */
export interface ProgramFees {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  planName?: string;
  price?: number;
  billingCycle?: string;
  shortDescription?: string;
  featuresSummary?: string;
  callToActionText?: string;
  isRecommended?: boolean;
}


/**
 * Collection ID: quizresults
 * Interface for QuizResults
 */
export interface QuizResults {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  quizId?: string;
  userId?: string;
  score?: number;
  quizAttemptDate?: Date | string;
  passed?: boolean;
  timeTakenSeconds?: number;
}


/**
 * Collection ID: quizzes
 * Interface for Quizzes
 */
export interface Quizzes {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  quizTitle?: string;
  courseId?: string;
  passingScore?: number;
  questionsData?: string;
  quizDurationMinutes?: number;
  attemptsAllowed?: number;
}


/**
 * Collection ID: robotavatarskins
 * Interface for RobotAvatarSkins
 */
export interface RobotAvatarSkins {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  skinName?: string;
  skinImage?: string;
  description?: string;
  unlockConditionType?: string;
  unlockConditionValue?: string;
  isDefaultSkin?: boolean;
}


/**
 * Collection ID: studentapprovals
 * Interface for StudentApprovals
 */
export interface StudentApprovals {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  fullname?: string;
  email?: string;
  phonenumber?: string;
  age?: number;
  gender?: string;
  submissiondate?: Date | string;
  status?: string;
  approvaldate?: Date | string;
  approvedbyadmin?: string;
  rejectionreason?: string;
  interests?: string;
}


/**
 * Collection ID: students
 * Interface for Students
 */
export interface Students {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date | string;
  enrollmentDate?: Date | string;
  batchId?: string;
}


/**
 * Collection ID: tasks
 * Interface for Tasks
 */
export interface Tasks {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  title?: string;
  description?: string;
  dueDate?: Date | string;
  status?: string;
  priority?: string;
}


/**
 * Collection ID: teacherapprovals
 * Interface for TeacherApprovals
 */
export interface TeacherApprovals {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  experience?: string;
  subject?: string;
  status?: string;
  submissionDate?: Date | string;
  approvalDate?: Date | string;
  approvedByAdmin?: string;
  rejectionReason?: string;
  submittedDocumentNames?: string;
}


/**
 * Collection ID: teacherassignments
 * Interface for TeacherAssignments
 */
export interface TeacherAssignments {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  teacherId?: string;
  batchId?: string;
  syncStatus?: string;
  assignmentDate?: Date | string;
  assignedByUserId?: string;
  isActive?: boolean;
}


/**
 * Collection ID: upcomingclasses
 * Interface for UpcomingClasses
 */
export interface UpcomingClasses {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  classTitle?: string;
  classDescription?: string;
  liveClassLink?: string;
  courseCategory?: string;
  difficultyLevel?: string;
  scheduledDateTime?: Date | string;
  assignedTeacherName?: string;
  assignedStudentNames?: string;
  notificationSent?: boolean;
}


/**
 * Collection ID: users
 * Interface for Users
 */
export interface Users {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  fullName?: string;
  joinDate?: Date | string;
  department?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
}


/**
 * Collection ID: xpgamificationevents
 * Interface for XPGamificationEvents
 */
export interface XPGamificationEvents {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  userId?: string;
  eventType?: string;
  pointsAwarded?: number;
  description?: string;
  eventDate?: Date | string;
}
