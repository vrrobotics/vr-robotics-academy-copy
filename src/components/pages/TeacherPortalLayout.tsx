import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { 
  Home, Users, LogOut, ChevronRight, BookOpen, 
  FileText, Calendar, BarChart3, DollarSign, Clock, AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Image } from '@/components/ui/image';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  section?: string;
}

interface TeacherPortalLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export default function TeacherPortalLayout({ children, pageTitle }: TeacherPortalLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Subscribe to auth store changes to get real-time profile updates
  const profilePicture = useAuthStore((state) => state.user?.profilePicture);
  const fullName = useAuthStore((state) => state.user?.fullName);
  const email = useAuthStore((state) => state.user?.email);

  // ============================================================================
  // VALIDATE ROLE ON LOAD - Allow public access (no redirect)
  // ============================================================================
  useEffect(() => {
    console.log('[TeacherPortalLayout] Component mounted - Allow public access');
    
    // Allow public access - don't redirect if no user
    if (user) {
      console.log(`[TeacherPortalLayout] ✓ User loaded - teacherId: ${user.id}, role: ${user.role}`);
    } else {
      console.log('[TeacherPortalLayout] No user - showing public view');
    }
  }, [user, navigate]);

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, path: '/teacher-dashboard', section: 'main' },
    { id: 'profile', label: 'My Profile', icon: <Users className="w-5 h-5" />, path: '/teacher-profile', section: 'main' },
    { id: 'upcoming-classes', label: 'Upcoming Classes', icon: <Calendar className="w-5 h-5" />, path: '/teacher-upcoming-classes', section: 'main' },
    { id: 'demo', label: 'Demo Management', icon: <Calendar className="w-5 h-5" />, path: '/teacher-demo-management', section: 'main' },
    { id: 'curriculum', label: 'Curriculum', icon: <BookOpen className="w-5 h-5" />, path: '/teacher-curriculum', section: 'main' },
    { id: 'classes', label: 'Class Management', icon: <Users className="w-5 h-5" />, path: '/teacher-class-management', section: 'main' },
    { id: 'renewal', label: 'Renewal', icon: <Clock className="w-5 h-5" />, path: '/teacher-renewal', section: 'main' },
    { id: 'training', label: 'My Training', icon: <FileText className="w-5 h-5" />, path: '/teacher-my-training', section: 'main' },
    { id: 'audit', label: 'Audit', icon: <BarChart3 className="w-5 h-5" />, path: '/teacher-audit', section: 'main' },
    { id: 'performance', label: 'Performance', icon: <BarChart3 className="w-5 h-5" />, path: '/teacher-performance', section: 'main' },
    { id: 'payout', label: 'Payout', icon: <DollarSign className="w-5 h-5" />, path: '/teacher-payout', section: 'main' },
    { id: 'leave', label: 'Leave Management', icon: <Calendar className="w-5 h-5" />, path: '/teacher-leave-management', section: 'main' },
    { id: 'others', label: 'Others', icon: <AlertCircle className="w-5 h-5" />, path: '/teacher-others', section: 'support' },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, path: '/teacher-help-support', section: 'support' }
  ];

  // ============================================================================
  // NAVIGATION HANDLERS - Memoized to prevent unnecessary re-renders
  // ============================================================================
  const handleNavigate = useCallback((path: string, itemLabel: string) => {
    console.log(`[TeacherPortalLayout] Navigating to: ${path} (${itemLabel})`);
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    console.log('[TeacherPortalLayout] Logout clicked');
    logout();
    navigate('/');
  }, [logout, navigate]);

  // ============================================================================
  // ACTIVE MENU ITEM DETECTION
  // ============================================================================
  const isMenuItemActive = useCallback((path: string) => {
    const isActive = location.pathname === path;
    return isActive;
  }, [location.pathname]);

  // Allow public access - render even without user
  // if (!user) {
  //   console.warn('[TeacherPortalLayout] User is null, returning null');
  //   return null;
  // }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a2a4e] via-[#0f1a2e] to-[#0a0f1a] text-foreground flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-gradient-to-b from-[#1e3a5f] to-[#0f1a2e] border-r border-foreground/10 overflow-y-auto max-h-screen sticky top-0"
      >
        <div className="p-6 space-y-6 flex flex-col h-full">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 pb-6 border-b border-foreground/10"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary/40">
              {profilePicture ? (
                <Image src={profilePicture} alt={user?.fullName || 'User'} className="w-full h-full object-cover" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }} />
              ) : null}
              <span className={`font-heading text-xl text-background font-bold ${profilePicture ? 'hidden' : ''}`}>
                {(user?.fullName?.charAt(0) || fullName?.charAt(0) || 'T').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg text-foreground truncate">{fullName || user?.fullName || 'Teacher'}</h3>
              <p className="font-paragraph text-xs text-foreground/60">{email || user?.email || 'Public View'}</p>
            </div>
          </motion.div>

          {/* Navigation Menu - Scrollable */}
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = isMenuItemActive(item.path);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleNavigate(item.path, item.label)}
                  type="button"
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group text-sm font-paragraph cursor-pointer ${
                    isActive
                      ? 'bg-primary/20 border border-primary/40 text-foreground'
                      : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={isActive ? 'text-primary' : 'text-foreground/60'}>
                      {item.icon}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />}
                </motion.button>
              );
            })}
          </nav>

          {/* Logout Button - Only show if user exists */}
          {user && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleLogout}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300 font-paragraph text-sm cursor-pointer"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              Logout
            </motion.button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-4xl text-foreground mb-2">
              {pageTitle}
            </h1>
            <p className="font-paragraph text-foreground/60">
              Teacher Portal
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
