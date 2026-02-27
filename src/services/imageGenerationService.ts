/**
 * AI Image Generation Service - Updated with Subject-Specific Images
 * Uses high-quality images that match the actual subject matter
 */

interface GenerateImageOptions {
  prompt: string;
  width?: number;
  height?: number;
  quality?: 'standard' | 'hd';
}

// Subject-specific image prompts for AI generation
export const admissionStepPrompts = {
  1: {
    title: 'Online Application',
    prompt: 'Modern computer interface with online application form, submission button, checkmarks, digital registration, clean white and blue interface, professional educational platform',
    keywords: 'application form, registration, online form, digital application'
  },
  2: {
    title: 'Demo Session',
    prompt: 'Student wearing VR headset experiencing virtual reality robotics learning, interactive VR environment, gaming controller, futuristic tech, neon lights, immersive experience',
    keywords: 'VR headset, virtual reality, VR gaming, immersive learning, interactive demo'
  },
  3: {
    title: 'Assessment & Feedback',
    prompt: 'Teacher or mentor providing feedback to student, digital dashboard with progress charts, learning assessment, development review, professional educational setting',
    keywords: 'teacher feedback, assessment, performance review, learning progress'
  },
  4: {
    title: 'Choose Your Program',
    prompt: 'Multiple program levels displayed as cards (Beginner, Intermediate, Advanced), colorful selection interface, choice options, program levels, educational paths',
    keywords: 'program selection, course levels, learning paths, program tiers'
  },
  5: {
    title: 'Welcome to VR Robotics',
    prompt: 'Diverse group of students collaborating with robots and VR technology, celebrating achievement, robotics lab, team building, technology innovation',
    keywords: 'student collaboration, robotics learning, team project, achievement celebration'
  }
};

/**
 * Generate image URLs using subject-specific sources
 * Maps each admission step to images that match its actual content
 */
export const generateImageUrl = (stepNumber: 1 | 2 | 3 | 4 | 5): string => {
  const imageMap: Record<number, string> = {
    // Step 1: Online Application
    1: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1772218716/ChatGPT_Image_Feb_28_2026_12_14_42_AM_eudnuh.png',

    // Step 2: Demo Session
    2: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1772218715/31ebc336-aaf1-49ab-92c2-72e62fae4771_ng8ab7.png',

    // Step 3: Assessment & Feedback
    3: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1772218760/aa440849-4faa-409e-8776-05d6f99e795d_x02zh6.png',

    // Step 4: Choose Your Program
    4: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1772218717/5417b775-4a14-4bd9-a0d5-a0ab94867a8f_ywttsu.png',

    // Step 5: Welcome to VR Robotics
    5: 'https://res.cloudinary.com/dicfqwlfq/image/upload/v1772218710/123c95ec-fd3b-4d62-b9c9-bbf79b9d0b6a_u8woel.png'
  };

  return imageMap[stepNumber] || 'https://via.placeholder.com/500x500?text=Step+' + stepNumber;
};

/**
 * Get better fallback images that match subject matter
 */
export const getFallbackImage = (stepNumber: 1 | 2 | 3 | 4 | 5): string => {
  const fallbackMap: Record<number, string> = {
    1: 'https://images.pexels.com/photos/7868889/pexels-photo-7868889.jpeg?auto=compress&cs=tinysrgb&w=1200',
    2: 'https://images.pexels.com/photos/7868888/pexels-photo-7868888.jpeg?auto=compress&cs=tinysrgb&w=1200',
    3: 'https://images.pexels.com/photos/7869085/pexels-photo-7869085.jpeg?auto=compress&cs=tinysrgb&w=1200',
    4: 'https://images.pexels.com/photos/7868883/pexels-photo-7868883.jpeg?auto=compress&cs=tinysrgb&w=1200',
    5: 'https://images.pexels.com/photos/7868882/pexels-photo-7868882.jpeg?auto=compress&cs=tinysrgb&w=1200'
  };

  return fallbackMap[stepNumber] || 'https://via.placeholder.com/500x500?text=Learning+Image';
};

/**
 * Get tertiary fallback - third option if both primary and secondary fail
 */
export const getTertiaryFallbackImage = (stepNumber: 1 | 2 | 3 | 4 | 5): string => {
  const tertiaryMap: Record<number, string> = {
    1: 'https://images.pexels.com/photos/7868894/pexels-photo-7868894.jpeg?auto=compress&cs=tinysrgb&w=1200',
    2: 'https://images.pexels.com/photos/7869239/pexels-photo-7869239.jpeg?auto=compress&cs=tinysrgb&w=1200',
    3: 'https://images.pexels.com/photos/7868886/pexels-photo-7868886.jpeg?auto=compress&cs=tinysrgb&w=1200',
    4: 'https://images.pexels.com/photos/7869086/pexels-photo-7869086.jpeg?auto=compress&cs=tinysrgb&w=1200',
    5: 'https://images.pexels.com/photos/7868889/pexels-photo-7868889.jpeg?auto=compress&cs=tinysrgb&w=1200'
  };

  return tertiaryMap[stepNumber] || 'https://via.placeholder.com/500x500?text=Learning';
};

/**
 * Validate image URL availability
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0;
  } catch (error) {
    console.warn('Image validation failed:', url, error);
    return false;
  }
};

/**
 * Get all image sources for a step in priority order
 */
export const getAllImageSources = (stepNumber: 1 | 2 | 3 | 4 | 5): string[] => {
  return [
    generateImageUrl(stepNumber),      // Primary
    getFallbackImage(stepNumber),      // Secondary
    getTertiaryFallbackImage(stepNumber) // Tertiary
  ];
};

export default {
  generateImageUrl,
  getFallbackImage,
  getTertiaryFallbackImage,
  validateImageUrl,
  getAllImageSources,
  admissionStepPrompts
};
