import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const admins = await db.collection("admins").find({ deletedAt: null }).map(admin => ({ ...admin, _id: admin._id.toString() })).toArray();
    return NextResponse.json(admins);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch admins" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hynox-billing");

    const existingAdmin = await db.collection("admins").findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("admins").insertOne({ email, password: hashedPassword });
    return NextResponse.json({ email, _id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to create admin" }, { status: 500 });
  }
}
