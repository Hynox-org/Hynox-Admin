import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const settings = await db.collection("settings").findOne({});
    return NextResponse.json(settings || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const settings: { _id?: string } = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");

    // Remove _id from settings to prevent issues with upserting
    // MongoDB manages _id automatically, and including it in $set can cause errors
    const { _id, ...settingsWithoutId } = settings;

    await db.collection("settings").updateOne({}, { $set: settingsWithoutId }, { upsert: true });
    return NextResponse.json(settingsWithoutId);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
  }
}
