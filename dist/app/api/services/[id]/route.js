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
            const serviceData = yield db.collection("services").findOne({ _id: new ObjectId(params.id) });
            if (!serviceData) {
                return NextResponse.json({ error: "Service not found" }, { status: 404 });
            }
            return NextResponse.json(Object.assign(Object.assign({}, serviceData), { _id: serviceData._id.toString() }));
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch service" }, { status: 500 });
        }
    });
}
export function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const serviceData = yield req.json();
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("services").updateOne({ _id: new ObjectId(params.id) }, { $set: serviceData });
            return NextResponse.json(Object.assign(Object.assign({}, serviceData), { _id: params.id }));
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to update service" }, { status: 500 });
        }
    });
}
export function DELETE(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            yield db.collection("services").deleteOne({ _id: new ObjectId(params.id) });
            return NextResponse.json({ message: "Service deleted" });
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to delete service" }, { status: 500 });
        }
    });
}
