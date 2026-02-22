import { useState, ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
  tertiaryFallback?: string;
};

export const Image = ({ fallback, tertiaryFallback, onError, onLoad, ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(props.src);
  const [loadAttempt, setLoadAttempt] = useState(0);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const newAttempt = loadAttempt + 1;
    setLoadAttempt(newAttempt);

    // Try primary image
    if (newAttempt === 1 && fallback && img.src !== fallback) {
      console.log(`Primary image failed for ${props.alt}, trying fallback: ${fallback}`);
      setImageSrc(fallback);
      img.src = fallback;
    }
    // Try fallback image
    else if (newAttempt === 2 && tertiaryFallback && img.src !== tertiaryFallback) {
      console.log(`Fallback image failed for ${props.alt}, trying tertiary: ${tertiaryFallback}`);
      setImageSrc(tertiaryFallback);
      img.src = tertiaryFallback;
    }
    // All images failed
    else {
      setIsLoading(false);
      console.error(`All image sources failed for: ${props.alt}`, {
        primary: props.src,
        fallback,
        tertiary: tertiaryFallback,
        lastAttempted: img.src
      });
      onError?.(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    console.log(`Image loaded successfully for: ${props.alt} from ${(e.target as HTMLImageElement).src}`);
    onLoad?.(e);
  };

  return (
    <img
      {...props}
      src={imageSrc}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        ...props.style,
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
};

export default Image;
