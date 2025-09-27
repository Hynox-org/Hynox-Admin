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
            const clients = yield db.collection("clients").find({}).map(client => (Object.assign(Object.assign({}, client), { _id: client._id.toString() }))).toArray();
            return NextResponse.json(clients);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch clients" }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientData = yield req.json(); // Omit _id as MongoDB will generate it
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            const result = yield db.collection("clients").insertOne(clientData);
            return NextResponse.json(Object.assign(Object.assign({}, clientData), { _id: result.insertedId.toString() }));
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to save client" }, { status: 500 });
        }
    });
}
