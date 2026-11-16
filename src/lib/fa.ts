const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toFa = (value: string | number): string =>
  String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const formatClock = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${toFa(String(m).padStart(2, '0'))}:${toFa(String(s).padStart(2, '0'))}`;
};

export const formatDateTime = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  } catch {
    return date.toLocaleString();
  }
};
