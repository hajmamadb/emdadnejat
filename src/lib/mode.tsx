import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Mode = 'public' | 'pro';

const MODE_KEY = 'emdad.mode';

const ModeContext = createContext<{ mode: Mode; setMode: (mode: Mode) => void }>({
  mode: 'public',
  setMode: () => undefined,
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    try {
      return localStorage.getItem(MODE_KEY) === 'pro' ? 'pro' : 'public';
    } catch {
      return 'public';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
