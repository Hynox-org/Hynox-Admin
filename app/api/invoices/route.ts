import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Invoice } from "@/lib/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const invoices = await db.collection("invoices").find({ deletedAt: null }).toArray();
    // Map _id to id for client-side consistency
    const clientInvoices = invoices.map(invoice => ({ ...invoice, id: invoice._id.toString() }));
    return NextResponse.json(clientInvoices);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const invoice: Invoice = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    // Remove the client-side 'id' field before inserting, let MongoDB generate _id
    const { id, ...invoiceToInsert } = invoice;
    const result = await db.collection("invoices").insertOne(invoiceToInsert);
    // Return the newly created invoice with MongoDB's _id mapped to client-side 'id'
    return NextResponse.json({ ...invoiceToInsert, id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save invoice" }, { status: 500 });
  }
}
