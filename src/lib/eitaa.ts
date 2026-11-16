interface BackButtonApi {
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
}

interface HapticApi {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

interface SafeArea {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface EitaaInitUser {
  id?: number;
  first_name?: string;
  last_name?: string;
}

interface EitaaWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  onEvent: (event: string, cb: () => void) => void;
  offEvent?: (event: string, cb: () => void) => void;
  openLink: (url: string) => void;
  addToHomeScreen?: () => void;
  BackButton: BackButtonApi;
  HapticFeedback: HapticApi;
  safeAreaInset?: SafeArea;
  contentSafeAreaInset?: SafeArea;
  initData?: string;
  initDataUnsafe?: { user?: EitaaInitUser };
  requestContact?: (cb: (ok: boolean, data?: { response?: string }) => void) => void;
}

export interface EitaaUser {
  name: string;
}

export type PhoneShare =
  | { ok: true; phone: string }
  | { ok: false; reason: 'unavailable' | 'declined' | 'unreadable' | 'timeout' };

const getWebApp = (): EitaaWebApp | undefined => {
  try {
    return (window as unknown as { Eitaa?: { WebApp?: EitaaWebApp } }).Eitaa?.WebApp;
  } catch {
    return undefined;
  }
};

export const isEitaa = (): boolean => {
  const wa = getWebApp();
  if (!wa) return false;
  // The SDK script defines window.Eitaa in ordinary browsers too, but only a
  // real Eitaa client supplies signed initData for the current user.
  return Boolean(wa.initData) || Boolean(wa.initDataUnsafe?.user);
};

export const haptic = (
  kind: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'select' = 'light',
): void => {
  const haptics = getWebApp()?.HapticFeedback;
  if (!haptics) return;
  try {
    if (kind === 'select') haptics.selectionChanged();
    else if (kind === 'success' || kind === 'warning' || kind === 'error') haptics.notificationOccurred(kind);
    else haptics.impactOccurred(kind);
  } catch {
    /* silently ignore outside Eitaa */
  }
};

const applyInsets = (wa: EitaaWebApp): void => {
  const safe = wa.safeAreaInset ?? {};
  const content = wa.contentSafeAreaInset ?? {};
  const root = document.documentElement;
  root.style.setProperty('--safe-top', `${(safe.top ?? 0) + (content.top ?? 0)}px`);
  root.style.setProperty('--safe-bottom', `${(safe.bottom ?? 0) + (content.bottom ?? 0)}px`);
  root.style.setProperty('--safe-left', `${(safe.left ?? 0) + (content.left ?? 0)}px`);
  root.style.setProperty('--safe-right', `${(safe.right ?? 0) + (content.right ?? 0)}px`);
};

export const initEitaa = (): boolean => {
  const wa = getWebApp();
  if (!wa) return false;
  try {
    wa.ready();
    wa.expand();
    wa.setHeaderColor('#ffffff');
    wa.setBackgroundColor('#f3f5f8');
    wa.setBottomBarColor?.('#ffffff');
    applyInsets(wa);
    wa.onEvent('safeAreaChanged', () => applyInsets(wa));
    wa.onEvent('contentSafeAreaChanged', () => applyInsets(wa));
    return true;
  } catch {
    return false;
  }
};

let activeBackHandler: (() => void) | null = null;

export const setNavBack = (visible: boolean, handler: () => void): void => {
  const wa = getWebApp();
  if (!wa?.BackButton) return;
  try {
    if (activeBackHandler) {
      wa.BackButton.offClick(activeBackHandler);
      activeBackHandler = null;
    }
    if (visible) {
      activeBackHandler = handler;
      wa.BackButton.onClick(handler);
      wa.BackButton.show();
    } else {
      wa.BackButton.hide();
    }
  } catch {
    /* noop */
  }
};

export const openExternal = (url: string): void => {
  const wa = getWebApp();
  if (wa) {
    try {
      wa.openLink(url);
      return;
    } catch {
      /* fall through */
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const closeApp = (): void => {
  const wa = getWebApp();
  try {
    wa?.close();
  } catch {
    /* noop */
  }
};

export const addToHome = (): boolean => {
  const wa = getWebApp();
  if (!wa?.addToHomeScreen) return false;
  try {
    wa.addToHomeScreen();
    return true;
  } catch {
    return false;
  }
};

export const eitaaUser = (): EitaaUser | null => {
  const user = getWebApp()?.initDataUnsafe?.user;
  const first = user?.first_name?.trim();
  if (!first) return null;
  const last = user?.last_name?.trim();
  return { name: last ? `${first} ${last}` : first };
};

const normalizePhone = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8) return null;
  if (digits.startsWith('98') && digits.length === 12) return `0${digits.slice(2)}`;
  if (digits.startsWith('0')) return digits;
  return digits.length === 10 ? `0${digits}` : digits;
};

const phoneFromContact = (raw?: string): string | null => {
  if (!raw) return null;

  const fromQuery = (text: string): string | null => {
    const params = new URLSearchParams(text);
    const direct = params.get('phone_number') ?? params.get('phone');
    if (direct) return normalizePhone(direct);
    const user = params.get('user');
    if (!user) return null;
    try {
      const parsed = JSON.parse(user) as Record<string, unknown>;
      const nested = parsed.phone_number ?? parsed.phone;
      return typeof nested === 'string' ? normalizePhone(nested) : null;
    } catch {
      return null;
    }
  };

  const queryPhone = fromQuery(raw);
  if (queryPhone) return queryPhone;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const direct = parsed.phone_number ?? parsed.phone;
    if (typeof direct === 'string') return normalizePhone(direct);
    const user = parsed.user as Record<string, unknown> | undefined;
    const nested = user?.phone_number ?? user?.phone;
    return typeof nested === 'string' ? normalizePhone(nested) : null;
  } catch {
    return null;
  }
};

const CONTACT_TIMEOUT_MS = 120000;

export const requestPhone = (): Promise<PhoneShare> =>
  new Promise((resolve) => {
    const wa = getWebApp();
    if (!wa?.requestContact) {
      resolve({ ok: false, reason: 'unavailable' });
      return;
    }

    let settled = false;
    let timer = 0;
    const finish = (result: PhoneShare) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(result);
    };
    timer = window.setTimeout(() => finish({ ok: false, reason: 'timeout' }), CONTACT_TIMEOUT_MS);

    try {
      wa.requestContact((ok, data) => {
        if (!ok) {
          finish({ ok: false, reason: 'declined' });
          return;
        }
        const phone = phoneFromContact(data?.response);
        finish(phone ? { ok: true, phone } : { ok: false, reason: 'unreadable' });
      });
    } catch {
      finish({ ok: false, reason: 'unavailable' });
    }
  });
