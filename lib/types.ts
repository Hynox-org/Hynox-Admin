export type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  selectedServiceId?: string
}

export type PartyInfo = {
  name: string
  email?: string
  address?: string
  phone?: string
}

export type CompanyInfo = {
  name: string
  address?: string
  email?: string
  phone?: string
  gstNumber?: string
  bankName?: string
  accountNumber?: string
  ifsc?: string
  upi?: string
  accountName?: string
  branch?: string
}

export type Invoice = {
  id: string
  number: string
  issueDate: string
  dueDate?: string
  from: PartyInfo
  to: PartyInfo
  items: LineItem[]
  cgstRate?: number // percent, e.g. 10 => 10%
  sgstRate?: number // percent, e.g. 10 => 10%
  igstRate?: number // percent, e.g. 10 => 10%
  discount?: number // absolute currency discount
  notes?: string
  currency: string
  subtotal: number
  tax: number
  total: number
  status: "Draft" | "Pending" | "Sent" | "Paid",
  deletedAt?: Date,
}

export type Quotation = {
  id: string
  number: string
  issueDate: string
  validUntil?: string
  from: PartyInfo
  to: PartyInfo
  items: LineItem[]
  cgstRate?: number // percent, e.g. 10 => 10%
  sgstRate?: number // percent, e.g. 10 => 10%
  igstRate?: number // percent, e.g. 10 => 10%
  discount?: number
  notes?: string
  currency: string
  subtotal: number
  tax: number
  total: number
  status: "Draft" | "Sent" | "Accepted" | "Rejected",
  deletedAt?: Date,
}

export function calcSubtotal(items: LineItem[] | undefined | null): number {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  return Number(items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0).toFixed(2))
}

export function calcTax(subtotal: number, cgstRate: number, sgstRate: number, igstRate: number): number {
  const totalTaxRate = (Number(cgstRate) || 0) + (Number(sgstRate) || 0) + (Number(igstRate) || 0);
  return Number(((totalTaxRate / 100) * subtotal).toFixed(2));
}

export type Client = {
  _id?: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  deletedAt?: Date;
};

export type Service = {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  deletedAt?: Date;
};
