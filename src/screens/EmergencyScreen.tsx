import { Icon } from '../components/Icon';
import { guideById } from '../content/guides';
import { haptic } from '../lib/eitaa';
import { useNav } from '../lib/nav';

const scenarios = [
  { guideId: 'cpr', label: 'نفس نمی‌کشد یا فقط نفس‌های ناگهانی دارد' },
  { guideId: 'bleeding', label: 'خونریزی شدید و جهنده دارد' },
  { guideId: 'choking', label: 'چیزی در گلویش گیر کرده است' },
  { guideId: 'burns', label: 'دچار سوختگی شده است' },
  { guideId: 'fracture', label: 'شکستگی یا آسیب شدید اندام دارد' },
  { guideId: 'transport', label: 'بیهوش است ولی نفس می‌کشد' },
];

export function EmergencyScreen() {
  const go = useNav();

  return (
    <>
      <div>
        <h1 className="page-title">کمک فوری</h1>
        <p className="page-sub">در شرایط تهدیدکننده حیات، تماس و اقدام را همزمان انجام دهید.</p>
      </div>

      <section className="sos-card" aria-labelledby="emg-title">
        <div className="sos-top">
          <span className="sos-badge">
            <Icon name="sos" size={14} /> اول تماس، بعد اقدام
          </span>
          <span className="pulse-dot" aria-hidden="true" />
        </div>
        <h2 className="sos-title" id="emg-title" style={{ fontSize: 24 }}>
          آرام بمانید، ۱۱۵ را خبر کنید
        </h2>
        <p className="sos-sub">
          تلفن را روی بلندگو بگذارید تا اپراتور اورژانس در طول اقدامات راهنمایی‌تان کند.
        </p>
        <div className="sos-actions">
          <a className="btn btn-white" href="tel:115" onClick={() => haptic('heavy')}>
            <Icon name="phone" size={18} /> تماس با ۱۱۵
          </a>
          <button type="button" className="btn btn-ghost-white" onClick={() => go({ name: 'request' })}>
            ارسال موقعیت
          </button>
        </div>
      </section>

      <div className="section-head">
        <h2 className="section-title">شرایط را انتخاب کنید</h2>
      </div>

      <div className="list">
        {scenarios.map(({ guideId, label }) => {
          const guide = guideById(guideId);
          if (!guide) return null;
          return (
            <button
              key={guideId}
              type="button"
              className={`row-card tone-${guide.tone}`}
              onClick={() => go({ name: 'guide', id: guide.id })}
            >
              <span className="row-icon">
                <Icon name={guide.icon} size={21} />
              </span>
              <span className="row-body">
                <span className="row-title">{guide.title}</span>
                <span className="row-sub">{label}</span>
              </span>
              <Icon className="row-chevron" name="chevron-left" size={18} />
            </button>
          );
        })}
      </div>

      <div className="callout callout-amber">
        <Icon name="alert" size={18} />
        <div>
          <strong>ایمنی خودتان اولویت اول است.</strong> اگر صحنه پرخطر است (آتش، برق، ترافیک)، تا ایمن شدن
          وضعیت وارد نشوید و از فاصله امن راهنمایی کنید.
        </div>
      </div>

      <div className="bottom-cta">
        <a className="btn btn-primary" href="tel:115" onClick={() => haptic('heavy')}>
          <Icon name="phone" size={18} /> اورژانس ۱۱۵
        </a>
        <button type="button" className="btn btn-ghost" onClick={() => go({ name: 'numbers' })}>
          همه شماره‌ها
        </button>
      </div>
    </>
  );
}
