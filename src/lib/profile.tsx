import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { eitaaUser, requestPhone, type PhoneShare } from './eitaa';
import { readJSON, writeJSON } from './storage';

const PROFILE_KEY = 'emdad.profile';

interface StoredProfile {
  phone: string;
}

interface ProfileValue {
  name: string | null;
  phone: string | null;
  sharing: boolean;
  sharePhone: () => Promise<PhoneShare>;
  forgetPhone: () => void;
}

const ProfileContext = createContext<ProfileValue>({
  name: null,
  phone: null,
  sharing: false,
  sharePhone: async () => ({ ok: false, reason: 'unavailable' }),
  forgetPhone: () => undefined,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [name] = useState(() => eitaaUser()?.name ?? null);
  const [stored, setStored] = useState<StoredProfile | null>(() =>
    readJSON<StoredProfile | null>(PROFILE_KEY, null),
  );
  const [sharing, setSharing] = useState(false);

  const sharePhone = useCallback(async () => {
    setSharing(true);
    const result = await requestPhone();
    setSharing(false);
    if (result.ok) {
      const next = { phone: result.phone };
      writeJSON(PROFILE_KEY, next);
      setStored(next);
    }
    return result;
  }, []);

  const forgetPhone = useCallback(() => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
    setStored(null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{ name, phone: stored?.phone ?? null, sharing, sharePhone, forgetPhone }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
