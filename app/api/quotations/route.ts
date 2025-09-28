import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Quotation } from "@/lib/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const quotations = await db.collection("quotations").find({}).toArray();
    // Map _id to id for client-side consistency
    const clientQuotations = quotations.map(quotation => ({ ...quotation, id: quotation._id.toString() }));
    return NextResponse.json(clientQuotations);
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
    // Remove the client-side 'id' field before inserting, let MongoDB generate _id
    const { id, ...quotationToInsert } = quotation;
    const result = await db.collection("quotations").insertOne(quotationToInsert);
    // Return the newly created quotation with MongoDB's _id mapped to client-side 'id'
    return NextResponse.json({ ...quotationToInsert, id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save quotation" }, { status: 500 });
  }
}
