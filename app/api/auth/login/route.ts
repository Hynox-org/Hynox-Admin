import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Collection } from 'mongodb'; // Import Collection type for better type safety
import { IAdmin } from '@/models/Admin'; // Import IAdmin interface for type safety

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing"); // Assuming your database name is "hynox-billing"
    const adminsCollection: Collection<IAdmin> = db.collection<IAdmin>("admins");

    const { email, password } = await req.json();

    const admin = await adminsCollection.findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password!);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
