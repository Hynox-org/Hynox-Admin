"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrintLayout from "@/components/print-layout";
import ShareButtons from "@/components/share-buttons";
import { Button } from "@/components/ui/button";
import { getCompany, getInvoice } from "@/lib/storage";
function money(n, currency) {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
    }
    catch (_a) {
        return `${currency} ${n.toFixed(2)}`;
    }
}
export default function InvoicePrintPage() {
    var _a, _b, _c;
    const params = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [shareUrl, setShareUrl] = useState("");
    useEffect(() => {
        const inv = getInvoice(params.id);
        setInvoice(inv !== null && inv !== void 0 ? inv : null);
        if (typeof window !== "undefined")
            setShareUrl(window.location.href);
    }, [params.id]);
    const company = getCompany();
    const title = useMemo(() => (invoice ? `Invoice ${invoice.number}` : "Invoice"), [invoice]);
    if (!invoice) {
        return (<main className="p-6">
        <p className="text-sm text-muted-foreground">Invoice not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/invoices")}>
          Back to Invoices
        </Button>
      </main>);
    }
    const subject = `Invoice ${invoice.number} - ${company.name}`;
    const message = `Dear ${((_a = invoice.to) === null || _a === void 0 ? void 0 : _a.name) || "Client"},\nPlease find your tax invoice ${invoice.number} totaling ${invoice.total} ${invoice.currency}.`;
    return (<main className="p-0 bg-background">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between no-print">
          <ShareButtons url={shareUrl} subject={subject} message={message} whatsappTo={company.phone}/>
          <Button variant="secondary" onClick={() => history.back()}>
            Back
          </Button>
        </div>
        <PrintLayout docTitle="Tax Invoice" docNumber={invoice.number} dateLabel="Invoice Date" dateValue={invoice.issueDate} company={company} billToName={((_b = invoice.to) === null || _b === void 0 ? void 0 : _b.name) || "-"} billToAddress={(_c = invoice.to) === null || _c === void 0 ? void 0 : _c.address} items={invoice.items} showTax taxPercent={invoice.taxRate || 0} notes={invoice.notes}/>
      </div>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <title>{title}</title>
      <meta name="description" content="Invoice - Hynox"/>
    </main>);
}
