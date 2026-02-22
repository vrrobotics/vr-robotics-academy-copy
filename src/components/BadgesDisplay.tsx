import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { BaseCrudService } from '@/integrations';
import { Badge } from '@/stores/gamificationStore';
import { Image } from '@/components/ui/image';

export default function BadgesDisplay() {
  const { badges, playerProgress, setBadges } = useGamificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Badge>('badges');
        setBadges(items);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load badges:', error);
        setLoading(false);
      }
    };

    if (badges.length === 0) {
      loadBadges();
    } else {
      setLoading(false);
    }
  }, [badges.length, setBadges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const earnedBadgeIds = playerProgress?.badges || [];
  const earnedBadges = badges.filter((b) => earnedBadgeIds.includes(b._id));
  const lockedBadges = badges.filter((b) => !earnedBadgeIds.includes(b._id));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">Achievements & Badges</h2>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <span className="text-primary mr-2">✓</span> Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge._id}
                className="relative rounded-lg overflow-hidden bg-primary/20 border-2 border-primary p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(255, 140, 66, 0.3)',
                      '0 0 20px rgba(255, 140, 66, 0.6)',
                      '0 0 10px rgba(255, 140, 66, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative z-10">
                  {badge.badgeImage && (
                    <Image
                      src={badge.badgeImage}
                      alt={badge.badgeName}
                      width={80}
                      height={80}
                      className="mx-auto mb-2"
                    />
                  )}
                  <h4 className="font-bold text-foreground text-sm">{badge.badgeName}</h4>
                  <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <span className="text-gray-500 mr-2">🔒</span> Locked Badges ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge._id}
                className="relative rounded-lg overflow-hidden bg-gray-700/20 border-2 border-gray-600 p-4 text-center opacity-60"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: (earnedBadges.length + index) * 0.05 }}
              >
                <div className="relative z-10">
                  {badge.badgeImage && (
                    <Image
                      src={badge.badgeImage}
                      alt={badge.badgeName}
                      width={80}
                      height={80}
                      className="mx-auto mb-2 grayscale"
                    />
                  )}
                  <h4 className="font-bold text-gray-400 text-sm">{badge.badgeName}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Earn {badge.pointsRequired} XP
                  </p>
                </div>

                {/* Lock Icon */}
                <div className="absolute top-2 right-2 bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  🔒
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {badges.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-400 text-lg">No badges available yet</p>
        </motion.div>
      )}
    </div>
  );
}
