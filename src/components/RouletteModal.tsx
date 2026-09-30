'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Mail, Sparkles, Star, Moon, Heart, ArrowLeft } from 'lucide-react';
import { EmotionData, getRandomMessage } from '@/data/messages';

type ModalPhase = 'spinning' | 'stopping' | 'stopped' | 'opening' | 'revealed';

interface RouletteModalProps {
  emotion: EmotionData | null;
  onClose: () => void;
}



export default function RouletteModal({ emotion, onClose }: RouletteModalProps) {
  const [phase, setPhase] = useState<ModalPhase>('spinning');
  const [message, setMessage] = useState('');
  const [spinOffset, setSpinOffset] = useState(0);
  const spinSpeedRef = useRef(80);

  // Generate message when emotion changes
  useEffect(() => {
    if (emotion) {
      setMessage(getRandomMessage(emotion));
      setPhase('spinning');
      spinSpeedRef.current = 80;
      setSpinOffset(0);
    }
  }, [emotion]);

  // Lock body scroll
  useEffect(() => {
    if (emotion) {
      document.body.classList.add('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [emotion]);

  // Spinning animation loop
  useEffect(() => {
    if (phase !== 'spinning' && phase !== 'stopping') return;

    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;

      if (delta > 16) {
        setSpinOffset((prev) => prev + spinSpeedRef.current * (delta / 1000) * 60);
        lastTimestamp = timestamp;
      }

      if (phase === 'stopping') {
        spinSpeedRef.current *= 0.97;
        if (spinSpeedRef.current < 0.5) {
          setPhase('stopped');
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [phase]);

  const handleStop = useCallback(() => {
    if (phase === 'spinning') {
      setPhase('stopping');
    }
  }, [phase]);

  const handleOpenEnvelope = useCallback(() => {
    if (phase === 'stopped') {
      setPhase('opening');
      setTimeout(() => setPhase('revealed'), 800);
    }
  }, [phase]);

  const handleClose = useCallback(() => {
    setPhase('spinning');
    onClose();
  }, [onClose]);

  if (!emotion) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="roulette-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      >
        {/* Dark overlay with blur */}
        <div className="absolute inset-0 bg-[#1a103c]/80 backdrop-blur-sm" />

        {/* Floating background stars */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -50,
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                x: `calc(${Math.random() * 100}vw)`,
                y: `calc(100vh + 50px)`,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
              className="absolute text-pink-200"
            >
              <Star className="w-4 h-4 fill-current" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {/* Spinning/Stopping Phase */}
            {(phase === 'spinning' || phase === 'stopping') && (
              <motion.div
                key="roulette"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -30 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg flex flex-col items-center"
              >
                <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-2xl glass-card border border-pink-300/20 mb-8 bg-black/40">
                  <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#1a103c] to-transparent z-10" />
                  <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#1a103c] to-transparent z-10" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 border-x-2 border-pink-400/40 z-20 pointer-events-none" />

                  <div className="absolute inset-0 flex items-center">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const totalWidth = 20 * 90;
                      const position = ((i * 90 - spinOffset) % totalWidth + totalWidth) % totalWidth - 200;
                      return (
                        <div
                          key={i}
                          className="absolute flex flex-col items-center justify-center"
                          style={{ left: `${position}px`, width: '80px' }}
                        >
                          <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg bg-pink-900/40 border border-pink-300/20 flex items-center justify-center">
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-pink-200" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  onClick={handleStop}
                  disabled={phase === 'stopping'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-3 rounded-full font-serif-display text-sm tracking-widest
                    border transition-all duration-300
                    ${phase === 'stopping'
                      ? 'border-gray-500 text-gray-400 cursor-not-allowed bg-black/50'
                      : 'border-pink-400 text-pink-100 hover:bg-pink-500/20 bg-black/40'
                    }
                  `}
                >
                  {phase === 'stopping' ? 'Deteniendo...' : 'Detener'}
                </motion.button>
              </motion.div>
            )}

            {/* Stopped Phase */}
            {phase === 'stopped' && (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center"
              >
                <motion.div
                  onClick={handleOpenEnvelope}
                  whileHover={{ scale: 1.08, rotateZ: [0, -2, 2, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer relative mt-8 flex flex-col items-center"
                >
                  <div className="absolute inset-0 rounded-2xl bg-pink-500/30 blur-2xl animate-pulse" />
                  <div className="w-48 h-36 sm:w-64 sm:h-44 rounded-2xl border-2 border-pink-300/50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-900/60 to-purple-900/60 relative z-10 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                    <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-pink-200" />
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-6 font-serif-display text-xs sm:text-sm tracking-widest text-pink-200 uppercase"
                  >
                    Da click para abrir la carta
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {/* Opening Phase */}
            {phase === 'opening' && (
              <motion.div
                key="opening"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180, scale: [1, 1.1, 0.9] }}
                transition={{ duration: 0.8 }}
                className="w-48 h-36 sm:w-64 sm:h-44 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-900 to-purple-900"
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              >
                <Sparkles className="w-10 h-10 text-pink-300 animate-spin" />
              </motion.div>
            )}

            {/* Revealed Phase (The Book) */}
            {phase === 'revealed' && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-h-[100dvh] flex flex-col items-center py-4 sm:py-8 overflow-y-auto scrollbar-hide"
              >
                {/* Header title inside the flow */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center mb-4 sm:mb-6 shrink-0"
                >
                  <h3 className="font-serif-display text-sm md:text-base tracking-[0.3em] uppercase text-pink-200">
                    Carta del Alma
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-px w-8 bg-pink-300/50" />
                    <Star className="w-3 h-3 text-pink-300" />
                    <div className="h-px w-8 bg-pink-300/50" />
                  </div>
                </motion.div>

                {/* The Book */}
                <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] min-h-0 md:min-h-[450px] shrink-0">
                  {/* Left Page (Night Sky) */}
                  <div className="w-full md:w-1/2 min-h-[250px] md:min-h-full relative bg-[#110c22] p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 shrink-0 overflow-hidden">
                    {/* Fake moon/stars background inside the left page */}
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
                        <Moon className="w-16 h-16 text-yellow-100 fill-yellow-100/50" />
                      </div>
                      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                    </div>
                    
                    <div className="relative z-10 text-center mt-4 md:mt-10">
                      <p className="font-serif-display text-xs md:text-sm tracking-widest text-gray-300 uppercase mb-2">
                        Hoy sientes...
                      </p>
                      <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-pink-300 drop-shadow-lg">
                        {emotion.label}
                      </h2>
                    </div>

                    <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full text-center">
                      <p className="font-note text-xl md:text-2xl text-gray-300 rotate-[-5deg]">
                        Qué bonito<br/>sentir lo bonito
                      </p>
                    </div>
                  </div>

                  {/* Right Page (Paper Texture) */}
                  <div className="w-full md:w-1/2 bg-[#f8f3ef] p-6 sm:p-10 flex flex-col relative text-gray-800 shrink-0">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
                    
                    <div className="relative z-10 flex flex-col h-full min-h-[250px]">
                      <div className="text-center mb-4 sm:mb-6">
                        <h3 className="font-note text-2xl md:text-3xl text-purple-900 border-b border-purple-900/20 pb-1 inline-block px-4">
                          Una carta para ti
                        </h3>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center my-2">
                        <p className="font-serif-display text-sm sm:text-base leading-relaxed text-center text-gray-700">
                          {message}
                        </p>
                      </div>

                      <div className="mt-4 md:mt-6 text-center flex flex-col items-center">
                        <p className="font-note text-xl md:text-2xl text-purple-800">
                          Disfruta este momento,<br/>lo mereces.
                        </p>
                        <Heart className="w-4 h-4 md:w-5 md:h-5 mt-2 text-purple-800" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="mt-6 md:mt-8 mb-4 px-6 py-2 rounded-full border border-pink-300/30 font-serif-display text-sm tracking-widest text-pink-100 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver a explorar
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
