/**
 * Course Progress Calculator
 * Calculates course completion percentage based on video watch progress
 */

interface Video {
  id: string;
  progress: number;
  watched: boolean;
}

interface CourseData {
  id: string;
  name: string;
  videos: Video[];
}

/**
 * Calculate the average progress of a course based on video watch progress
 * Only counts videos that have been started (progress > 0)
 * @param videos - Array of videos with progress data
 * @returns Average progress percentage (0-100) of started videos, or 0 if no videos started
 */
export function calculateCourseProgress(videos: Video[]): number {
  if (!videos || videos.length === 0) {
    return 0;
  }

  // Filter videos that have been started (progress > 0)
  const startedVideos = videos.filter(video => video.progress > 0);

  // If no videos have been started, return 0
  if (startedVideos.length === 0) {
    return 0;
  }

  // Calculate average progress only for started videos
  const totalProgress = startedVideos.reduce((sum, video) => sum + video.progress, 0);
  const averageProgress = totalProgress / startedVideos.length;

  return Math.round(averageProgress);
}

/**
 * Get course data with calculated progress
 * @param courseData - Course data object with videos
 * @returns Course data with calculated progress percentage
 */
export function getCourseWithProgress(courseData: CourseData) {
  return {
    ...courseData,
    progress: calculateCourseProgress(courseData.videos)
  };
}

/**
 * Get all courses with calculated progress
 * @param courseDataMap - Map of course IDs to course data
 * @returns Array of courses with calculated progress
 */
export function getCoursesWithProgress(courseDataMap: Record<string, CourseData>) {
  return Object.values(courseDataMap).map(course => ({
    ...course,
    progress: calculateCourseProgress(course.videos)
  }));
}
