export interface ParsedSheet {
  spreadsheetId: string;
  spreadSheetTitle: string;
  sheetTitle: string;
  date: number;
}

export interface SignupItem {
  item: string;
  itemIndex: number;
  quantity: string;
  itemCount: number;
  notes: string;
}

export interface SignupSheet {
  date: string;
  location: string;
  tags: string[];
  title: string;
  description: string;
  signupItems: Array<SignupItem>;
  signees?: Array<Signee>;
  spreadsheetId: string;
  sheetTitle: string;
}

export interface Signup {
  spreadSheetId: string;
  sheetTitle: string;
  items: Array<{
    itemIndex: number;
    itemCount: number;
  }>;
}

export interface Signee extends SignupItem {
  name: string;
  phoneNumber: string;
  email: string;
  signedUpOn: Date;
}


export interface BhajanSignup {
  row: number;
  signupType: string;
  bhajanOrTFD: string;
  scale: string;
  notes: string;
  name: string;
  phoneNumber: string;
  email: string;
  signedUpOn: Date;
}

export interface BhajanSignupSheet {
  date: string;
  location: string;
  description: string;
  signups: Array<BhajanSignup>;
  signees?: Array<BhajanSignup>;
  spreadsheetId: string;
  sheetTitle: string;
}

export interface SignupForBhajanRequest {
  spreadSheetId: string;
  sheetTitle: string;
  row: number;
  bhajanOrTFD?: string;
  scale?: string;
  notes?: string;
}

export interface MySignups {
  service: Array<SignupSheet> | null;
  devotion: Array<BhajanSignupSheet> | null;
}
