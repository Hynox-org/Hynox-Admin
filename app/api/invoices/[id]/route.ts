import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Invoice } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(params.id) });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    // Map _id to id for client-side consistency
    const clientInvoice = { ...invoice, id: invoice._id.toString() };
    return NextResponse.json(clientInvoice);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch invoice" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice: Invoice = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    // Remove the client-side 'id' field and use MongoDB's '_id' for the update query
    const { id, ...invoiceToUpdate } = invoice;
    await db.collection("invoices").updateOne({ _id: new ObjectId(params.id) }, { $set: invoiceToUpdate });
    return NextResponse.json({ ...invoiceToUpdate, id: params.id }); // Return updated invoice with client-side 'id'
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update invoice" }, { status: 500 });
  }
}
