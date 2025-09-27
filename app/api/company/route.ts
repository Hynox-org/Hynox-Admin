import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { CompanyInfo } from "@/lib/types";

const DEFAULT_COMPANY: CompanyInfo = {
  name: "the black crest",
  address: "8/1765, Ponnammal Nagar Main Road, Pandian Nagar, Tiruppur, Tamil Nadu 641602",
  email: "thehynoxofficial@gmail.com",
  phone: "+91 8870524355",
  gstNumber: "33CGZPV6446G1ZK",
  bankName: "",
  accountName: "the black crest",
  accountNumber: "23150200001119",
  ifsc: "FDRL0002315",
  branch: "NAMBIYAMPALAYAM",
  upi: "",
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hynox-billing");
    let company = await db.collection("company").findOne({});
    if (!company) {
      await db.collection("company").insertOne({ ...DEFAULT_COMPANY });
      company = await db.collection("company").findOne({});
    }
    return NextResponse.json(company);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to fetch company info" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyInfo: CompanyInfo & { _id?: string } = await req.json();
    const client = await clientPromise;
    const db = client.db("hynox-billing");

    // Remove _id from companyInfo to prevent issues with upserting
    // MongoDB manages _id automatically, and including it in $set can cause errors
    const { _id, ...companyInfoWithoutId } = companyInfo;

    await db.collection("company").updateOne({}, { $set: companyInfoWithoutId }, { upsert: true });
    return NextResponse.json(companyInfoWithoutId);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to save company info" }, { status: 500 });
  }
}
