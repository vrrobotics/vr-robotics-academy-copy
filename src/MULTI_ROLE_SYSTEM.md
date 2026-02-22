# VR Robotics Academy - Multi-Role System Documentation

## Overview

The VR Robotics Academy now features a complete multi-role authentication and management system with three distinct user roles: **Student**, **Teacher**, and **Admin**. Each role has a dedicated dashboard with specific features and permissions.

## System Architecture

### Database Collections

The system uses 5 main CMS collections:

#### 1. **Users Collection**
Stores user profiles for all roles
- `fullName` - User's full name
- `email` - Email address (login credential)
- `role` - User role (student, teacher, admin)
- `profilePicture` - User's profile image
- `phoneNumber` - Contact number
- `dateOfBirth` - User's DOB

#### 2. **Batches Collection**
Manages batch/class information
- `batchName` - Name of the batch
- `batchLevel` - Difficulty level (Beginner, Intermediate, Advanced)
- `startDate` - Batch start date
- `endDate` - Batch end date
- `batchStatus` - Current status (Active, Completed, Pending)
- `assignedTeacherName` - Teacher assigned to batch

#### 3. **Tasks Collection**
Tracks assignments and tasks
- `title` - Task title
- `description` - Detailed description
- `dueDate` - Due date for completion
- `status` - Task status (Pending, In Progress, Completed)
- `priority` - Priority level (Low, Medium, High)

#### 4. **Attendance Collection**
Records student attendance
- `attendanceDate` - Date of attendance record
- `studentName` - Student's name
- `batchIdentifier` - Batch ID
- `attendanceStatus` - Status (Present, Absent, Late, Excused)
- `teacherNotes` - Additional notes

#### 5. **Meetings Collection**
Schedules meetings and classes
- `title` - Meeting title
- `startTime` - Start date/time
- `endTime` - End date/time
- `meetingLink` - URL for virtual meetings
- `location` - Physical location
- `description` - Meeting agenda

## User Roles & Features

### 1. Student Dashboard (`/student-dashboard`)

**Features:**
- View personal batch information
- See assigned teacher details
- View list of batchmates
- Track assigned tasks with priority levels
- Monitor personal progress (modules completed, tasks done)
- View attendance record
- Access Google Calendar-style meeting scheduler
- Mark tasks as complete/incomplete

**Key Components:**
- Stats overview (modules, tasks, batchmates, progress)
- Task management with priority indicators
- Batchmate list with quick access
- Calendar with meeting schedule
- Progress tracking

**Demo Login:**
- Email: `student@example.com`
- Password: Any password

### 2. Teacher Dashboard (`/teacher-dashboard`)

**Features:**
- View assigned batch details
- Monitor student performance (attendance & progress)
- Create and manage tasks for batch
- Track student progress with visual indicators
- Manage class schedule
- Create and schedule meetings
- View attendance records
- Manage task assignments

**Key Components:**
- Batch information card
- Student performance metrics (attendance %, progress %)
- Student list with performance tracking
- Task management interface
- Calendar scheduler for classes
- Analytics overview

**Demo Login:**
- Email: `teacher@example.com`
- Password: Any password

### 3. Admin Dashboard (`/admin-dashboard`)

**Features:**
- System-wide analytics (total students, teachers, batches)
- Create new batches with teacher assignment
- Manage all batches (view, edit, delete)
- Monitor system completion rates
- Access system settings
- Global calendar for all batches
- User management
- Batch configuration
- Analytics & reports
- System logs

**Key Components:**
- Analytics overview (4 key metrics)
- Batch management interface with create functionality
- Batch list with status indicators
- System settings panel
- Global calendar scheduler
- Quick access to admin functions

**Demo Login:**
- Email: `admin@example.com`
- Password: Any password

## Authentication Flow

### Login Process

1. User navigates to `/login`
2. Selects their role (Student, Teacher, or Admin)
3. Enters email and password
4. System validates credentials (demo mode accepts any password)
5. User is authenticated and redirected to appropriate dashboard
6. Auth state is stored in Zustand store

### Auth Store (`/src/stores/authStore.ts`)

```typescript
interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  batchId?: string;
  profilePicture?: string;
}
```

### Protected Routes

Each dashboard is protected and checks:
- User authentication status
- User role matches dashboard type
- Redirects to login if not authenticated

## Calendar Scheduler Component

The `CalendarScheduler` component provides:

### Features:
- Monthly calendar view
- Meeting creation (for teachers/admins)
- Meeting display with time and location
- Navigation between months
- Visual indicators for days with meetings
- Meeting details popup

