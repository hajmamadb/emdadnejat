import { useState, type ReactElement } from 'react';
import { embedUrl, sceneVideos, watchUrl } from '../content/videos';
import { haptic, openExternal } from '../lib/eitaa';
import type { MotionScene } from '../types';
import { Icon } from './Icon';

const BODY = '#d5dfea';
const BODY_DARK = '#bcc9d9';
const BODY_DEEP = '#a9b8ca';
const ACCENT = '#d31c2b';
const BLUE = '#2f6fed';
const LINE = '#94a3b8';

const captions: Record<MotionScene, string> = {
  'cpr-adult': 'فشار قفسه سینه بزرگسال: عمق ۵ تا ۶ سانتی‌متر، سرعت ۱۰۰ تا ۱۲۰ در دقیقه',
  'cpr-child': 'فشار قفسه سینه کودک: با یک یا دو دست، وسط قفسه سینه',
  'cpr-infant': 'فشار قفسه سینه شیرخوار: با دو انگشت، کمی پایین‌تر از خط نوک سینه‌ها',
  'cpr-breath': '۲ تنفس نجات: هر تنفس حدود ۱ ثانیه تا بالا آمدن قفسه سینه',
  heimlich: 'فشار شکمی رو به داخل و بالا، بالای ناف',
  'back-blows': '۵ ضربه محکم بین دو کتف، در حالی که مصدوم به جلو خم است',
  'infant-back-blows': 'ضربه‌های ملایم بین دو کتف شیرخوار، سر پایین‌تر از بدن',
  recovery: 'وضعیت بازیابی: روی پهلو، سر کمی عقب و راه هوایی باز',
  pressure: 'فشار مستقیم و پیوسته روی زخم با گاز استریل',
  cooling: 'خنک‌کردن سوختگی با آب ملایم جاری به مدت ۲۰ دقیقه',
  splint: 'بی‌حرکت‌سازی عضو با آتل، بالای و پایین مفصل آسیب‌دیده',
};

const Ground = () => <ellipse cx="160" cy="154" rx="120" ry="7" fill="rgba(15,23,42,0.06)" />;

