export interface ParsedSheet {
  spreadsheetId: string;
  spreadSheetTitle: string;
  sheetTitle: string;
  date: Date;
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
  itemIndex: number;
  itemCount: number;
}

export interface Signee extends SignupItem {
  name: string;
  phoneNumber: string;
  email: string;
  signedUpOn: Date;
}
