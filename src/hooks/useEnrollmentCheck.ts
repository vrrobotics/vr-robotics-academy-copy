import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Enrollments } from '@/entities';

export function useEnrollmentCheck(userId: string | undefined) {
  const [hasEnrollments, setHasEnrollments] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setHasEnrollments(null);
      return;
    }

    const checkEnrollments = async () => {
      try {
        setIsLoading(true);
        const { items } = await BaseCrudService.getAll<Enrollments>('enrollments');
        
        // Filter enrollments for the current user
        const userEnrollments = items.filter(enrollment => enrollment.userId === userId);
        
        setHasEnrollments(userEnrollments.length > 0);
      } catch (error) {
        console.error('Error checking enrollments:', error);
        setHasEnrollments(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnrollments();
  }, [userId]);

  return { hasEnrollments, isLoading };
}
