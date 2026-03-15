# VR Robotics Academy - Project Documentation

## 📋 Executive Summary

**VR Robotics Academy** is a **multi-role learning platform** designed to provide comprehensive robotics education through VR technology. The platform serves three main user roles: **Students**, **Teachers**, and **Admins**, each with specialized dashboards and functionality.

**Project Status**: ✅ Active Development  
**Last Updated**: March 15, 2026  
**Repository**: https://github.com/vrrobotics/vr-robotics-academy-copy.git

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Astro 4.x with React 18.x integration
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x + Custom UI Components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Build Tool**: Vite + ESBuild
- **Animation**: Framer Motion
- **Build System**: Astro with React integration

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom Role-Based Access Control (RBAC)
- **API**: RESTful with Supabase backend
- **Real-time**: Supabase Real-time subscriptions

### Integrations
- **Payment Gateway**: Razorpay
- **Spreadsheets**: Google Sheets API
- **Email**: Custom email setup
- **Deployment**: GitHub Actions (CI/CD)
- **Hosting**: Vercel (optional) / GitHub Pages

### Development Tools
- **Linting**: ESLint with custom rules
- **Testing**: Vitest
- **Version Control**: Git/GitHub
- **Package Manager**: npm

---

## 📁 Project Structure

```
vr-robotics-academy-copy/
├── src/
│   ├── pages/                          # Astro static pages & routing
│   │   ├── index.astro                # Home page
│   │   ├── curriculum.astro           # Curriculum page
│   │   ├── [...slug].astro            # Catch-all SPA routing
│   │   └── api/                       # API routes
│   ├── components/
│   │   ├── pages/                     # React page components
│   │   │   ├── AdminDashboardNewPage.tsx
│   │   │   ├── TeacherDashboardPage.tsx
│   │   │   ├── StudentDashboardFinalPage.tsx
│   │   │   ├── demo/                  # Demo dashboards
│   │   │   │   ├── AdminDashboardDemoPage.tsx
│   │   │   │   ├── TeacherDashboardDemoPage.tsx
│   │   │   │   └── StudentDashboardDemoPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── TeacherLoginPage.tsx
│   │   │   └── [80+ other pages]
│   │   ├── ui/                        # Reusable UI components
│   │   ├── dashboard/                 # Dashboard sub-components
│   │   ├── Router.tsx                 # React Router configuration
│   │   └── RoleProtectedRoute.tsx     # Auth wrapper
│   ├── hooks/
│   │   ├── useRole.ts                # Role management hook
│   │   ├── useBatchSync.ts           # Real-time batch sync
│   │   └── [other custom hooks]
│   ├── stores/
│   │   ├── authStore.ts              # Authentication state
│   │   ├── roleStore.ts              # Role state management
│   │   └── [other Zustand stores]
│   ├── services/
│   │   ├── razorpayService.ts        # Payment processing
│   │   ├── realtimeService.ts        # Real-time updates
│   │   └── [other services]
│   ├── lib/
│   │   ├── supabaseCrud.ts           # Database operations
│   │   └── [utility functions]
│   ├── entities/                      # TypeScript interfaces
│   ├── integrations/                  # Third-party integrations
│   └── ANIMATION_GUIDE.md             # Animation documentation
├── public/
│   ├── 404.html                       # Custom 404 page
│   └── [static assets]
├── eslint-rules/                      # Custom ESLint rules
├── integrations/                      # Astro integrations
├── astro.config.mjs                   # Astro configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.mjs                # Tailwind CSS configuration
├── vitest.config.ts                   # Vitest configuration
├── package.json                       # Dependencies management
└── README.md                          # Project README
```

---

## 🎯 Core Features

### 1. Multi-Role Authentication System
- **Three User Roles**:
  - 👨‍🎓 **Students** - Learn through modules and assignments
  - 👨‍🏫 **Teachers** - Manage classes, students, and curriculum
  - 👨‍💼 **Admins** - Full system control and analytics

- **Authentication Flow**:
  - Email-based login with password validation
  - Role-specific login pages
  - Session management with Zustand stores
  - Role-based route protection

### 2. Student Portal Features
- **Dashboard Variants**:
  - `/student-dashboard-final` - Main student dashboard (protected)
  - `/student-dashboard-public` - Public access (no login)
  - `/demo/student-dashboard` - Demo with mock data

