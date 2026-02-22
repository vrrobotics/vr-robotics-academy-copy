import { useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * DashboardRedirect - Redirects users to their role-appropriate dashboard
 * Used on /dashboard route to automatically route to correct dashboard
 */
export function DashboardRedirect() {
  const { currentRole, isLoading } = useRole();

  useEffect(() => {
    if (isLoading) return;

    // Redirect based on role
    const dashboardMap: Record<string, string> = {
      admin: '/admin-dashboard-new',
      teacher: '/teacher-dashboard-new',
      student: '/student-dashboard-final',
      guest: '/'
    };

    const targetPath = dashboardMap[currentRole] || '/';
    console.log(`[DashboardRedirect] Redirecting ${currentRole} to ${targetPath}`);
    window.location.href = targetPath;
  }, [currentRole, isLoading]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
