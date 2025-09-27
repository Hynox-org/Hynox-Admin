import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    const admin = await db.collection("admins").findOne({ _id: new ObjectId(id) });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json({ ...admin, _id: admin._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch admin" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("hynox-billing");

    const updateData: { email?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const result = await db.collection("admins").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    const updatedAdmin = await db.collection("admins").findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ...updatedAdmin, _id: updatedAdmin?._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to update admin" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("hynox-billing");

    const result = await db.collection("admins").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to delete admin" }, { status: 500 });
  }
}
