import { Icon } from '../components/Icon';
import { guides } from '../content/guides';
import { haptic, isEitaa } from '../lib/eitaa';
import { useMode } from '../lib/mode';
import { useNav } from '../lib/nav';
import { useProfile } from '../lib/profile';
import type { Route } from '../lib/router';
import type { IconName, Tone } from '../types';

interface Shortcut {
  title: string;
  desc: string;
  icon: IconName;
  tone: Tone;
  route: Route;
}

const shortcuts: Shortcut[] = [
  {
    title: 'راهنمای کمک‌های اولیه',
    desc: '۷ سناریوی حیاتی، قدم‌به‌قدم',
    icon: 'book',
    tone: 'red',
    route: { name: 'guides' },
  },
  {
    title: 'شماره‌های اضطراری',
    desc: 'تماس سریع با اورژانس و امداد',
    icon: 'phone',
    tone: 'blue',
    route: { name: 'numbers' },
  },
  {
    title: 'درخواست امداد',
    desc: 'ساخت پیام همراه موقعیت مکانی',
    icon: 'pin',
    tone: 'green',
    route: { name: 'request' },
  },
  {
    title: 'چک‌لیست اقدامات',
    desc: 'اولویت‌بندی کارها در صحنه',
    icon: 'clipboard',
    tone: 'orange',
    route: { name: 'checklist' },
  },
  {
    title: 'آزمون آموزشی',
    desc: '۱۲ سؤال کوتاه کمک‌های اولیه',
    icon: 'quiz',
    tone: 'violet',
    route: { name: 'quiz' },
  },
  {
    title: 'درباره و راهنما',
    desc: 'منابع، محدودیت‌ها و تنظیمات',
    icon: 'info',
    tone: 'teal',
    route: { name: 'about' },
  },
];

const criticalGuides = guides.filter((g) => ['cpr', 'choking', 'bleeding', 'burns'].includes(g.id));

export function Home() {
  const go = useNav();
  const { mode, setMode } = useMode();
  const { name, phone } = useProfile();
  const inEitaa = isEitaa();
  const initial = name?.trim().charAt(0) ?? '';

  const accountTitle = name
    ? `سلام، ${name}`
    : phone
      ? 'پروفایل امدادگر'
      : inEitaa
        ? 'ورود به امداد یار'
        : 'پروفایل من';
  const accountSub = phone
    ? 'شماره ایتا ثبت شده است'
    : inEitaa
      ? 'اشتراک شماره ایتا؛ اختیاری'
      : 'فقط داخل ایتا فعال است';
  const accountCta = phone ? 'پروفایل' : inEitaa ? 'ورود' : 'راهنما';

  return (
    <>
      <div className="mode-switch" role="group" aria-label="حالت برنامه">
        <button
          type="button"
          data-mode="public"
          className={mode === 'public' ? 'active' : ''}
          aria-pressed={mode === 'public'}
          onClick={() => {
            if (mode !== 'public') {
              setMode('public');
              haptic('select');
            }
          }}
        >
          <Icon name="user" size={15} /> حالت عمومی
        </button>
        <button
          type="button"
          data-mode="pro"
          className={mode === 'pro' ? 'active' : ''}
          aria-pressed={mode === 'pro'}
          onClick={() => {
            if (mode !== 'pro') {
              setMode('pro');
              haptic('select');
            }
          }}
        >
          <Icon name="shield" size={15} /> حالت امدادگر
        </button>
      </div>
      <p className="mode-hint">
        {mode === 'pro'
          ? 'نکات تخصصی، جزئیات بالینی و چک‌لیست کامل فعال است.'
          : 'راهنمای ساده و سریع برای هر کسی، در هر جایی.'}
      </p>

      <section className="sos-card" aria-labelledby="sos-title">
        <div className="sos-top">
          <span className="sos-badge">
            <Icon name="sos" size={14} /> کمک فوری
          </span>
          <span className="pulse-dot" aria-hidden="true" />
        </div>
        <h1 className="sos-title" id="sos-title">
          اگر جان کسی در خطر است،
          <br />
          اول ۱۱۵
        </h1>
        <p className="sos-sub">اقدامات حیاتی را قدم‌به‌قدم و بدون نیاز به اینترنت انجام دهید.</p>
        <div className="sos-actions">
          <a className="btn btn-white" href="tel:115" onClick={() => haptic('heavy')}>
            <Icon name="phone" size={18} /> تماس با ۱۱۵
          </a>
          <button type="button" className="btn btn-ghost-white" onClick={() => go({ name: 'emergency' })}>
            اقدامات فوری
          </button>
        </div>
      </section>

      <button type="button" className="signin-bar" onClick={() => go({ name: 'account' })}>
        <span className={`signin-avatar ${name ? '' : 'pending'}`} aria-hidden="true">
          {name ? initial : <Icon name="user" size={18} />}
        </span>
        <span className="signin-text">
          <strong>{accountTitle}</strong>
          <small>{accountSub}</small>
        </span>
        <span className="signin-cta">{accountCta}</span>
      </button>

      <section className="section" aria-labelledby="quick-title">
        <div className="section-head">
          <h2 className="section-title" id="quick-title">
            دسترسی سریع
          </h2>
        </div>
        <div className="quick-grid">
          {shortcuts.map((item) => (
            <button
              key={item.title}
              type="button"
              className={`quick-card tone-${item.tone}`}
              onClick={() => go(item.route)}
            >
              <span className="q-icon">
                <Icon name={item.icon} size={21} />
              </span>
              <span className="q-title">{item.title}</span>
              <span className="q-desc">{item.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="critical-title">
        <div className="section-head">
          <h2 className="section-title" id="critical-title">
            سناریوهای زمان طلایی
          </h2>
          <button type="button" className="section-link" onClick={() => go({ name: 'guides' })}>
            همه راهنماها
          </button>
        </div>
        <div className="chips">
          {criticalGuides.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`chip-link tone-${g.tone}`}
              onClick={() => go({ name: 'guide', id: g.id })}
            >
              <span className="dot" aria-hidden="true" />
              {g.title}
            </button>
          ))}
        </div>
      </section>

      <p className="foot-note">
        محتوای آموزشی بر پایه سرفصل‌های «نهضت ملی امداد و نجات» جمعیت هلال احمر
        <br />
        این برنامک جایگزین آموزش رسمی یا تماس با ۱۱۵ نیست.
        <br />
        ایده، تولید و پشتیبانی: محمد بختیاری
      </p>
    </>
  );
}
