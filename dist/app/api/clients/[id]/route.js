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
import { ObjectId } from "mongodb";
export function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            const clientData = yield db.collection("clients").findOne({ _id: new ObjectId(params.id) });
            if (!clientData) {
                return NextResponse.json({ error: "Client not found" }, { status: 404 });
            }
            return NextResponse.json(Object.assign(Object.assign({}, clientData), { _id: clientData._id.toString() }));
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch client" }, { status: 500 });
        }
    });
}
export function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const clientData = yield req.json();
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("clients").updateOne({ _id: new ObjectId(params.id) }, { $set: clientData });
            return NextResponse.json(Object.assign(Object.assign({}, clientData), { _id: params.id }));
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to update client" }, { status: 500 });
        }
    });
}
export function DELETE(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("clients").deleteOne({ _id: new ObjectId(params.id) });
            return NextResponse.json({ message: "Client deleted" });
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to delete client" }, { status: 500 });
        }
    });
}
