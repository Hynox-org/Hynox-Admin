import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Invoice } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(params.id), deletedAt: null });
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get("hardDelete") === "true";

    if (hardDelete) {
      await db.collection("invoices").deleteOne({ _id: new ObjectId(params.id) });
      return NextResponse.json({ message: "Invoice permanently deleted" });
    } else {
      await db.collection("invoices").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { deletedAt: new Date() } }
      );
      return NextResponse.json({ message: "Invoice soft-deleted" });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to delete invoice" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedFields = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");

    // If only status is being updated, handle it directly
    if (Object.keys(updatedFields).length === 1 && updatedFields.status) {
      await db.collection("invoices").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { status: updatedFields.status } }
      );
      return NextResponse.json({ message: "Invoice status updated", id: params.id, status: updatedFields.status });
    }

    // For full invoice updates, remove the client-side 'id' field and use MongoDB's '_id'
    const { id, ...invoiceToUpdate } = updatedFields;
    await db.collection("invoices").updateOne({ _id: new ObjectId(params.id) }, { $set: invoiceToUpdate });
    return NextResponse.json({ ...invoiceToUpdate, id: params.id }); // Return updated invoice with client-side 'id'
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update invoice" }, { status: 500 });
  }
}
