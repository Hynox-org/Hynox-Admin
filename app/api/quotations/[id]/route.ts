import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Quotation } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const quotation = await db.collection("quotations").findOne({ id: params.id });
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }
    return NextResponse.json(quotation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch quotation" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quotation: Quotation = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    await db.collection("quotations").updateOne({ id: params.id }, { $set: quotation });
    return NextResponse.json(quotation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update quotation" }, { status: 500 });
  }
}
