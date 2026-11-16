import type { IconName } from '../types';

export interface EmergencyNumber {
  dial: string;
  display: string;
  title: string;
  desc: string;
  category: string;
  icon: IconName;
  primary?: boolean;
}

export const emergencyNumbers: EmergencyNumber[] = [
  {
    dial: '115',
    display: '۱۱۵',
    title: 'اورژانس',
    desc: 'فوریت‌های پزشکی، آمبولانس و راهنمایی تلفنی',
    category: 'پزشکی و امداد',
    icon: 'sos',
    primary: true,
  },
  {
    dial: '112',
    display: '۱۱۲',
    title: 'هلال احمر',
    desc: 'امداد و نجات در حوادث و سوانح',
    category: 'پزشکی و امداد',
    icon: 'shield',
    primary: true,
  },
  {
    dial: '125',
    display: '۱۲۵',
    title: 'آتش‌نشانی',
    desc: 'حریق، نجات و حوادث ساختمانی',
    category: 'ایمنی و انتظامی',
    icon: 'flame',
  },
  {
    dial: '110',
    display: '۱۱۰',
    title: 'پلیس',
    desc: 'امنیت، تصادف و نظم عمومی',
    category: 'ایمنی و انتظامی',
    icon: 'shield',
  },
  {
    dial: '141',
    display: '۱۴۱',
    title: 'راهداری',
    desc: 'وضعیت راه‌ها و امداد جاده‌ای',
    category: 'ایمنی و انتظامی',
    icon: 'map',
  },
  {
    dial: '121',
    display: '۱۲۱',
    title: 'برق',
    desc: 'قطعی و خطرات شبکه برق',
    category: 'خدمات شهری',
    icon: 'alert',
  },
  {
    dial: '122',
    display: '۱۲۲',
    title: 'آب',
    desc: 'حوادث و قطعی آب',
    category: 'خدمات شهری',
    icon: 'droplet',
  },
  {
    dial: '194',
    display: '۱۹۴',
    title: 'گاز',
    desc: 'نشت گاز و خطرات گاز شهری',
    category: 'خدمات شهری',
    icon: 'flame',
  },
];

export const numberCategories = ['پزشکی و امداد', 'ایمنی و انتظامی', 'خدمات شهری'] as const;

export const medicalNumbers = emergencyNumbers.filter((n) => n.category === 'پزشکی و امداد');
