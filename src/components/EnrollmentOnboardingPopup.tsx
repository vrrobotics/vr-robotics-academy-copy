import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EnrollmentOnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentOnboardingPopup({ isOpen, onClose }: EnrollmentOnboardingPopupProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setVideoEnded(false);
      setShowPopup(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => setShowPopup(true), 500);
  };

  const handleEnrollNow = () => {
    navigate('/program-fees');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
          {/* Video Container */}
          {!videoEnded && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="https://res.cloudinary.com/dicfqwlfq/video/upload/v1764519355/VN20251130_214350_jrdsj8.mp4"
                  width="100%"
                  height="100%"
                  style={{ 
                    border: 'none', 
                    borderRadius: '8px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  autoPlay
                  controls
                  onEnded={handleVideoEnd}
                />
              </div>
            </motion.div>
          )}

          {/* Enrollment Popup */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-orange-500/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Content */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-heading font-bold text-white">
                        Ready to Start Learning?
                      </h2>
                      <p className="text-base font-paragraph text-gray-300">
                        Enroll a course to login and make your imagination real-world applications.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={handleEnrollNow}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Enroll Now
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full border-orange-500/30 text-white hover:bg-white/5"
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
