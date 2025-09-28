import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Quotation } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const quotation = await db.collection("quotations").findOne({ _id: new ObjectId(params.id) });
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }
    // Map _id to id for client-side consistency
    const clientQuotation = { ...quotation, id: quotation._id.toString() };
    return NextResponse.json(clientQuotation);
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
    // Remove the client-side 'id' field and use MongoDB's '_id' for the update query
    const { id, ...quotationToUpdate } = quotation;
    await db.collection("quotations").updateOne({ _id: new ObjectId(params.id) }, { $set: quotationToUpdate });
    return NextResponse.json({ ...quotationToUpdate, id: params.id }); // Return updated quotation with client-side 'id'
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update quotation" }, { status: 500 });
  }
}
