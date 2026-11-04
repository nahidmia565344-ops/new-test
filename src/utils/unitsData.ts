import { UnitCategory } from '../types.ts';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    nameEn: 'Length',
    nameBn: 'দৈর্ঘ্য',
    baseUnit: 'm',
    units: [
      { id: 'm', nameEn: 'Meter', nameBn: 'মিটার', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', nameEn: 'Kilometer', nameBn: 'কিলোমিটার', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', nameEn: 'Centimeter', nameBn: 'সেন্টিমিটার', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', nameEn: 'Millimeter', nameBn: 'মিলিমিটার', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', nameEn: 'Mile', nameBn: 'মাইল', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', nameEn: 'Yard (Goj)', nameBn: 'গজ (Yard)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', nameEn: 'Foot', nameBn: 'ফুট', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', nameEn: 'Inch', nameBn: 'ইঞ্চি', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'nmi', nameEn: 'Nautical Mile', nameBn: 'নটিক্যাল মাইল', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 }
    ]
  },
  {
    id: 'mass',
    nameEn: 'Mass / Weight',
    nameBn: 'ওজন / ভর',
    baseUnit: 'kg',
    units: [
      { id: 'kg', nameEn: 'Kilogram', nameBn: 'কিলোগ্রাম', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', nameEn: 'Gram', nameBn: 'গ্রাম', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', nameEn: 'Milligram', nameBn: 'মিলিগ্রাম', symbol: 'mg', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 'ton', nameEn: 'Metric Ton', nameBn: 'মেট্রিক টন', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'lb', nameEn: 'Pound', nameBn: 'পাউন্ড', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', nameEn: 'Ounce', nameBn: 'আউন্স', symbol: 'oz', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
      { id: 'bhori', nameEn: 'Bhori / Tola (Gold)', nameBn: 'ভরি / তোলা (স্বর্ণ)', symbol: 'ভরি', toBase: (v) => (v * 11.664) / 1000, fromBase: (v) => (v * 1000) / 11.664 },
      { id: 'ana', nameEn: 'Ana (Gold)', nameBn: 'আনা', symbol: 'আনা', toBase: (v) => (v * 0.729) / 1000, fromBase: (v) => (v * 1000) / 0.729 },
      { id: 'roti', nameEn: 'Roti (Gold)', nameBn: 'রতি', symbol: 'রতি', toBase: (v) => (v * 0.1215) / 1000, fromBase: (v) => (v * 1000) / 0.1215 },
      { id: 'mon', nameEn: 'Maund (Mon - 40kg)', nameBn: 'মণ (৪০ কেজি)', symbol: 'মণ', toBase: (v) => v * 40, fromBase: (v) => v / 40 }
    ]
  },
  {
    id: 'area',
    nameEn: 'Area',
    nameBn: 'ক্ষেত্রফল / জমি পরিমাপ',
    baseUnit: 'sqm',
    units: [
      { id: 'sqm', nameEn: 'Square Meter', nameBn: 'বর্গমিটার', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'sqft', nameEn: 'Square Foot', nameBn: 'বর্গফুট', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'sqkm', nameEn: 'Square Kilometer', nameBn: 'বর্গকিলোমিটার', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'acre', nameEn: 'Acre', nameBn: 'একর', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
      { id: 'hectare', nameEn: 'Hectare', nameBn: 'হেক্টর', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'shatak', nameEn: 'Shatak / Decimal', nameBn: 'শতক / ডেসিমেল', symbol: 'শতক', toBase: (v) => v * 40.4686, fromBase: (v) => v / 40.4686 },
      { id: 'katha', nameEn: 'Katha (Cottah)', nameBn: 'কাঠা', symbol: 'কাঠা', toBase: (v) => v * 66.8903, fromBase: (v) => v / 66.8903 },
      { id: 'bigha', nameEn: 'Bigha (20 Katha)', nameBn: 'বিঘা', symbol: 'বিঘা', toBase: (v) => v * 1337.8, fromBase: (v) => v / 1337.8 }
    ]
  },
  {
    id: 'temperature',
    nameEn: 'Temperature',
    nameBn: 'তাপমাত্রা',
    baseUnit: 'c',
    units: [
      { id: 'c', nameEn: 'Celsius', nameBn: 'সেলসিয়াস', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', nameEn: 'Fahrenheit', nameBn: 'ফারেনহাইট', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', nameEn: 'Kelvin', nameBn: 'কেলভিন', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    ]
  },
  {
    id: 'volume',
    nameEn: 'Volume',
    nameBn: 'আয়তন / ধারণক্ষমতা',
    baseUnit: 'l',
    units: [
      { id: 'l', nameEn: 'Liter', nameBn: 'লিটার', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', nameEn: 'Milliliter', nameBn: 'মিলিমিটার / সিসি', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'cum', nameEn: 'Cubic Meter', nameBn: 'ঘনমিটার', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'gal_us', nameEn: 'Gallon (US)', nameBn: 'গ্যালন (ইউএস)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'cup', nameEn: 'Cup (Metric)', nameBn: 'কাপ (Cup)', symbol: 'cup', toBase: (v) => v * 0.25, fromBase: (v) => v / 0.25 }
    ]
  },
  {
    id: 'speed',
    nameEn: 'Speed',
    nameBn: 'গতিবেগ',
    baseUnit: 'mps',
    units: [
      { id: 'mps', nameEn: 'Meter/Second', nameBn: 'মিটার/সেকেন্ড', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', nameEn: 'Kilometer/Hour', nameBn: 'কিলোমিটার/ঘণ্টা', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', nameEn: 'Miles/Hour', nameBn: 'মাইল/ঘণ্টা', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', nameEn: 'Knot (Nautical)', nameBn: 'নট', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 }
    ]
  },
  {
    id: 'storage',
    nameEn: 'Digital Storage',
    nameBn: 'ডিজিটাল মেমোরি / ডেটা',
    baseUnit: 'mb',
    units: [
      { id: 'b', nameEn: 'Byte', nameBn: 'বাইট', symbol: 'B', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
      { id: 'kb', nameEn: 'Kilobyte', nameBn: 'কিলোবাইট (KB)', symbol: 'KB', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
      { id: 'mb', nameEn: 'Megabyte', nameBn: 'মেগাবাইট (MB)', symbol: 'MB', toBase: (v) => v, fromBase: (v) => v },
      { id: 'gb', nameEn: 'Gigabyte', nameBn: 'গিগাবাইট (GB)', symbol: 'GB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'tb', nameEn: 'Terabyte', nameBn: 'টেরাবাইট (TB)', symbol: 'TB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) }
    ]
  },
  {
    id: 'time',
    nameEn: 'Time',
    nameBn: 'সময়',
    baseUnit: 's',
    units: [
      { id: 's', nameEn: 'Second', nameBn: 'সেকেন্ড', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', nameEn: 'Minute', nameBn: 'মিনিট', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'h', nameEn: 'Hour', nameBn: 'ঘণ্টা', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'd', nameEn: 'Day', nameBn: 'দিন', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'w', nameEn: 'Week', nameBn: 'সপ্তাহ', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: 'y', nameEn: 'Year (365d)', nameBn: 'বছর', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 }
    ]
  }
];
