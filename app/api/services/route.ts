import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Service } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const services = await db.collection("services").find({ deletedAt: null }).map(service => ({ ...service, _id: service._id.toString() })).toArray();
    return NextResponse.json(services);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const serviceData: Omit<Service, "_id"> = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const result = await db.collection("services").insertOne(serviceData);
    return NextResponse.json({ ...serviceData, _id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save service" }, { status: 500 });
  }
}
