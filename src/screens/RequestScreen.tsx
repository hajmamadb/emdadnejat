import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { Toast } from '../components/Toast';
import { formatDateTime, toFa } from '../lib/fa';
import { haptic, openExternal } from '../lib/eitaa';
import { watchDeviceLocation } from '../lib/geo';
import type { GeoFix } from '../lib/geo';
import { useProfile } from '../lib/profile';
import { useToast } from '../lib/useToast';

const incidentTypes = [
  'تصادف',
  'سقوط',
  'خفگی',
  'سوختگی',
  'ایست قلبی',
  'خونریزی شدید',
  'شکستگی',
  'سایر',
];

function accuracyLabel(accuracy: number): { text: string; coarse: boolean } {
  const meters = Math.round(accuracy);
  if (meters <= 20) return { text: `دقت GPS: حدود ${toFa(meters)} متر`, coarse: false };
  if (meters <= 100) return { text: `دقت موقعیت: حدود ${toFa(meters)} متر`, coarse: false };
  if (meters <= 500) return { text: `دقت متوسط: حدود ${toFa(meters)} متر`, coarse: false };
  return {
    text: `دقت کم: حدود ${toFa(meters)} متر — این موقعیت تقریبی است؛ GPS گوشی را روشن کنید و در فضای باز بایستید`,
    coarse: true,
  };
}

