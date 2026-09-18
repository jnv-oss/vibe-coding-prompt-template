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

export interface Settlement {
  id: string;
  name: string;
  administratorUrl: string;
  deadline: string;
  summary: string;
  eligibilityQuestions: EligibilityQuestion[];
  claimFields: ClaimField[];
}
