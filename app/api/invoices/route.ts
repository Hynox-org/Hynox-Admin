import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Invoice } from "@/lib/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const invoices = await db.collection("invoices").find({}).toArray();
    return NextResponse.json(invoices);
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
    await db.collection("invoices").insertOne(invoice);
    return NextResponse.json(invoice);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save invoice" }, { status: 500 });
  }
}
