import { Quotation } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";

export async function getQuotationById(id: string): Promise<Quotation | null> {
  try {
    const url = `${BASE_URL}/api/quotations/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch quotation: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching quotation by ID:", error);
    return null;
  }
}

export async function updateQuotation(quotation: Quotation): Promise<Quotation> {
  try {
    const url = `${BASE_URL}/api/quotations/${quotation.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotation),
    });
    if (!response.ok) {
      throw new Error(`Failed to update quotation: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating quotation:", error);
    throw error;
  }
}
