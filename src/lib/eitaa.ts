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
}

const getWebApp = (): EitaaWebApp | undefined => {
  try {
    return (window as unknown as { Eitaa?: { WebApp?: EitaaWebApp } }).Eitaa?.WebApp;
  } catch {
    return undefined;
  }
};

export const isEitaa = (): boolean => Boolean(getWebApp());

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
