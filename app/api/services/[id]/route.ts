import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Service } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const serviceData = await db.collection("services").findOne({ _id: new ObjectId(params.id), deletedAt: null });
    if (!serviceData) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ ...serviceData, _id: serviceData._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch service" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceData: Omit<Service, "_id"> = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    await db.collection("services").updateOne({ _id: new ObjectId(params.id) }, { $set: serviceData });
    return NextResponse.json({ ...serviceData, _id: params.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get("hardDelete") === "true";

    if (hardDelete) {
      await db.collection("services").deleteOne({ _id: new ObjectId(params.id) });
      return NextResponse.json({ message: "Service permanently deleted" });
    } else {
      await db.collection("services").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { deletedAt: new Date() } }
      );
      return NextResponse.json({ message: "Service soft-deleted" });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to delete service" }, { status: 500 });
  }
}