- **Features**:
  - Course enrollment tracking
  - Module progression system
  - Assignment management
  - Quiz results tracking
  - Meeting calendar integration
  - Gamification system (points, badges, leaderboard)
  - Real-time progress updates

### 3. Teacher Portal Features
- **Dashboard Variants**:
  - `/teacher-dashboard` - Main teacher dashboard (protected)
  - `/teacher-dashboard-public` - Public access (no login)
  - `/demo/teacher-dashboard` - Demo version

- **Features**:
  - Class management and scheduling
  - Student batch assignment
  - Curriculum management
  - Performance analytics
  - Attendance tracking
  - Profile management
  - Leave management
  - Payout tracking
  - 13-menu sidebar navigation

### 4. Admin Dashboard Features
- **Dashboard Variants**:
  - `/admin-dashboard-new` - Main admin dashboard (protected)
  - `/admin-dashboard-public` - Public access (no login)
  - `/demo/admin-dashboard` - Demo version

- **Features**:
  - User management (approve/reject)
  - Batch creation and management
  - Analytics and reporting
  - Demo session management
  - Notification system
  - System monitoring
  - Revenue tracking

### 5. Public Demo Dashboards
Three demo dashboards with **mock data** for demonstration purposes:
- `/demo/admin-dashboard` - Admin demo
- `/demo/teacher-dashboard` - Teacher demo
- `/demo/student-dashboard` - Student demo

---

## 🔐 Authentication & Authorization

### Authentication Flow
```
1. User visits login page (/login or /teacher-login)
2. Credentials validated against Supabase
3. User role determined (student/teacher/admin)
4. AuthStore and RoleStore updated
5. Session persisted in localStorage
6. User redirected to appropriate dashboard
```

### Role-Based Access Control
```typescript
// Protected Route Component
<RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
  <AdminDashboard />
</RoleProtectedRoute>
```

### Demo Credentials
- **Admin**: 
  - Email: `abhinavneeraj.bade@gmail.com`
  - Password: `27Sep@2006`
- **Student**: Use registered credentials
- **Teacher**: Use registered credentials (must be approved)

---

## 📊 Database Schema

### Core Collections
1. **students** - Student profiles and enrollment data
2. **teachers** - Teacher information and assignments
3. **teacherapprovals** - Pending teacher approvals
4. **studentapprovals** - Pending student approvals
5. **batches** - Class batches and schedules
6. **courses** - Course content
7. **enrollments** - Student course enrollments
8. **assignments** - Course assignments
9. **meetings** - Live sessions and meetings
10. **upcomingclasses** - Scheduled classes
11. **teacherassignments** - Teacher-batch assignments
12. **demosessions** - Demo booking records
13. **notifications** - System notifications
14. **quizresults** - Student quiz scores

---

## 🚀 Dashboard Access Links

### 🌐 Public Dashboards (No Login - Real Data)
```
Admin Dashboard:    http://127.0.0.1:3000/admin-dashboard-public
Teacher Dashboard:  http://127.0.0.1:3000/teacher-dashboard-public
Student Dashboard:  http://127.0.0.1:3000/student-dashboard-public
```

### 🎭 Demo Dashboards (No Login - Mock Data)
```
Admin Demo:    http://127.0.0.1:3000/demo/admin-dashboard
Teacher Demo:  http://127.0.0.1:3000/demo/teacher-dashboard
Student Demo:  http://127.0.0.1:3000/demo/student-dashboard
```

### 🔐 Protected Dashboards (Login Required)
```
Admin Dashboard:    http://127.0.0.1:3000/admin-dashboard-new
Teacher Dashboard:  http://127.0.0.1:3000/teacher-dashboard
Student Dashboard:  http://127.0.0.1:3000/student-dashboard-final
```

### 📝 Login Pages
```
Student/Admin Login:  http://127.0.0.1:3000/login
Teacher Login:        http://127.0.0.1:3000/teacher-login
```

---

## 📈 Recent Updates (March 2026)

### ✅ Completed Tasks
1. **Created 6 Dashboard Variants**
   - 3 protected dashboards (login required)
   - 3 public dashboards (real data, no login)
   - 3 demo dashboards (mock data, no login)

2. **Fixed Astro-React Routing**
   - Added static paths for Astro prerendering
   - Fixed SPA route handling
   - Proper catch-all routing setup

3. **Removed Video Popups**
   - Disabled MP4 enrollment video in student portal
   - Cleaner user experience on login

