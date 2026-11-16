export interface GeoFix {
  lat: number;
  lng: number;
  accuracy: number;
}

export type GeoFailure = 'unsupported' | 'denied' | 'unavailable';

export interface GeoWatchOptions {
  onFix: (fix: GeoFix) => void;
  onEnd: (best: GeoFix | null, failure?: GeoFailure) => void;
  goodEnough?: number;
  maxWaitMs?: number;
}

// High-accuracy mode can still return a coarse network fix first; keep watching
// and prefer the most accurate sample instead of accepting the first position.
export const watchDeviceLocation = ({
  onFix,
  onEnd,
  goodEnough = 50,
  maxWaitMs = 30000,
}: GeoWatchOptions): (() => void) => {
  if (!('geolocation' in navigator)) {
    onEnd(null, 'unsupported');
    return () => {};
  }

  let best: GeoFix | null = null;
  let watchId: number | null = null;
  let timer = 0;
  let ended = false;

  const stop = (failure?: GeoFailure) => {
    if (ended) return;
    ended = true;
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    window.clearTimeout(timer);
    onEnd(best, best ? undefined : failure);
  };

  timer = window.setTimeout(() => stop('unavailable'), maxWaitMs);

  try {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (ended) return;
        const fix: GeoFix = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        if (!best || fix.accuracy < best.accuracy) {
          best = fix;
          onFix(fix);
        }
        if (fix.accuracy > 0 && fix.accuracy <= goodEnough) stop();
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED || err.code === 1) stop('denied');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  } catch {
    stop('unavailable');
  }

  return () => stop();
};
