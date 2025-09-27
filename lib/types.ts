export type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
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
  taxRate?: number // percent, e.g. 10 => 10%
  discount?: number // absolute currency discount
  notes?: string
  currency: string
  subtotal: number
  tax: number
  total: number
  status: "Draft" | "Pending" | "Sent" | "Paid"
}

export type Quotation = {
  id: string
  number: string
  issueDate: string
  validUntil?: string
  from: PartyInfo
  to: PartyInfo
  items: LineItem[]
  taxRate?: number
  discount?: number
  notes?: string
  currency: string
  subtotal: number
  tax: number
  total: number
  status: "Draft" | "Sent" | "Accepted" | "Rejected"
}

export function calcSubtotal(items: LineItem[]): number {
  return Number(items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0).toFixed(2))
}

export function calcTax(subtotal: number, percent: number): number {
  return Number((((Number(percent) || 0) / 100) * subtotal).toFixed(2))
}

export type Client = {
  _id?: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
};

export type Service = {
  _id?: string;
  name: string;
  description?: string;
  price: number;
};
