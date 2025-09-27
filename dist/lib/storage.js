var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DEFAULT_COMPANY = {
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
function api(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = yield fetch(`${baseUrl}${url}`, options);
        if (!res.ok) {
            throw new Error(`API request failed: ${res.statusText}`);
        }
        return res.json();
    });
}
export function listInvoices() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield api("/api/invoices");
        }
        catch (error) {
            console.error("Error listing invoices:", error);
            return []; // Return an empty array on error
        }
    });
}
export function getInvoice(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return api(`/api/invoices/${id}`);
    });
}
export function saveInvoice(inv) {
    return __awaiter(this, void 0, void 0, function* () {
        const all = yield listInvoices();
        const idx = all.findIndex((x) => x.id === inv.id);
        if (idx >= 0) {
            yield api(`/api/invoices/${inv.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inv),
            });
        }
        else {
            yield api("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inv),
            });
        }
    });
}
export function listQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        return api("/api/quotations");
    });
}
export function getQuote(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return api(`/api/quotations/${id}`);
    });
}
export function saveQuote(q) {
    return __awaiter(this, void 0, void 0, function* () {
        const all = yield listQuotes();
        const idx = all.findIndex((x) => x.id === q.id);
        if (idx >= 0) {
            yield api(`/api/quotations/${q.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(q),
            });
        }
        else {
            yield api("/api/quotations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(q),
            });
        }
    });
}
export function listClients() {
    return __awaiter(this, void 0, void 0, function* () {
        return api("/api/clients");
    });
}
export function getCompany() {
    return __awaiter(this, void 0, void 0, function* () {
        return api("/api/company");
    });
}
export function saveCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api("/api/company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(company),
        });
    });
}
export function getDefaultTax() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const settings = yield api("/api/settings");
        return (_a = settings.defaultTax) !== null && _a !== void 0 ? _a : 18;
    });
}
export function saveDefaultTax(n) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield api("/api/settings");
        yield api("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign(Object.assign({}, settings), { defaultTax: n })),
        });
    });
}
export function getDefaultCurrency() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const settings = yield api("/api/settings");
        return (_a = settings.defaultCurrency) !== null && _a !== void 0 ? _a : "INR";
    });
}
export function saveDefaultCurrency(cur) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield api("/api/settings");
        yield api("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign(Object.assign({}, settings), { defaultCurrency: cur })),
        });
    });
}
