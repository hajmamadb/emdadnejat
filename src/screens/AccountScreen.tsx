import { Icon } from '../components/Icon';
import { Toast } from '../components/Toast';
import { haptic, isEitaa } from '../lib/eitaa';
import { toFa } from '../lib/fa';
import { useNav } from '../lib/nav';
import { useProfile } from '../lib/profile';
import { useToast } from '../lib/useToast';

export function AccountScreen() {
  const { name, phone, sharing, sharePhone, forgetPhone } = useProfile();
  const { message, show } = useToast();
  const go = useNav();
  const inEitaa = isEitaa();
  const initial = name?.trim().charAt(0) ?? '';

  const handleShare = async () => {
    if (!inEitaa || sharing) return;
    haptic('medium');
    const result = await sharePhone();
    if (result.ok) {
      show('شماره ایتای شما ثبت شد');
      haptic('success');
      return;
    }
    haptic('warning');
    if (result.reason === 'declined') show('اشتراک شماره لغو شد');
    else if (result.reason === 'unavailable') show('این قابلیت فقط داخل ایتا فعال است');
    else if (result.reason === 'unreadable') show('شماره از پاسخ ایتا خوانده نشد؛ دوباره تلاش کنید');
    else show('پاسخی از ایتا دریافت نشد؛ دوباره تلاش کنید');
  };

  return (
    <>
      <div>
        <h1 className="page-title">پروفایل من</h1>
        <p className="page-sub">
          شناسایی خودکار با حساب ایتا و شماره تماس اختیاری برای مواقع امداد.
        </p>
      </div>

      {!inEitaa && (
        <div className="callout callout-amber">
          <Icon name="alert" size={18} />
          <div>
            این برنامک خارج از ایتا باز شده است. برای شناسایی خودکار و اشتراک شماره، برنامک را از مرکز
            برنامک‌های ایتا باز کنید. مطالعه راهنماها و درخواست امداد در مرورگر هم ممکن است.
          </div>
        </div>
      )}

      <section className="card profile-card">
        <div className={`profile-avatar ${name ? '' : 'empty'}`} aria-hidden="true">
          {name ? initial : <Icon name="user" size={22} />}
        </div>
        <div className="profile-body">
          <strong>{name ?? (inEitaa ? 'کاربر ایتا' : 'کاربر مهمان')}</strong>
          <span className="small muted">
            {name
              ? 'شناسایی خودکار با حساب ایتا'
              : inEitaa
                ? 'شناسایی از طریق کیت توسعه ایتا'
                : 'برنامک خارج از ایتا باز شده است'}
          </span>
        </div>
        <span className={`status-pill ${inEitaa ? 'on' : ''}`}>{inEitaa ? 'متصل' : 'مرورگر'}</span>
      </section>

      <section className="card">
        <h2 className="section-title" style={{ marginBottom: 4 }}>
          شماره تماس ایتا
        </h2>
        <p className="small muted" style={{ marginTop: 0, lineHeight: 2 }}>
          با اجازه خودتان شماره حسابتان را به اشتراک بگذارید تا در پیام درخواست امداد درج شود. شناسایی
          شما در برنامک به شماره وابسته نیست و همه بخش‌ها بدون آن هم کار می‌کنند.
        </p>

        {phone ? (
          <>
            <div className="phone-box">
              <Icon name="phone" size={17} />
              <span className="phone-value">{toFa(phone)}</span>
              <span className="status-pill on" style={{ marginInlineStart: 'auto' }}>
                ثبت‌شده
              </span>
            </div>
            <div className="phone-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleShare}
                disabled={!inEitaa || sharing}
              >
                <Icon name="phone" size={15} />
                {sharing ? 'در حال دریافت…' : 'به‌روزرسانی شماره'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm danger-text"
                onClick={() => {
                  forgetPhone();
                  haptic('warning');
                  show('شماره ذخیره‌شده حذف شد');
                }}
              >
                <Icon name="close" size={15} /> حذف اطلاعات من
              </button>
            </div>
            <button
              type="button"
              className="btn btn-soft btn-sm"
              style={{ marginTop: 10 }}
              onClick={() => go({ name: 'request' })}
            >
              <Icon name="share" size={15} /> درج شماره در پیام درخواست امداد
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleShare}
            disabled={!inEitaa || sharing}
          >
            <Icon name="phone" size={16} />
            {sharing ? 'در حال دریافت شماره…' : 'اشتراک شماره ایتا'}
          </button>
        )}

        {!inEitaa && (
          <span className="hint" style={{ display: 'block', marginTop: 8 }}>
            اشتراک شماره فقط از داخل ایتا و با تأیید خودتان انجام می‌شود.
          </span>
        )}
      </section>

      <div className="callout callout-green">
        <Icon name="shield" size={18} />
        <div>
          شماره تماس فقط روی همین دستگاه ذخیره می‌شود، به هیچ سروری ارسال نمی‌شود و هر زمان بخواهید
          حذفش می‌کنید.
        </div>
      </div>

      <Toast message={message} />
    </>
  );
}
