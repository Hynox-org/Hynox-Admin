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
export function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            const invoice = yield db.collection("invoices").findOne({ id: params.id });
            if (!invoice) {
                return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
            }
            return NextResponse.json(invoice);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch invoice" }, { status: 500 });
        }
    });
}
export function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const invoice = yield req.json();
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("invoices").updateOne({ id: params.id }, { $set: invoice });
            return NextResponse.json(invoice);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to update invoice" }, { status: 500 });
        }
    });
}
