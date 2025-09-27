import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Client } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const clientData = await db.collection("clients").findOne({ _id: new ObjectId(params.id) });
    if (!clientData) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ ...clientData, _id: clientData._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch client" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientData: Omit<Client, "_id"> = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    await db.collection("clients").updateOne({ _id: new ObjectId(params.id) }, { $set: clientData });
    return NextResponse.json({ ...clientData, _id: params.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    await db.collection("clients").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: "Client deleted" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to delete client" }, { status: 500 });
  }
}
