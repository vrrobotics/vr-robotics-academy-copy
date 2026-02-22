import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserRole } from '@/stores/roleStore';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * RoleProtectedRoute - Protects routes based on user role
 * Redirects unauthorized users to fallback path (default: home)
 * Shows loading spinner while checking role
 */
export function RoleProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = '/'
}: RoleProtectedRouteProps) {
  const navigate = useNavigate();
  const { currentRole, isLoading } = useRole();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const authorized = allowedRoles.includes(currentRole);
    setIsAuthorized(authorized);
    setHasChecked(true);

    if (!authorized) {
      console.warn(`[RoleProtectedRoute] Access denied for role: ${currentRole}. Allowed roles: ${allowedRoles.join(', ')}`);
      // Use navigate instead of window.location.href to avoid full page reload
      navigate(fallbackPath, { replace: true });
    }
  }, [currentRole, isLoading, allowedRoles, fallbackPath, navigate]);

  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