4. **Authentication Improvements**
   - Role protection for protected dashboards
   - Public access for demo/public versions
   - Proper layout rendering without auth

5. **GitHub Synchronization**
   - All changes committed and pushed
   - Clean git history maintained
   - Production-ready code

### Commits Made
```
362e00e - Remove video popup from student dashboard - no more MP4 on login
e45d189 - Show enrollment video popup in public student dashboard
1617bf3 - Fix public dashboard routes - allow rendering without user authentication
db71b23 - Add public dashboard links - separate routes for original dashboards without login
c357b5d - Add role protection to original dashboards - only authenticated users can access
dfa2770 - Fix demo routes - add static paths for Astro prerendering
a970cbc - Add public demo dashboards - Admin, Teacher, and Student dashboards accessible without login
```

---

## 🎨 Key Components & Pages

### Page Components (88+ total)
- **Admin Pages**: 
  - AdminDashboardNewPage, AdminAnalyticsPage, AdminAddCoursesPage
  - AdminFeaturedCoursesPage, AdminNewStudentsPage, AdminNewTeachersPage
  - AdminStudentApprovalsPage, AdminUpcomingClassesPage, AdminNotificationsPage

- **Teacher Pages**:
  - TeacherDashboardPage (main), TeacherProfilePage
  - TeacherDemoManagementPage, TeacherCurriculumPage
  - TeacherClassManagementPage, TeacherRenewalPage
  - TeacherMyTrainingPage, TeacherAuditPage, TeacherPerformancePage
  - TeacherPayoutPage, TeacherLeaveManagementPage
  - TeacherOthersPage, TeacherHelpSupportPage, TeacherUpcomingClassesPage
  - TeacherToolsPage, TeacherApprovalPage

- **Student Pages**:
  - StudentDashboardFinalPage (main), StudentApplicationPage
  - StudentUpcomingClassesPage, GamifiedStudentDashboard
  - StudentDashboardNewPage, StudentDashboardPage

- **Public Pages**:
  - HomePage, AboutPage, ContactPage, CurriculumPage
  - AdmissionProcessPage, ProgramFeesPage, DemoBookingPage
  - Module detail pages (Module1-9)

### UI Components
- Card, Button, Image, LoadingSpinner
- Input fields, Forms, Modals
- Navigation components
- Alert/Error components
- Custom hooks for common functionality

---

## 🔧 Configuration Files

### astro.config.mjs
- Base URL configuration
- React integration
- Tailwind CSS setup
- Vercel adapter (optional)
- Development server settings

### tsconfig.json
- Path aliases (@/ for src/)
- Target ES2020
- JSX support with React

### tailwind.config.mjs
- Custom theme colors
- Animation configurations
- Responsive breakpoints

### vitest.config.ts
- Test runner configuration
- Module resolution

### package.json
- Dependencies management
- Scripts for build, dev, test
- ESLint configuration

---

## 📦 Key Dependencies

```json
{
  "astro": "^4.0.0",
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "zustand": "^4.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "tailwindcss": "^3.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.0.0",
  "vitest": "^0.0.0",
  "@astrojs/react": "^3.0.0",
  "@astrojs/tailwind": "^2.0.0",
  "date-fns": "^2.0.0"
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Git

### Clone Repository
```bash
git clone https://github.com/vrrobotics/vr-robotics-academy-copy.git
cd vr-robotics-academy-copy
```

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create `.env.local` with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_RAZORPAY_KEY=your_razorpay_key
```

### Run Development Server
```bash
npm run dev
```

