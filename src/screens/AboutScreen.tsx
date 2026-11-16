import { Icon } from '../components/Icon';
import { Toast } from '../components/Toast';
import { addToHome, closeApp, haptic, isEitaa, openExternal } from '../lib/eitaa';
import { useMode } from '../lib/mode';
import { useToast } from '../lib/useToast';

const links = [
  {
    title: 'دوره نهضت ملی امداد و نجات — هلال احمر',
    desc: 'دوره رسمی «هر ایرانی، یک امدادگر» در مرکز آموزش الکترونیکی',
    url: 'https://learn.rcs.ir/course/pvt/66576/dashboard',
  },
  {
    title: 'مستندات توسعه برنامک ایتا',
    desc: 'راهنمای شروع سریع، کیت توسعه و الزامات انتشار',
    url: 'https://developer.eitaa.com/docs/QuickStart/',
  },
  {
    title: 'ثبت و مدیریت برنامه در ایتا',
    desc: 'سامانه «برنامک من» برای ثبت آدرس HTTPS و تست برنامک',
    url: 'https://developer.eitaa.com/docs/ManagementPanel',
  },
];

export function AboutScreen() {
  const { mode } = useMode();
  const { message, show } = useToast();
  const sdk = isEitaa();
  const offline = 'serviceWorker' in navigator;

  return (
    <>
      <section className="card">
        <div className="about-head">
          <img className="about-logo" src={`${import.meta.env.BASE_URL}icon.svg`} alt="نشان امداد یار" />
          <div>
            <h1>امداد یار</h1>
            <p>همراه شما در دقایق طلایی — نسخه ۱.۰.۰</p>
          </div>
        </div>
        <p className="small muted" style={{ marginBottom: 0, lineHeight: 2 }}>
          راهنمای سریع و آفلاین کمک‌های اولیه برای استفاده عموم و امدادگران داوطلب، با امکان تماس سریع،
          چک‌لیست اقدامات و ساخت پیام درخواست امداد.
        </p>
      </section>

      <div className="callout callout-amber">
        <Icon name="alert" size={18} />
        <div>
          <strong>محدودیت مهم:</strong> این برنامک یک ابزار آموزشی است و جایگزین آموزش رسمی کمک‌های اولیه،
          مشاوره پزشکی یا تماس با اورژانس نیست. در شرایط تهدیدکننده حیات فوراً ۱۱۵ را خبر کنید.
        </div>
      </div>

      <section className="card">
        <h2 className="section-title" style={{ marginBottom: 6 }}>
          وضعیت برنامک
        </h2>
        <div className="status-row">
          <span>کیت توسعه ایتا</span>
          <span className={`status-pill ${sdk ? 'on' : ''}`}>{sdk ? 'فعال' : 'غیرفعال (مرورگر)'}</span>
        </div>
        <div className="status-row">
          <span>دسترسی آفلاین</span>
          <span className={`status-pill ${offline ? 'on' : ''}`}>{offline ? 'فعال' : 'نامشخص'}</span>
        </div>
        <div className="status-row">
          <span>حالت نمایش</span>
          <span className={`status-pill on`}>{mode === 'pro' ? 'امدادگر' : 'عمومی'}</span>
        </div>
        <div className="status-row">
          <span>داده‌های شخصی</span>
          <span className="status-pill">ذخیره محلی</span>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title" style={{ marginBottom: 4 }}>
          منابع و لینک‌ها
        </h2>
        {links.map((link) => (
          <button
            key={link.url}
            type="button"
            className="link-row"
            onClick={() => {
              haptic('light');
              openExternal(link.url);
            }}
          >
            <span className="row-icon" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <Icon name="external" size={17} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 700 }}>{link.title}</span>
              <span className="small muted" style={{ display: 'block', fontWeight: 400 }}>
                {link.desc}
              </span>
            </span>
            <Icon className="row-chevron" name="chevron-left" size={17} />
          </button>
        ))}
      </section>

      <section className="card">
        <h2 className="section-title" style={{ marginBottom: 6 }}>
          نصب و ثبت در ایتا
        </h2>
        <p className="small muted" style={{ marginTop: 0, lineHeight: 2 }}>
          برای استفاده داخل ایتا، برنامک باید روی یک آدرس HTTPS بدون ریدایرکت منتشر شود و در سامانه «برنامک
          من» (myminiapp_app@) با نام کاربری و آدرس دکمه ثبت شود. این نسخه برای تست لوکال آماده است.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (addToHome()) {
                show('درخواست افزودن به صفحه اصلی ارسال شد');
                haptic('success');
              } else {
                show('افزودن به صفحه اصلی فقط داخل ایتا ممکن است');
              }
            }}
          >
            <Icon name="grid" size={15} /> افزودن به صفحه اصلی
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (sdk) closeApp();
              else show('بستن برنامک فقط داخل ایتا ممکن است');
            }}
          >
            <Icon name="close" size={15} /> بستن برنامک
          </button>
        </div>
      </section>

      <p className="foot-note">
        ساخته‌شده با احترام برای امدادگران و مردم ایران
        <br />
        محتوا بر پایه سرفصل‌های دوره «نهضت ملی امداد و نجات» جمعیت هلال احمر
      </p>

      <Toast message={message} />
    </>
  );
}
