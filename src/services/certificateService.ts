/**
 * Add Professional Certificate Examples to Supabase
 * 
 * Usage:
 * 1. Make sure you have supabase client configured
 * 2. Import this function and call it from the admin panel or a seed script
 * 3. The function will add 4 professional certificate examples to the database
 * 
 * Example:
 * import { addCertificateExamples } from '@/services/certificateService';
 * 
 * const result = await addCertificateExamples();
 * console.log('Certificates added:', result);
 */

import { BaseCrudService } from '@/integrations';
import { CertificateExamples } from '@/entities';
import { certificateExamplesData } from '@/data/certificateExamples';

/**
 * Adds professional certificate examples to the database
 * @returns Promise with success status and details
 */
export const addCertificateExamples = async (): Promise<{
  success: boolean;
  message: string;
  addedCount?: number;
  errors?: string[];
}> => {
  try {
    const results = [];
    const errors: string[] = [];

    for (const certData of certificateExamplesData) {
      try {
        const certificate: CertificateExamples = {
          _id: crypto.randomUUID(),
          _createdDate: new Date().toISOString(),
          _updatedDate: new Date().toISOString(),
          ...certData
        };

        const result = await BaseCrudService.create('certificateexamples', certificate);
        results.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to add ${certData.certificateName}: ${errorMessage}`);
      }
    }

    if (results.length === certificateExamplesData.length) {
      return {
        success: true,
        message: `Successfully added ${results.length} professional certificate examples!`,
        addedCount: results.length
      };
    } else {
      return {
        success: false,
        message: `Added ${results.length} of ${certificateExamplesData.length} certificates. Some failed.`,
        addedCount: results.length,
        errors
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: `Failed to add certificate examples: ${message}`,
      errors: [message]
    };
  }
};

/**
 * Clear existing certificates and add fresh examples
 * WARNING: This will delete all existing certificates!
 */
export const replaceCertificateExamples = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Fetch all existing certificates
    const { items } = await BaseCrudService.getAll<CertificateExamples>('certificateexamples');

    // Delete each certificate
    for (const cert of items) {
      await BaseCrudService.delete('certificateexamples', cert._id);
    }

    // Add new certificates
    const result = await addCertificateExamples();
    return {
      success: result.success,
      message: `Deleted ${items.length} old certificates and added ${result.addedCount} new ones. ${result.message}`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: `Failed to replace certificates: ${message}`
    };
  }
};

/**
 * Get preview of certificate examples without adding to database
 */
export const previewCertificateExamples = () => {
  return certificateExamplesData.map((cert, index) => ({
    number: index + 1,
    name: cert.certificateName,
    awardedFor: cert.awardedFor,
    recipientType: cert.recipientType,
    issuingAuthority: cert.issuingAuthority,
    description: cert.certificateDescription
  }));
};
