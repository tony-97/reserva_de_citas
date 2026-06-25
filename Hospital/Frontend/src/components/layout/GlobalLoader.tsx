import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [progress, setProgress] = useState(0);

  const handleOnline = useCallback(() => setOffline(false), []);
  const handleOffline = useCallback(() => setOffline(true), []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  useEffect(() => {
    let cancelled = false;
    const steps = [10, 25, 45, 60, 75, 85, 95, 100];
    steps.forEach((pct, i) => {
      setTimeout(() => {
        if (!cancelled) setProgress(pct);
      }, (i + 1) * 150);
    });
    setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 1350);
    return () => { cancelled = true; };
  }, []);

  const showSplash = loading || offline;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-secondary-900 overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          >
            {!offline && (
              <div className="absolute inset-0 z-0">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover opacity-50"
                >
                  <source src="/cargando.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/40 via-secondary-900/60 to-secondary-900/90" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center px-4 text-center w-full"
            >
              {offline && (
                <svg width="80" height="80" viewBox="0 0 80 80" className="mb-6">
                  <motion.path
                    d="M40 8 L40 72 M8 40 L72 40"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M40 8 L40 72 M8 40 L72 40"
                    stroke="rgba(0,165,181,0.6)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
                  />
                </svg>
              )}

              <h1 className="text-white text-2xl font-bold tracking-tight mb-2">
                Hospital San Juan
              </h1>

              <motion.div
                animate={offline ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-6"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-red-400">
                  <motion.path
                    d="M16 4 L4 28 L28 28 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    animate={offline ? { fill: 'rgba(248,113,113,0.3)' } : {}}
                  />
                  <motion.circle
                    cx="16" cy="18" r="1.5"
                    fill="currentColor"
                    animate={offline ? { opacity: [1, 1, 0] } : { opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.line
                    x1="16" y1="10" x2="16" y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </svg>
              </motion.div>

              <p className="text-slate-300 text-sm mb-4">
                {offline
                  ? 'Sin conexión. Reintentando...'
                  : 'Preparando tu experiencia...'}
              </p>

              {!offline && (
                <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={showSplash ? 'invisible' : ''}>
        {children}
      </div>
    </>
  );
}