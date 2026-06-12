import React, { createContext, useContext, useState, useEffect } from 'react';

export type PathwayType = 'Pregnancy' | 'Post-Loss';

interface PathwayContextType {
  activePathway: PathwayType;
  setActivePathway: (pathway: PathwayType) => void;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export function PathwayProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage to persist across reloads
  const [activePathway, setActivePathway] = useState<PathwayType>(() => {
    const saved = localStorage.getItem('mamacare-active-pathway');
    return (saved as PathwayType) || 'Pregnancy';
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mamacare-active-pathway', activePathway);
  }, [activePathway]);

  return (
    <PathwayContext.Provider value={{ activePathway, setActivePathway }}>
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
