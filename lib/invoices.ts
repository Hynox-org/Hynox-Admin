import { Invoice } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const url = `${BASE_URL}/api/invoices/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch invoice: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    return null;
  }
}

export async function updateInvoice(invoice: Invoice): Promise<Invoice> {
  try {
    const url = `${BASE_URL}/api/invoices/${invoice.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error(`Failed to update invoice: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}
