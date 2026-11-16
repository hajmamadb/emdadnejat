import { Icon } from '../components/Icon';
import { guides } from '../content/guides';
import { useNav } from '../lib/nav';

export function GuidesScreen() {
  const go = useNav();

  return (
    <>
      <div>
        <h1 className="page-title">راهنمای کمک‌های اولیه</h1>
        <p className="page-sub">۷ سناریوی حیاتی با دستورالعمل قدم‌به‌قدم و قابل استفاده آفلاین.</p>
      </div>

      <div className="callout callout-blue">
        <Icon name="info" size={18} />
        <div>
          <strong>قبل از هر اقدام:</strong> ایمنی صحنه را بررسی کنید. در هر مورد تهدیدکننده حیات، ابتدا ۱۱۵ را
          خبر کنید یا فرد دیگری را مسئول تماس کنید.
        </div>
      </div>

      <div className="list">
        {guides.map((guide) => (
          <button
            key={guide.id}
            type="button"
            className={`row-card tone-${guide.tone}`}
            onClick={() => go({ name: 'guide', id: guide.id })}
          >
            <span className="row-icon">
              <Icon name={guide.icon} size={22} />
            </span>
            <span className="row-body">
              <span className="row-title">
                {guide.title}
                {guide.tags.includes('زمان طلایی') && <span className="badge">زمان طلایی</span>}
              </span>
              <span className="row-sub">{guide.short}</span>
            </span>
            <Icon className="row-chevron" name="chevron-left" size={18} />
          </button>
        ))}
      </div>
    </>
  );
}
