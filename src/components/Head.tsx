interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

export const Head = ({ 
  title = 'VR Robotics Academy - Master Robotics, Coding & AI',
  description = 'Learn robotics, VR development, and AI through hands-on projects. Join 2,500+ students at VR Robotics Academy.',
  keywords = 'robotics education, VR learning, coding for kids, STEM education',
  ogImage = 'https://static.wixstatic.com/media/39909b_3513a502b98941b4a18fedf184e5ae1e~mv2.png',
  ogUrl = 'https://vrroboticsacademy.com',
  twitterCard = 'summary_large_image'
}: HeadProps) => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#FF8C42" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={ogUrl} />
      
      {/* Fonts & Preconnect */}
      <link rel="preconnect" href="https://static.parastorage.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dicfqwlfq/image/upload/v1764506603/logo_vc6lpc.png" />
    </>
  );
};
