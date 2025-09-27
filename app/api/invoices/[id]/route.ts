import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Invoice } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const invoice = await db.collection("invoices").findOne({ id: params.id });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice);
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
    await db.collection("invoices").updateOne({ id: params.id }, { $set: invoice });
    return NextResponse.json(invoice);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update invoice" }, { status: 500 });
  }
}
