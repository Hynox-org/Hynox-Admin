import type { Invoice, Quotation, CompanyInfo, Client, Service } from "@/lib/types"

const DEFAULT_COMPANY: CompanyInfo = {
  name: "the black crest",
  address: "8/1765, Ponnammal Nagar Main Road, Pandian Nagar, Tiruppur, Tamil Nadu 641602",
  email: "thehynoxofficial@gmail.com",
  phone: "+91 8870524355",
  gstNumber: "33CGZPV6446G1ZK",
  bankName: "",
  accountName: "the black crest",
  accountNumber: "23150200001119",
  ifsc: "FDRL0002315",
  branch: "NAMBIYAMPALAYAM",
  upi: "",
}

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  let finalUrl = url;
  // If running on the server, use a relative path for internal API calls
  // This avoids issues with the server trying to fetch from itself via HTTP
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  finalUrl = `${baseUrl}${url}`;

  const res = await fetch(finalUrl, { ...options, next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function listInvoices(): Promise<Invoice[]> {
  try {
    return await api<Invoice[]>("/api/invoices");
  } catch (error) {
    console.error("Error listing invoices:", error);
    return []; // Return an empty array on error
  }
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  return api<Invoice>(`/api/invoices/${id}`);
}

export async function saveInvoice(inv: Invoice) {
  const all = await listInvoices();
  const idx = all.findIndex((x) => x.id === inv.id);
  if (idx >= 0) {
    await api(`/api/invoices/${inv.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inv),
    });
  } else {
    await api("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inv),
    });
  }
}

export async function listQuotes(): Promise<Quotation[]> {
  return api<Quotation[]>("/api/quotations");
}

export async function getQuote(id: string): Promise<Quotation | undefined> {
  return api<Quotation>(`/api/quotations/${id}`);
}

export async function saveQuote(q: Quotation) {
  const all = await listQuotes();
  const idx = all.findIndex((x) => x.id === q.id);
  if (idx >= 0) {
    await api(`/api/quotations/${q.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
  } else {
    await api("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
  }
}

export async function listClients(): Promise<Client[]> {
  return api<Client[]>("/api/clients");
}

export async function listServices(): Promise<Service[]> {
  return api<Service[]>("/api/services");
}

export async function getCompany(): Promise<CompanyInfo> {
  return api<CompanyInfo>("/api/company");
}

export async function saveCompany(company: CompanyInfo) {
  await api("/api/company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });
}

export async function getDefaultTax(): Promise<number> {
  const settings = await api<{ defaultTax?: number }>("/api/settings");
  return settings.defaultTax ?? 18;
}

export async function saveDefaultTax(n: number) {
  const settings = await api<{ defaultTax?: number; defaultCurrency?: string }>("/api/settings");
  await api("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...settings, defaultTax: n }),
  });
}

export async function getDefaultCurrency(): Promise<string> {
  const settings = await api<{ defaultCurrency?: string }>("/api/settings");
  return settings.defaultCurrency ?? "INR";
}

export async function saveDefaultCurrency(cur: string) {
  const settings = await api<{ defaultTax?: number; defaultCurrency?: string }>("/api/settings");
  await api("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...settings, defaultCurrency: cur }),
  });
}
