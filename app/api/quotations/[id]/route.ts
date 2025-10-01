import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Quotation } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const quotation = await db.collection("quotations").findOne({ _id: new ObjectId(params.id), deletedAt: null });
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get("hardDelete") === "true";

    if (hardDelete) {
      await db.collection("quotations").deleteOne({ _id: new ObjectId(params.id) });
      return NextResponse.json({ message: "Quotation permanently deleted" });
    } else {
      await db.collection("quotations").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { deletedAt: new Date() } }
      );
      return NextResponse.json({ message: "Quotation soft-deleted" });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to delete quotation" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedFields = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");

    // If only status is being updated, handle it directly
    if (Object.keys(updatedFields).length === 1 && updatedFields.status) {
      await db.collection("quotations").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { status: updatedFields.status } }
      );
      return NextResponse.json({ message: "Quotation status updated", id: params.id, status: updatedFields.status });
    }

    // For full quotation updates, remove the client-side 'id' field and use MongoDB's '_id'
    const { id, ...quotationToUpdate } = updatedFields;
    await db.collection("quotations").updateOne({ _id: new ObjectId(params.id) }, { $set: quotationToUpdate });
    return NextResponse.json({ ...quotationToUpdate, id: params.id }); // Return updated quotation with client-side 'id'
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update quotation" }, { status: 500 });
  }
}
