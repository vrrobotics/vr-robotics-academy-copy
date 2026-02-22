import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface OptimizedVideoPlayerProps {
  src: string;
  title: string;
  onClose: () => void;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
}

export const OptimizedVideoPlayer: React.FC<OptimizedVideoPlayerProps> = ({
  src,
  title,
  onClose,
  onProgress,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle video metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  // Handle time update with optimized progress tracking
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      onProgress?.(currentProgress);
    }
  }, [onProgress]);

  // Handle buffering progress
  const handleProgress = useCallback(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const bufferedPercent = (bufferedEnd / videoRef.current.duration) * 100;
      setBuffered(bufferedPercent);
    }
  }, []);

  // Handle video ended
  const handleEnded = useCallback(() => {
    setProgress(100);
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle mute/unmute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  // Handle seeking
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, [duration]);

  // Format time display
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle buffering state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-primary/80 hover:bg-primary rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-primary-foreground" />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-10 bg-black/60 px-4 py-2 rounded-lg backdrop-blur">
          <div className="font-heading text-sm text-primary">{title}</div>
        </div>

        {/* Video Container */}
        <div className="aspect-video relative bg-black">
          <video
            ref={videoRef}
            src={src}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onEnded={handleEnded}
            onWaiting={() => setIsBuffering(true)}
            onCanPlay={() => setIsBuffering(false)}
            className="w-full h-full"
            preload="auto"
            playsInline
            crossOrigin="anonymous"
          />

          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-foreground/70 font-paragraph">Buffering...</span>
              </div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && !isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="bg-black/60 px-6 py-4 backdrop-blur border-t border-foreground/10">
          {/* Buffered Progress Bar */}
          <div className="mb-3 relative h-1 bg-foreground/10 rounded-full overflow-hidden">
            {/* Buffered portion */}
            <div
              className="absolute h-full bg-foreground/30 rounded-full transition-all duration-100"
              style={{ width: `${buffered}%` }}
            />
            {/* Watched portion */}
            <motion.div
              className="absolute h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Seek Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-primary mb-3"
            style={{
              background: `linear-gradient(to right, rgb(255, 106, 0) 0%, rgb(255, 106, 0) ${progress}%, rgba(255, 255, 255, 0.1) ${progress}%, rgba(255, 255, 255, 0.1) 100%)`
            }}
          />

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Time Display */}
              <div className="text-sm text-foreground/70 font-paragraph">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </div>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OptimizedVideoPlayer;
