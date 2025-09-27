import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Client } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const clients = await db.collection("clients").find({}).map(client => ({ ...client, _id: client._id.toString() })).toArray();
    return NextResponse.json(clients);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientData: Omit<Client, "_id"> = await req.json(); // Omit _id as MongoDB will generate it
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const result = await db.collection("clients").insertOne(clientData);
    return NextResponse.json({ ...clientData, _id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save client" }, { status: 500 });
  }
}