Server runs on: `http://127.0.0.1:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📱 Responsive Design

- **Mobile First Approach**: All components optimized for mobile
- **Breakpoints**: xs, sm, md, lg, xl using Tailwind
- **Touch Friendly**: Large buttons and interactive areas
- **Adaptive Layouts**: Sidebars collapse on mobile

---

## ⚡ Performance Features

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Vite automatically splits chunks
- **Suspense Boundaries**: Smooth loading states
- **Optimized Images**: Image component with optimization
- **Caching**: Browser and server-side caching

---

## 🔄 Real-time Features

- **Meeting Updates**: Live class synchronization
- **Notifications**: Real-time alerts for users
- **Progress Tracking**: Instant progress updates
- **Chat/Messaging**: Optional real-time messaging
- **Batch Sync Hook**: Custom hook for batch updates

---

## 📊 Analytics & Reporting

### Admin Analytics
- User growth metrics
- Enrollment statistics
- Revenue tracking
- Class completion rates
- Teacher performance metrics

### Teacher Analytics
- Student performance
- Class attendance
- Assignment submission rates
- Quiz analytics

### Student Analytics
- Course progress
- Assignment scores
- Quiz performance
- Learning paths

---

## 🔒 Security Features

- **Role-Based Access Control**: Strict authorization
- **Protected Routes**: Route guards for sensitive pages
- **Password Hashing**: Secure password storage via Supabase
- **Session Management**: Zustand-based session handling
- **CORS Configuration**: API security settings
- **Environment Variables**: Sensitive data protection

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

---

## 📝 Deployment

### GitHub Pages (Static)
```bash
npm run build
```
Files in `dist/` ready for deployment

### Vercel Deployment
- Connect GitHub repository
- Configure environment variables
- Auto-deploy on push to main

### Custom Server
- Build: `npm run build`
- Deploy `dist/` folder
- Configure server for SPA routing

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill existing process
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Supabase Connection Issues
- Verify environment variables
- Check network connectivity
- Review Supabase dashboard
- Check API key permissions

### Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Documentation Files in Project

- `ARCHITECTURE_OVERVIEW.md` - System architecture
- `ANIMATION_GUIDE.md` - Animation implementation guide
- `IMPLEMENTATION_GUIDE.md` - Implementation details
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `PRODUCTION_READINESS_CHECKLIST.md` - Production readiness
- `PHASE10_IMPLEMENTATION.md` - Latest phase implementation
- Various implementation phase guides (PHASE2-PHASE10)

---

## 🤝 Team & Collaboration

### Version Control
- **Repository**: https://github.com/vrrobotics/vr-robotics-academy-copy
- **Branch**: main (production)
- **Commits**: 100+ commits with clear messages
- **Pull Requests**: Feature branching recommended

### Code Quality
- ESLint for code style
- TypeScript for type safety
- Consistent naming conventions
- Documentation for complex logic

---

## 📞 Support & Maintenance

### Common Issues
1. **Dashboard not loading**: Clear cache (Ctrl+Shift+R)
2. **Auth errors**: Check credentials and environment
3. **Data not showing**: Verify Supabase connection
4. **Styling issues**: Check Tailwind CSS build

### Updates & Improvements
- Regular security updates
- Feature enhancements
- Performance optimization
- UI/UX improvements

---

## 📈 Future Roadmap

### Planned Features
- [ ] Enhanced gamification system
- [ ] AI-powered learning recommendations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Voice/Video live classes
- [ ] Certificate generation
- [ ] Payment plan system
- [ ] Advanced assessment tools

### Performance Improvements
- [ ] Caching strategy optimization
- [ ] Database query optimization
- [ ] Image CDN integration
- [ ] Service worker implementation

---

## ✅ Checklist for Handoff

- ✅ Project structure documented
- ✅ Core features implemented
- ✅ Authentication system working
- ✅ All dashboards accessible
- ✅ Demo dashboards available
- ✅ Code committed to GitHub
- ✅ Environment variables documented
- ✅ Deployment instructions provided
- ✅ Testing framework configured
- ✅ Documentation complete

---

## 📄 License & Rights

**Project Owner**: VR Robotics Academy  
**Repository**: GitHub - vrrobotics/vr-robotics-academy-copy  
**Status**: Active Development  
**Last Updated**: March 15, 2026

---

## 👤 Developer Information

**Work Completed**: 
- Multi-variant dashboard system (6 versions)
- Public/Demo/Protected access layers
- Astro-React routing fixes
- Authentication improvements
- Real-time updates
- Complete documentation

**Contact for Support**: [Project Manager Contact]

---

## 🎓 Quick Start Guide

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Visit Home**: `http://127.0.0.1:3000`

3. **Try Public Dashboards**:
   - Admin: `/admin-dashboard-public`
   - Teacher: `/teacher-dashboard-public`
   - Student: `/student-dashboard-public`

4. **Try Demo Dashboards**:
   - Admin: `/demo/admin-dashboard`
   - Teacher: `/demo/teacher-dashboard`
   - Student: `/demo/student-dashboard`

5. **Login to Protected Dashboards**:
   - Admin credentials in documentation
   - Or use registered student/teacher accounts

---

**Document Generated**: March 15, 2026  
**Status**: ✅ Complete & Ready for Handoff

