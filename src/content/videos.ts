import type { MotionScene } from '../types';

export type SceneVideo = {
  hash: string;
  source: string;
};

export const sceneVideos: Record<MotionScene, SceneVideo> = {
  'cpr-adult': { hash: 'o28k1gf', source: 'هلال احمر' },
  'cpr-child': { hash: 'u809b06', source: 'هلال احمر' },
  'cpr-infant': { hash: 'u809b06', source: 'هلال احمر' },
  'cpr-breath': { hash: 'o28k1gf', source: 'هلال احمر' },
  heimlich: { hash: '8qlwo', source: 'هلال احمر' },
  'back-blows': { hash: '8qlwo', source: 'هلال احمر' },
  'infant-back-blows': { hash: 'e170l1b', source: 'اورژانس ۱۱۵' },
  recovery: { hash: 'z186b94', source: 'هلال احمر' },
  pressure: { hash: 'b56256y', source: 'اورژانس ۱۱۵' },
  cooling: { hash: 'sW1IA', source: 'اورژانس ۱۱۵' },
  splint: { hash: 's830f8i', source: 'دانشکده پرستاری' },
};

export const embedUrl = (video: SceneVideo): string =>
  `https://www.aparat.com/video/video/embed/videohash/${video.hash}/vt/frame`;

export const watchUrl = (video: SceneVideo): string => `https://www.aparat.com/v/${video.hash}`;
