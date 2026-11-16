export type Route =
  | { name: 'home' }
  | { name: 'guides' }
  | { name: 'guide'; id: string }
  | { name: 'emergency' }
  | { name: 'numbers' }
  | { name: 'request' }
  | { name: 'checklist' }
  | { name: 'quiz' }
  | { name: 'about' };

const knownTopLevel = new Set(['guides', 'emergency', 'numbers', 'request', 'checklist', 'quiz', 'about']);

export const parseHash = (hash: string = window.location.hash): Route => {
  const raw = hash.replace(/^#\/?/, '');
  if (!raw) return { name: 'home' };
  const [head, tail] = raw.split('/');
  if (head === 'guide' && tail) return { name: 'guide', id: decodeURIComponent(tail) };
  if (head === 'guide') return { name: 'guides' };
  if (knownTopLevel.has(head)) return { name: head } as Route;
  return { name: 'home' };
};

export const toHash = (route: Route): string => {
  if (route.name === 'home') return '#/';
  if (route.name === 'guide') return `#/guide/${encodeURIComponent(route.id)}`;
  return `#/${route.name}`;
};

export const navigate = (route: Route, replace = false): void => {
  const hash = toHash(route);
  if (window.location.hash === hash) return;
  if (replace) {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = hash;
  }
};

export const parentOf = (route: Route): Route => {
  if (route.name === 'guide') return { name: 'guides' };
  return { name: 'home' };
};
