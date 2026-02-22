/**
 * Quick Script to Add Certificate Examples
 * 
 * Run this in your browser console or call it from your admin panel:
 * 
 * import { quickAddCertificates } from '@/utils/certificateQuickAdd';
 * await quickAddCertificates();
 */

import { BaseCrudService } from '@/integrations';
import { certificateExamplesData } from '@/data/certificateExamples';

/**
 * Quick add function that can be run from console
 */
export async function quickAddCertificates() {
  console.log('🚀 Starting to add professional certificate examples...');
  
  try {
    let addedCount = 0;

    for (const certData of certificateExamplesData) {
      try {
        const certificate = {
          _id: crypto.randomUUID(),
          _createdDate: new Date().toISOString(),
          _updatedDate: new Date().toISOString(),
          ...certData
        };

        await BaseCrudService.create('certificateexamples', certificate);
        addedCount++;
        console.log(`✅ Added: ${certData.certificateName}`);
      } catch (error) {
        console.error(`❌ Failed to add ${certData.certificateName}:`, error);
      }
    }

    const message = `🎉 Successfully added ${addedCount} professional certificates! The Certificates page will now display them.`;
    console.log(message);
    alert(message);
    
    // Reload page to see the new certificates
    window.location.reload();
    
    return { success: true, addedCount };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding certificates:', errorMsg);
    alert(`Error adding certificates: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Check existing certificates in database
 */
export async function checkExistingCertificates() {
  try {
    const { items } = await BaseCrudService.getAll('certificateexamples');
    console.log(`Found ${items.length} existing certificates:`, items);
    return items;
  } catch (error) {
    console.error('Error checking certificates:', error);
    return [];
  }
}

// Export as global for console access
if (typeof window !== 'undefined') {
  (window as any).certificateUtils = {
    quickAddCertificates,
    checkExistingCertificates
  };
  console.log('📋 Certificate utilities loaded. Use window.certificateUtils.quickAddCertificates() to add certificates');
}