### Usage:
```tsx
<CalendarScheduler 
  meetings={meetings}
  onAddMeeting={handleAddMeeting}
  readOnly={false}
/>
```

### Props:
- `meetings` - Array of Meeting objects
- `onAddMeeting` - Callback when new meeting is created
- `readOnly` - Boolean to disable meeting creation

## Batch Management System

### Batch ID Format
Unique batch identifiers: `BATCH-YYYY-XXX`
- Example: `BATCH-2024-001`

### Batch Lifecycle
1. **Pending** - Batch created, waiting to start
2. **Active** - Batch is currently running
3. **Completed** - Batch has finished

### Batch Assignment
- Each batch has one assigned teacher
- Multiple students can be in same batch
- Batches have specific levels and schedules

## Design System Integration

### Color Scheme
- **Primary**: `#D8FF91` (Neon Green) - Main actions
- **Secondary**: `#FFD39E` (Neon Orange) - Secondary actions
- **Background**: `#191919` (Dark) - Main background
- **Foreground**: `#FFFFFF` (White) - Text

### Typography
- **Headings**: Space Grotesk font
- **Body**: Nunito Sans font

### UI Components
- Glassmorphism cards with backdrop blur
- Neon glow effects on interactive elements
- Smooth animations with Framer Motion
- Responsive grid layouts

## Demo Data

### Sample Batches
- BATCH-2024-001: Advanced Robotics - A (4 students)
- BATCH-2024-002: Beginner VR - B (6 students)
- BATCH-2024-003: Advanced AI - C (5 students)
- BATCH-2024-004: Game Dev - D (3 students)

### Sample Students
- Alex Johnson (Batch A)
- Emma Davis (Batch A)
- Liam Chen (Batch A)
- Sophia Rodriguez (Batch A)

### Sample Teachers
- Sarah Williams (Batch A)
- John Smith (Batch B)
- Emma Johnson (Batch C)
- Michael Chen (Batch D)

## Integration with Existing System

### Header Navigation
- Login button visible when not authenticated
- Dashboard button visible when authenticated
- Role-based dashboard link

### Footer
- Links to login page
- Contact information

## Future Enhancements

1. **Real Database Integration**
   - Connect to actual CMS collections
   - Implement real authentication
   - Store actual user data

2. **Advanced Features**
   - Student progress analytics
   - Attendance reports
   - Task submission system
   - Grade management
   - Parent portal

3. **Communication**
   - In-app messaging
   - Announcements system
   - Email notifications

4. **Mobile App**
   - Native mobile dashboards
   - Push notifications
   - Offline access

## File Structure

```
/src
├── stores/
│   └── authStore.ts              # Zustand auth store
├── components/
│   ├── CalendarScheduler.tsx     # Reusable calendar component
│   ├── Header.tsx                # Updated with auth
│   └── pages/
│       ├── LoginPage.tsx         # Multi-role login
│       ├── StudentDashboardNewPage.tsx
│       ├── TeacherDashboardPage.tsx
│       └── AdminDashboardPage.tsx
└── entities/
    └── index.ts                  # Updated with new collections
```

## Testing the System

### Test Credentials

**Student:**
- Email: `student@example.com`
- Password: `any`
- Role: Student

**Teacher:**
- Email: `teacher@example.com`
- Password: `any`
- Role: Teacher

**Admin:**
- Email: `admin@example.com`
- Password: `any`
- Role: Admin

### Test Workflows

1. **Student Workflow**
   - Login as student
   - View batch info and batchmates
   - Check tasks and mark complete
   - View calendar

2. **Teacher Workflow**
   - Login as teacher
   - View student performance
   - Create new meeting
   - Manage tasks

3. **Admin Workflow**
   - Login as admin
   - Create new batch
   - View system analytics
   - Access settings

## Security Considerations

### Current Implementation (Demo)
- Demo mode accepts any password
- Auth state stored in client-side Zustand store

### Production Implementation
- Implement proper authentication (OAuth, JWT)
- Hash passwords server-side
- Implement role-based access control (RBAC)
- Add session management
- Implement audit logging
- Add rate limiting on login

## Support & Troubleshooting

### Common Issues

**Dashboard not loading:**
- Check if user is authenticated
- Verify role matches dashboard type
- Clear browser cache

**Calendar not showing meetings:**
- Ensure meetings are created with proper dates
- Check date format (YYYY-MM-DD)

**Batch creation failing:**
- Verify all required fields are filled
- Check batch name uniqueness
- Ensure teacher name is valid

## Contact

For questions or issues with the multi-role system, contact the development team.
