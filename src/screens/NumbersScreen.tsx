import { Icon } from '../components/Icon';
import { Toast } from '../components/Toast';
import { numberCategories } from '../content/numbers';
import { emergencyNumbers, type EmergencyNumber } from '../content/numbers';
import { haptic } from '../lib/eitaa';
import { useToast } from '../lib/useToast';

function copyNumber(n: EmergencyNumber, notify: (text: string) => void) {
  const text = n.dial;
  const fallback = () => {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      notify(`شماره ${n.display} کپی شد`);
    } catch {
      notify('کپی شماره ممکن نشد');
    }
    document.body.removeChild(area);
  };
  haptic('select');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => notify(`شماره ${n.display} کپی شد`), fallback);
  } else {
    fallback();
  }
}

export function NumbersScreen() {
  const { message, show } = useToast();

  return (
    <>
      <div>
        <h1 className="page-title">شماره‌های اضطراری</h1>
        <p className="page-sub">تماس سریع با اورژانس، امداد و خدمات ایمنی.</p>
      </div>

      <div className="callout callout-red">
        <Icon name="sos" size={18} />
        <div>
          <strong>در خطر جانی، ابتدا ۱۱۵.</strong> اگر امکان تماس ندارید، از فرد کناری بخواهید تماس بگیرد یا از
          بخش «درخواست امداد» پیام آماده بسازید.
        </div>
      </div>

      {numberCategories.map((category) => {
        const items = emergencyNumbers.filter((n) => n.category === category);
        return (
          <section key={category} className="section">
            <div className="section-head">
              <h2 className="section-title">{category}</h2>
            </div>
            <div className="list">
              {items.map((n) => (
                <article key={n.dial} className={`number-row tone-${n.primary ? 'red' : 'blue'}`}>
                  <div className="number-head">
                    <span className="row-icon">
                      <Icon name={n.icon} size={20} />
                    </span>
                    <div className="number-main">
                      <div className="number-title">
                        {n.title}
                        {n.primary && <span className="badge">مهم</span>}
                      </div>
                      <div className="number-desc">{n.desc}</div>
                    </div>
                    <span className="dial">{n.display}</span>
                  </div>
                  <div className="number-foot">
                    <a className="btn btn-primary btn-sm" href={`tel:${n.dial}`} onClick={() => haptic('heavy')}>
                      <Icon name="phone" size={15} /> تماس
                    </a>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyNumber(n, show)}>
                      <Icon name="copy" size={15} /> کپی شماره
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <p className="foot-note">
        شماره‌ها از منابع عمومی جمع‌آوری شده‌اند. در صورت تغییر، آخرین اطلاعات رسمی را بررسی کنید.
      </p>

      <Toast message={message} />
    </>
  );
}
