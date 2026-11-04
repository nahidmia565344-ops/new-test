export type CalculatorMode = 
  | 'standard'
  | 'scientific'
  | 'unit_converter'
  | 'financial_emi'
  | 'age_date'
  | 'tip_split'
  | 'bmi_health';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: 'standard' | 'scientific';
}

export type AngleMode = 'DEG' | 'RAD';

export type Language = 'bn' | 'en';

export type CurrencySymbol = '৳' | '$' | '€' | '£' | '₹' | '¥';

export interface UnitCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  baseUnit: string;
  units: {
    id: string;
    nameEn: string;
    nameBn: string;
    symbol: string;
    toBase: (val: number) => number;
    fromBase: (val: number) => number;
  }[];
}
