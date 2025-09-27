var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            const quotations = yield db.collection("quotations").find({}).toArray();
            return NextResponse.json(quotations);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch quotations" }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quotation = yield req.json();
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("quotations").insertOne(quotation);
            return NextResponse.json(quotation);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to save quotation" }, { status: 500 });
        }
    });
}
