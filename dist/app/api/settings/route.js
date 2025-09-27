var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            const settings = yield db.collection("settings").findOne({});
            return NextResponse.json(settings || {});
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to fetch settings" }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const settings = yield req.json();
            const client = yield clientPromise;
            const db = client.db("hynox-billing");
            // Remove _id from settings to prevent issues with upserting
            // MongoDB manages _id automatically, and including it in $set can cause errors
            const { _id } = settings, settingsWithoutId = __rest(settings, ["_id"]);
            yield db.collection("settings").updateOne({}, { $set: settingsWithoutId }, { upsert: true });
            return NextResponse.json(settingsWithoutId);
        }
        catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
        }
    });
}
