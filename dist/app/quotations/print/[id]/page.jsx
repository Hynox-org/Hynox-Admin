"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrintLayout from "@/components/print-layout";
import ShareButtons from "@/components/share-buttons";
import { Button } from "@/components/ui/button";
import { getCompany, getQuote } from "@/lib/storage";
function money(n, currency) {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
    }
    catch (_a) {
        return `${currency} ${n.toFixed(2)}`;
    }
}
export default function QuotePrintPage() {
    var _a, _b, _c;
    const params = useParams();
    const router = useRouter();
    const [quote, setQuote] = useState(null);
    const [shareUrl, setShareUrl] = useState("");
    useEffect(() => {
        const q = getQuote(params.id);
        setQuote(q !== null && q !== void 0 ? q : null);
        if (typeof window !== "undefined")
            setShareUrl(window.location.href);
    }, [params.id]);
    const company = getCompany();
    const title = useMemo(() => (quote ? `Quotation ${quote.number}` : "Quotation"), [quote]);
    if (!quote) {
        return (<main className="p-6">
        <p className="text-sm text-muted-foreground">Quotation not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/quotations")}>
          Back to Quotations
        </Button>
      </main>);
    }
    const subject = `Quotation ${quote.number} - ${company.name}`;
    const message = `Dear ${((_a = quote.to) === null || _a === void 0 ? void 0 : _a.name) || "Client"},\nPlease find your quotation ${quote.number} totaling ${quote.total} ${quote.currency}.`;
    return (<main className="p-0 bg-background">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between no-print">
          <ShareButtons url={shareUrl} subject={subject} message={message} whatsappTo={company.phone}/>
          <Button variant="secondary" onClick={() => history.back()}>
            Back
          </Button>
        </div>
        <PrintLayout docTitle="Quotation" docNumber={quote.number} dateLabel="Quotation Date" dateValue={quote.issueDate} company={company} billToName={((_b = quote.to) === null || _b === void 0 ? void 0 : _b.name) || "-"} billToAddress={(_c = quote.to) === null || _c === void 0 ? void 0 : _c.address} items={quote.items} showTax taxPercent={quote.taxRate || 0} notes={quote.notes}/>
      </div>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <title>{title}</title>
      <meta name="description" content="Quotation - Hynox"/>
    </main>);
}
