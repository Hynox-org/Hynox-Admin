"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PrintLayout from "@/components/print-layout"
import ShareButtons from "@/components/share-buttons"
import { Button } from "@/components/ui/button"
import { getCompany, getInvoice } from "@/lib/storage"
import type { CompanyInfo, Invoice } from "@/lib/types"

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

export default function InvoicePrintPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      const inv = await getInvoice(params.id)
      setInvoice(inv ?? null)
      const c = await getCompany()
      setCompany(c ?? null)
      if (typeof window !== "undefined") setShareUrl(window.location.href)
    }
    fetchData()
  }, [params.id])

  const title = useMemo(() => (invoice ? `Invoice ${invoice.number}` : "Invoice"), [invoice])

  if (!invoice || !company) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">Loading invoice...</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/invoices")}>
          Back to Invoices
        </Button>
      </main>
    )
  }

  const subject = `Invoice ${invoice.number} - ${company.name}`
  const message = `Dear ${invoice.to?.name || "Client"},\nPlease find your tax invoice ${invoice.number} totaling ${invoice.total} ${invoice.currency}.`

  return (
    <main className="p-0 bg-background">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between no-print">
          <ShareButtons url={shareUrl} subject={subject} message={message} whatsappTo={company.phone} />
          <Button variant="secondary" onClick={() => history.back()}>
            Back
          </Button>
        </div>
        <PrintLayout
          docTitle="Tax Invoice"
          docNumber={invoice.number}
          dateLabel="Invoice Date"
          dateValue={invoice.issueDate}
          company={company}
          billToName={invoice.to?.name || "-"}
          billToAddress={invoice.to?.address}
          items={invoice.items || []}
          showTax
          taxPercent={invoice.taxRate || 0}
          notes={invoice.notes}
        />
      </div>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            color: black !important; /* Ensure text is black for printing */
          }
        }
      `}</style>
      <title>{title}</title>
      <meta name="description" content="Invoice - Hynox" />
    </main>
  )
}
