import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PathwayType = 'Pregnancy' | 'Postnatal' | 'Post-Loss';

interface PathwayContextType {
  activePathway: PathwayType;
  setActivePathway: (pathway: PathwayType) => void;
  isSwitching: boolean;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export function PathwayProvider({ children }: { children: React.ReactNode }) {
  const [activePathway, setActivePathwayState] = useState<PathwayType>(() => {
    const saved = localStorage.getItem('mamacare-active-pathway');
    return (saved as PathwayType) || 'Pregnancy';
  });
  const [isSwitching, setIsSwitching] = useState(false);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mamacare-active-pathway', activePathway);
  }, [activePathway]);

  // Auto-reset switching state after a timeout (allows navigation + data fetch)
  useEffect(() => {
    if (!isSwitching) return;
    const timer = setTimeout(() => setIsSwitching(false), 2000);
    return () => clearTimeout(timer);
  }, [isSwitching]);

  const setActivePathway = useCallback((pathway: PathwayType) => {
    setIsSwitching(true);
    setActivePathwayState(pathway);
  }, []);

  return (
    <PathwayContext.Provider value={{ activePathway, setActivePathway, isSwitching }}>
      {children}
    </PathwayContext.Provider>
  );
}

export function usePathway() {
  const context = useContext(PathwayContext);
  if (context === undefined) {
    throw new Error('usePathway must be used within a PathwayProvider');
  }
  return context;
}
