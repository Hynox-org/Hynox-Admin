import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Quotation } from "@/lib/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const quotations = await db.collection("quotations").find({}).toArray();
    return NextResponse.json(quotations);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch quotations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const quotation: Quotation = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    await db.collection("quotations").insertOne(quotation);
    return NextResponse.json(quotation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save quotation" }, { status: 500 });
  }
}