function fallbackCopy(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

export function RequestScreen() {
  const { name: savedName, phone } = useProfile();
  const [name, setName] = useState(savedName ?? '');
  const [withPhone, setWithPhone] = useState(Boolean(phone));
  const [incident, setIncident] = useState(incidentTypes[0]);
  const [injured, setInjured] = useState('');
  const [place, setPlace] = useState('');
  const [desc, setDesc] = useState('');
  const [coords, setCoords] = useState<GeoFix | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);
  const { message, show } = useToast();

  useEffect(() => () => stopWatchRef.current?.(), []);

  const mapLink = coords
    ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`
    : '';

  const coordsText = coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'ثبت نشده';
  const accuracy = coords ? accuracyLabel(coords.accuracy) : null;

  const requestText = [
    'درخواست امداد',
    `نوع حادثه: ${incident}`,
    injured.trim() ? `تعداد مصدوم: ${injured.trim()}` : '',
    name.trim() ? `نام تماس‌گیرنده: ${name.trim()}` : '',
    withPhone && phone ? `شماره تماس: ${toFa(phone)}` : '',
    `موقعیت: ${coordsText}`,
    place.trim() ? `نشانی/نشانه محل: ${place.trim()}` : '',
    mapLink ? `نقشه: ${mapLink}` : '',
    desc.trim() ? `توضیح: ${desc.trim()}` : '',
    `زمان: ${formatDateTime(new Date())}`,
    'لطفاً در صورت امکان با ۱۱۵ تماس بگیرید.',
  ]
    .filter(Boolean)
    .join('\n');

  const locate = () => {
    if (locating) {
      stopWatchRef.current?.();
      return;
    }
    setLocError(null);
    haptic('light');
    setLocating(true);
    stopWatchRef.current = watchDeviceLocation({
      onFix: (fix) => setCoords(fix),
      onEnd: (best, failure) => {
        stopWatchRef.current = null;
        setLocating(false);
        if (best) {
          setCoords(best);
          show(best.accuracy <= 100 ? 'موقعیت GPS ثبت شد' : 'موقعیت تقریبی ثبت شد؛ برای دقت بیشتر GPS را روشن کنید');
          haptic('success');
          return;
        }
        if (failure === 'unsupported') {
          setLocError('دستگاه شما از موقعیت‌یابی پشتیبانی نمی‌کند. نشانی محل را دستی وارد کنید.');
        } else if (failure === 'denied') {
          setLocError(
            'اجازه دسترسی به موقعیت داده نشد. در تنظیمات دستگاه یا مرورگر اجازه موقعیت مکانی را فعال کنید یا نشانی محل را دستی وارد کنید.',
          );
        } else if (failure === 'unavailable') {
          setLocError(
            'موقعیت GPS دریافت نشد. GPS گوشی را روشن کنید، در فضای باز بایستید و دوباره تلاش کنید یا نشانی محل را دستی وارد کنید.',
          );
        }
        if (failure) haptic('error');
      },
    });
  };

  const copyRequest = async () => {
    haptic('select');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(requestText);
        show('متن درخواست امداد کپی شد');
        return;
      }
      throw new Error('clipboard unavailable');
    } catch {
      if (fallbackCopy(requestText)) show('متن درخواست امداد کپی شد');
      else show('کپی ممکن نشد؛ متن را دستی انتخاب کنید');
    }
  };

  const shareRequest = async () => {
    haptic('medium');
    if (navigator.share) {
      try {
        await navigator.share({ title: 'درخواست امداد', text: requestText });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await copyRequest();
    show('اشتراک‌گذاری مستقیم در دسترس نیست؛ متن کپی شد');
  };

  return (
    <>
      <div>
        <h1 className="page-title">درخواست امداد</h1>
        <p className="page-sub">یک پیام کامل با موقعیت مکانی بسازید و برای همراهان یا امدادگران بفرستید.</p>
      </div>

      <div className="callout callout-red">
        <Icon name="sos" size={18} />
        <div>
          <strong>این بخش جای تماس با ۱۱۵ را نمی‌گیرد.</strong> در خطر جانی ابتدا با اورژانس تماس بگیرید.
          <div style={{ marginTop: 8 }}>
            <a className="btn btn-primary btn-sm" href="tel:115" onClick={() => haptic('heavy')}>
              <Icon name="phone" size={15} /> تماس با ۱۱۵
            </a>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="form">
          <div className="field">
            <label htmlFor="req-name">نام تماس‌گیرنده (اختیاری)</label>
            <input
              id="req-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً محمد"
              autoComplete="name"
            />
          </div>

          {phone ? (
            <label className="check-line">
              <input
                type="checkbox"
                checked={withPhone}
                onChange={(e) => setWithPhone(e.target.checked)}
              />
              <span>درج شماره ایتای من ({toFa(phone)}) در پیام</span>
            </label>
          ) : (
            <span className="hint">
              برای درج شماره تماس در پیام، از «پروفایل من» در صفحه اصلی شماره ایتا را به اشتراک بگذارید.
            </span>
          )}

          <div className="form-row">
            <div className="field">
              <label htmlFor="req-type">نوع حادثه</label>
              <select id="req-type" className="select" value={incident} onChange={(e) => setIncident(e.target.value)}>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="req-injured">تعداد مصدوم</label>
              <input
                id="req-injured"
                className="input"
                value={injured}
                onChange={(e) => setInjured(e.target.value)}
                inputMode="numeric"
                placeholder="۱"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="req-place">نشانی یا نشانه‌های محل</label>
            <input
              id="req-place"
              className="input"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="مثلاً: جاده قدیم، بعد از پل، کنار ایستگاه اتوبوس"
            />
            <span className="hint">اگر موقعیت‌یابی ممکن نشد، این بخش را کامل کنید.</span>
          </div>

          <div className="field">
            <label htmlFor="req-desc">توضیح وضعیت (اختیاری)</label>
            <textarea
              id="req-desc"
              className="textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="مثلاً: مصدوم بیهوش است ولی نفس می‌کشد، خونریزی از سر دارد."
            />
          </div>

          <div className="field">
            <label>موقعیت مکانی</label>
            <div className="location-box">
              <span className="loc-icon">
                <Icon name="location" size={18} />
              </span>
              <div style={{ flex: 1 }}>
                {coords ? (
                  <>
                    <strong>موقعیت ثبت شد</strong>
                    <br />
                    <span className="coords">
                      {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </span>
                    {accuracy && (
                      <div className="hint" style={accuracy.coarse ? { color: 'var(--amber)' } : undefined}>
                        {accuracy.text}
                      </div>
                    )}
                  </>
                ) : (
                  <span>برای درج دقیق موقعیت، دکمه زیر را بزنید.</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={locate}>
                <Icon name="location" size={15} />
                {locating ? 'توقف دریافت' : coords ? 'به‌روزرسانی موقعیت' : 'دریافت موقعیت از GPS'}
              </button>
              {coords && mapLink && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openExternal(mapLink)}>
                  <Icon name="map" size={15} /> نمایش در نقشه
                </button>
              )}
            </div>
            {locError && <div className="hint" style={{ color: 'var(--red)' }}>{locError}</div>}
            {locating && (
              <span className="hint">
                {coords
                  ? 'در حال بهبود دقت موقعیت…'
                  : 'در حال جست‌وجوی GPS… ممکن است تا ۳۰ ثانیه طول بکشد.'}
              </span>
            )}
            {!coords && !locating && (
              <span className="hint">
                موقعیت از GPS گوشی گرفته می‌شود. GPS و اجازه دسترسی به موقعیت را روشن کنید و در فضای باز
                بایستید (برنامک باید با HTTPS باز شود).
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-head" style={{ marginBottom: 10 }}>
          <h2 className="section-title">پیش‌نمایش پیام</h2>
        </div>
        <div className="message-preview">{requestText}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={shareRequest}>
            <Icon name="share" size={15} /> اشتراک‌گذاری پیام
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={copyRequest}>
            <Icon name="copy" size={15} /> کپی متن
          </button>
        </div>
      </section>

      <div className="callout callout-amber">
        <Icon name="info" size={18} />
        <div>
          این برنامک پیام را خودکار ارسال نمی‌کند. متن آماده را در چت ایتا برای همراهان، امدادگران محلی یا
          گروه امداد بفرستید و همزمان با ۱۱۵ تماس بگیرید.
        </div>
      </div>

      <Toast message={message} />
    </>
  );
}
