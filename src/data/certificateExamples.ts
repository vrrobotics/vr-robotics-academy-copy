/**
 * Professional Certificate Examples Data
 * These are professionally designed certificate examples showcasing
 * different levels of achievement in VR Robotics Academy
 */

import { CertificateExamples } from '@/entities';

export const certificateExamplesData: Omit<CertificateExamples, '_id' | '_createdDate' | '_updatedDate'>[] = [];

/**
 * Helper function to add certificate examples to the database
 * Usage: Call this in a seed script or admin panel
 */
export const getCertificateExamplesForImport = (): Omit<CertificateExamples, '_id' | '_createdDate' | '_updatedDate'>[] => {
  return certificateExamplesData;
};