const Heart = ({ x, y, size = 1 }: { x: number; y: number; size?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${size})`}>
    <path
      className="mo-heart"
      d="M0 4C-5-3-15-1-15 6c0 7 9 10 15 16 6-6 15-9 15-16 0-7-10-9-15-2Z"
      fill={ACCENT}
    />
  </g>
);

function CprAdult() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <circle cx="54" cy="116" r="20" fill={BODY_DARK} />
      <rect x="72" y="98" width="152" height="46" rx="23" fill={BODY} />
      <rect x="214" y="110" width="64" height="26" rx="13" fill={BODY} />
      <ellipse cx="146" cy="100" rx="31" ry="24" fill={BODY_DARK} />
      <Heart x={146} y={112} size={0.9} />
      <circle className="mo-ring" cx="146" cy="96" r="26" fill="none" stroke={ACCENT} strokeWidth="3" />
      <g className="mo-press">
        <ellipse cx="166" cy="84" rx="18" ry="10" fill={BODY_DARK} />
        <rect x="132" y="30" width="31" height="60" rx="15.5" fill={BODY_DEEP} />
        <ellipse cx="147" cy="87" rx="24" ry="13" fill={BODY_DEEP} />
      </g>
    </svg>
  );
}

function CprChild() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <circle cx="62" cy="118" r="17" fill={BODY_DARK} />
      <rect x="82" y="103" width="128" height="38" rx="19" fill={BODY} />
      <rect x="206" y="112" width="56" height="22" rx="11" fill={BODY} />
      <ellipse cx="150" cy="106" rx="25" ry="19" fill={BODY_DARK} />
      <Heart x={150} y={114} size={0.75} />
      <circle className="mo-ring" cx="150" cy="102" r="22" fill="none" stroke={ACCENT} strokeWidth="3" />
      <g className="mo-press">
        <rect x="137" y="42" width="26" height="52" rx="13" fill={BODY_DEEP} />
        <ellipse cx="150" cy="94" rx="19" ry="10" fill={BODY_DEEP} />
      </g>
    </svg>
  );
}

function CprInfant() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <circle cx="78" cy="124" r="14" fill={BODY_DARK} />
      <rect x="96" y="112" width="104" height="30" rx="15" fill={BODY} />
      <rect x="196" y="118" width="48" height="18" rx="9" fill={BODY} />
      <ellipse cx="150" cy="116" rx="21" ry="14" fill={BODY_DARK} />
      <circle className="mo-ring" cx="150" cy="113" r="18" fill="none" stroke={ACCENT} strokeWidth="3" />
      <g className="mo-press">
        <rect x="139" y="62" width="20" height="44" rx="10" fill={BODY_DEEP} />
        <rect x="139" y="104" width="9" height="17" rx="4.5" fill={BODY_DEEP} />
        <rect x="152" y="104" width="9" height="17" rx="4.5" fill={BODY_DEEP} />
      </g>
    </svg>
  );
}

function CprBreath() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <circle cx="108" cy="104" r="22" fill={BODY_DARK} />
      <ellipse cx="88" cy="111" rx="4.5" ry="3.2" fill="#8fa0b3" />
      <rect x="128" y="92" width="152" height="44" rx="22" fill={BODY} />
      <rect x="260" y="106" width="42" height="24" rx="12" fill={BODY} />
      <ellipse className="mo-chest" cx="198" cy="97" rx="30" ry="17" fill={BODY_DARK} />
      <g className="mo-air" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round">
        <path d="M30 88c22 0 34 10 50 14" />
        <path d="M26 102c20 0 32 8 48 11" />
        <path d="M32 116c20 0 30 4 44 6" />
      </g>
    </svg>
  );
}

function Heimlich() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <defs>
        <marker
          id="mo-arrow-head"
          viewBox="0 0 14 14"
          refX="11"
          refY="7"
          markerWidth="13"
          markerHeight="13"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0 L14 7 L0 14 Z" fill={ACCENT} />
        </marker>
      </defs>
      <Ground />
      <g fill={BODY}>
        <circle cx="112" cy="50" r="18" fill={BODY_DARK} />
        <rect x="95" y="68" width="36" height="62" rx="18" />
        <rect x="99" y="129" width="12" height="26" rx="6" fill={BODY_DARK} />
        <rect x="115" y="129" width="12" height="26" rx="6" fill={BODY_DARK} />
        <circle cx="184" cy="46" r="18" fill={BODY_DARK} />
        <rect x="166" y="64" width="38" height="66" rx="19" />
        <rect x="171" y="129" width="13" height="26" rx="6.5" fill={BODY_DARK} />
        <rect x="188" y="129" width="13" height="26" rx="6.5" fill={BODY_DARK} />
      </g>
      <path d="M172 82 L140 95" stroke={BODY_DEEP} strokeWidth="15" strokeLinecap="round" />
      <circle cx="128" cy="102" r="17" fill={ACCENT} opacity="0.12" />
      <g className="mo-thrust">
        <path
          d="M168 132 L144 111"
          stroke={ACCENT}
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#mo-arrow-head)"
        />
        <circle cx="126" cy="100" r="9" fill={ACCENT} />
      </g>
    </svg>
  );
}

function BackBlows() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <rect x="100" y="96" width="16" height="16" rx="8" fill={BODY_DARK} />
      <circle cx="92" cy="106" r="16" fill={BODY_DARK} />
      <rect x="108" y="88" width="88" height="36" rx="18" fill={BODY} />
      <rect x="174" y="120" width="13" height="32" rx="6.5" fill={BODY_DARK} />
      <rect x="190" y="120" width="13" height="32" rx="6.5" fill={BODY_DARK} />
      <circle cx="249" cy="44" r="16" fill={BODY_DARK} />
      <rect x="232" y="62" width="34" height="62" rx="17" fill={BODY} />
      <rect x="236" y="121" width="12" height="31" rx="6" fill={BODY_DARK} />
      <rect x="252" y="121" width="12" height="31" rx="6" fill={BODY_DARK} />
      <g className="mo-strike">
        <path d="M240 78 L166 74" stroke={BODY_DEEP} strokeWidth="14" strokeLinecap="round" />
        <ellipse cx="160" cy="74" rx="13" ry="8" fill={BODY_DEEP} />
      </g>
      <g className="mo-impact" stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
        <path d="M144 78l-9-9" />
        <path d="M152 68l-2-12" />
        <path d="M132 66l-10-3" />
      </g>
    </svg>
  );
}

function InfantBackBlows() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <rect x="44" y="102" width="204" height="25" rx="12.5" fill={BODY_DEEP} transform="rotate(-5 146 114)" />
      <circle cx="76" cy="96" r="14" fill={BODY_DARK} />
      <rect x="90" y="84" width="76" height="27" rx="13.5" fill={BODY} />
      <rect x="160" y="94" width="34" height="12" rx="6" fill={BODY_DARK} />
      <g className="mo-strike mo-strike-soft">
        <path d="M172 22 L134 70" stroke={BODY_DEEP} strokeWidth="14" strokeLinecap="round" />
        <ellipse cx="130" cy="76" rx="13" ry="8" fill={BODY_DEEP} />
      </g>
      <g className="mo-impact" stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
        <path d="M116 58l-8-8" />
        <path d="M126 52l-2-11" />
        <path d="M106 68l-10-2" />
      </g>
    </svg>
  );
}

function Recovery() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <circle cx="84" cy="96" r="19" fill={BODY_DARK} />
      <rect x="102" y="82" width="108" height="42" rx="21" fill={BODY} />
      <rect x="196" y="112" width="66" height="18" rx="9" fill={BODY} />
      <rect x="184" y="86" width="60" height="18" rx="9" fill={BODY_DARK} transform="rotate(-22 184 95)" />
      <g className="mo-air" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round">
        <path d="M64 108Q44 112 30 98" />
        <path d="M64 114Q46 120 34 110" />
      </g>
      <g fill={BLUE}>
        <path d="M30 92l10 1-5 8Z" />
      </g>
      <path
        className="mo-roll"
        d="M100 46A56 56 0 0 1 202 46"
        fill="none"
        stroke={LINE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M206 48l-9-4 2 9Z" fill={LINE} />
    </svg>
  );
}

function Pressure() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <g transform="rotate(-10 160 104)">
        <rect x="66" y="88" width="184" height="42" rx="21" fill={BODY} />
        <ellipse cx="158" cy="104" rx="24" ry="11" fill={ACCENT} />
        <rect x="143" y="89" width="30" height="24" rx="6" fill="#ffffff" stroke="#cdd9e6" strokeWidth="1.5" />
        <g className="mo-press">
          <rect x="146" y="24" width="23" height="56" rx="11.5" fill={BODY_DEEP} />
          <ellipse cx="158" cy="82" rx="24" ry="13" fill={BODY_DEEP} />
        </g>
      </g>
      <path className="mo-drop mo-drop-a" d="M206 116c3 5 6 8 6 11a6 6 0 0 1-12 0c0-3 3-6 6-11Z" fill={ACCENT} />
      <path className="mo-drop mo-drop-b" d="M224 122c2.5 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2.5-5 5-9Z" fill={ACCENT} />
    </svg>
  );
}

function Cooling() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <rect x="140" y="14" width="34" height="16" rx="7" fill={BLUE} />
      <rect x="152" y="30" width="10" height="8" rx="3" fill={BLUE} />
      <g className="mo-water" fill="none" stroke="#60a5fa" strokeWidth="4.5" strokeLinecap="round">
        <path d="M152 40v46" />
        <path d="M163 40v50" />
        <path d="M174 40v45" />
      </g>
      <rect x="86" y="92" width="152" height="40" rx="20" fill={BODY} />
      <ellipse cx="166" cy="108" rx="27" ry="13" fill="#e8590c" opacity="0.85" />
      <ellipse cx="166" cy="108" rx="17" ry="7" fill="#f59e0b" opacity="0.8" />
      <ellipse cx="166" cy="94" rx="24" ry="4" fill="#93c5fd" opacity="0.6" />
      <g className="mo-steam" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round">
        <path d="M196 86c-6-8 6-12 0-20" />
        <path d="M210 90c-6-8 6-12 0-20" />
      </g>
    </svg>
  );
}

function Splint() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <Ground />
      <rect x="46" y="76" width="228" height="56" rx="7" fill="#cdd9e6" stroke={LINE} strokeWidth="1.5" />
      <rect x="62" y="84" width="196" height="40" rx="20" fill={BODY} />
      <circle cx="262" cy="104" r="12" fill={BODY_DARK} />
      <g fill={BLUE} opacity="0.85">
        <rect className="mo-strap" x="88" y="78" width="14" height="52" rx="5" />
        <rect className="mo-strap mo-strap-b" x="152" y="78" width="14" height="52" rx="5" />
        <rect className="mo-strap mo-strap-c" x="214" y="78" width="14" height="52" rx="5" />
      </g>
    </svg>
  );
}

const scenes: Record<MotionScene, () => ReactElement> = {
  'cpr-adult': CprAdult,
  'cpr-child': CprChild,
  'cpr-infant': CprInfant,
  'cpr-breath': CprBreath,
  heimlich: Heimlich,
  'back-blows': BackBlows,
  'infant-back-blows': InfantBackBlows,
  recovery: Recovery,
  pressure: Pressure,
  cooling: Cooling,
  splint: Splint,
};

export function MotionGraphic({ scene }: { scene: MotionScene }) {
  const Scene = scenes[scene];
  const video = sceneVideos[scene];
  const [open, setOpen] = useState(false);
  return (
    <figure className="motion">
      <div className="motion-canvas" role="img" aria-label={captions[scene]}>
        <Scene />
      </div>
      <figcaption className="motion-cap">
        <span className="mo-dot" aria-hidden="true" />
        {captions[scene]}
      </figcaption>
      <button
        type="button"
        className="motion-video"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          haptic('select');
        }}
      >
        <span className="motion-video-play" aria-hidden="true">
          <Icon name={open ? 'close' : 'play'} size={15} />
        </span>
        <span className="motion-video-text">
          {open ? 'بستن ویدیو' : 'پخش ویدیوی آموزشی'}
          <small>منبع: {video.source}</small>
        </span>
      </button>
      {open && (
        <div className="motion-player">
          <div className="motion-frame">
            <iframe
              src={embedUrl(video)}
              title={`ویدیوی آموزشی ${video.source}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <a
            className="motion-player-link"
            href={watchUrl(video)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.preventDefault();
              openExternal(watchUrl(video));
            }}
          >
            <Icon name="external" size={12} />
            پخش در آپارات
          </a>
        </div>
      )}
    </figure>
  );
}
