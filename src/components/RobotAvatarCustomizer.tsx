import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { BaseCrudService } from '@/integrations';
import { AvatarSkin } from '@/stores/gamificationStore';
import { Image } from '@/components/ui/image';

export default function RobotAvatarCustomizer() {
  const { avatarSkins, playerProgress, setAvatarSkins, setCurrentSkin } = useGamificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkins = async () => {
      try {
        const { items } = await BaseCrudService.getAll<AvatarSkin>('robotavatarskins');
        setAvatarSkins(items);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load avatar skins:', error);
        setLoading(false);
      }
    };

    if (avatarSkins.length === 0) {
      loadSkins();
    } else {
      setLoading(false);
    }
  }, [avatarSkins.length, setAvatarSkins]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentSkin = avatarSkins.find((skin) => skin._id === playerProgress?.currentAvatarSkin);
  const unlockedSkinIds = playerProgress?.unlockedSkins || [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">Robot Avatar</h2>

      {/* Current Avatar Display */}
      <motion.div
        className="bg-gradient-to-b from-primary/20 to-primary/5 rounded-lg p-8 mb-8 border border-primary/30 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {currentSkin?.skinImage && (
          <Image
            src={currentSkin.skinImage}
            alt={currentSkin.skinName}
            width={200}
            height={200}
            className="mx-auto mb-4 rounded-lg"
          />
        )}
        <h3 className="text-2xl font-bold text-primary">{currentSkin?.skinName}</h3>
        <p className="text-gray-400 mt-2">{currentSkin?.description}</p>
      </motion.div>

      {/* Available Skins */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Available Skins</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {avatarSkins.map((skin, index) => {
            const isUnlocked = unlockedSkinIds.includes(skin._id) || skin.isDefaultSkin;
            const isSelected = playerProgress?.currentAvatarSkin === skin._id;

            return (
              <motion.button
                key={skin._id}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentSkin(skin._id);
                  }
                }}
                disabled={!isUnlocked}
                className={`relative rounded-lg overflow-hidden transition-all ${
                  isUnlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'
                }`}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Border Glow */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 border-3 border-primary rounded-lg pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(255, 140, 66, 0.5)',
                        '0 0 20px rgba(255, 140, 66, 0.8)',
                        '0 0 10px rgba(255, 140, 66, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Skin Image */}
                <div className="bg-secondary-foreground p-4 aspect-square flex items-center justify-center border border-primary/20">
                  {skin.skinImage && (
                    <Image
                      src={skin.skinImage}
                      alt={skin.skinName}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Skin Name */}
                <div className="bg-primary/10 p-2 text-center">
                  <p className="text-sm font-semibold text-foreground truncate">{skin.skinName}</p>
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unlock: {skin.unlockConditionValue}
                    </p>
                  )}
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <motion.div
                    className="absolute top-2 right-2 bg-primary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
