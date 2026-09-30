'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Sun, CloudRain, Moon, Wind, Flame, Crown } from 'lucide-react';
import { emotions, EmotionData } from '@/data/messages';
import LandscapeBackground from '@/components/LandscapeBackground';
import RouletteModal from '@/components/RouletteModal';

const getIconAndColor = (key: string) => {
  switch (key) {
    case 'felicidad': return { icon: <Sun className="w-8 h-8 mb-2" />, color: 'text-yellow-400' };
    case 'tristeza': return { icon: <CloudRain className="w-8 h-8 mb-2" />, color: 'text-blue-400' };
    case 'pensiva': return { icon: <Moon className="w-8 h-8 mb-2" />, color: 'text-purple-400' };
    case 'ansiedad': return { icon: <Wind className="w-8 h-8 mb-2" />, color: 'text-teal-400' };
    case 'faltaMotivacion': return { icon: <Flame className="w-8 h-8 mb-2" />, color: 'text-rose-400' };
    case 'orgullo': return { icon: <Crown className="w-8 h-8 mb-2" />, color: 'text-amber-400' };
    default: return { icon: <Sun className="w-8 h-8 mb-2" />, color: 'text-white' };
  }
};

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionData | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden flex flex-col items-center justify-center py-12">
      <LandscapeBackground />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mt-8 md:mt-0">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-4 h-4 text-pink-300" />
            <h1 className="font-serif-display text-4xl md:text-5xl uppercase tracking-widest text-pink-100 drop-shadow-lg">
              ¿Cómo te sientes
            </h1>
            <Star className="w-4 h-4 text-pink-300" />
          </div>
          <h2 className="font-script text-6xl md:text-7xl text-pink-300 -mt-4 mb-4 drop-shadow-md">
            hoy?
          </h2>
          <p className="font-serif-display text-sm md:text-base text-gray-200 tracking-wide max-w-lg mx-auto drop-shadow-md">
            Elige el sentimiento que más se parezca a lo que vives ahora.<br />
            Hay una carta esperándote.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {emotions.map((emotion, idx) => {
            const { icon, color } = getIconAndColor(emotion.key);
            return (
              <motion.button
                key={emotion.key}
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.2 + idx * 0.1 },
                  scale: { duration: 0.6, delay: 0.2 + idx * 0.1 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEmotion(emotion)}
                className={`relative overflow-hidden rounded-2xl h-36 md:h-40 border border-white/20 shadow-2xl group flex flex-col items-center justify-center`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${emotion.bgImage})` }}
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                
                <div className={`relative z-10 flex flex-col items-center ${color}`}>
                  {icon}
                  <span className="font-serif-display uppercase tracking-widest text-sm font-bold drop-shadow-md">{emotion.label}</span>
                  <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
                    →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEmotion && (
          <RouletteModal
            emotion={selectedEmotion}
            onClose={() => setSelectedEmotion(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
