export interface EligibilityQuestion {
  id: string;
  text: string;
  required: boolean;
}

export interface ClaimField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'date';
  optional?: boolean;
}

export type SettlementCategory = 'data-breach' | 'antitrust' | 'healthcare-privacy' | 'product-liability';

export const SETTLEMENT_CATEGORY_LABELS: Record<SettlementCategory, string> = {
  'data-breach': 'Data breach',
  antitrust: 'Antitrust',
  'healthcare-privacy': 'Healthcare privacy',
  'product-liability': 'Product liability',
};

export interface Settlement {
  id: string;
  name: string;
  administratorUrl: string;
  deadline: string;
  category: SettlementCategory;
  summary: string;
  eligibilityQuestions: EligibilityQuestion[];
  claimFields: ClaimField[];
}
