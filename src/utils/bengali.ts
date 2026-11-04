// Utilities for Bengali digits conversion and localized text

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBengaliNumber(val: number | string): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return str.replace(/[0-9]/g, (match) => {
    return BENGALI_DIGITS[parseInt(match, 10)] ?? match;
  });
}

export function toEnglishNumber(str: string): string {
  if (!str) return '';
  let out = str;
  for (let i = 0; i < 10; i++) {
    out = out.split(BENGALI_DIGITS[i]).join(ENGLISH_DIGITS[i]);
  }
  return out;
}

export function formatLocalizedNumber(num: number, lang: 'bn' | 'en', maxDecimals: number = 8): string {
  if (isNaN(num)) return lang === 'bn' ? 'অসংজ্ঞায়িত' : 'Error';
  if (!isFinite(num)) return lang === 'bn' ? 'অসীম (∞)' : 'Infinity';

  // Avoid scientific notation for standard numbers, but limit precision
  let formatted = '';
  if (Math.abs(num) >= 1e15 || (Math.abs(num) > 0 && Math.abs(num) < 1e-6)) {
    formatted = num.toExponential(4);
  } else {
    // Round to avoid floating point weirdness (e.g. 0.1 + 0.2 = 0.30000000000000004)
    const factor = Math.pow(10, maxDecimals);
    const rounded = Math.round((num + Number.EPSILON) * factor) / factor;
    formatted = rounded.toString();
  }

  // Add thousands separators for readability before decimal point
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const combined = parts.join('.');

  return lang === 'bn' ? toBengaliNumber(combined) : combined;
}
