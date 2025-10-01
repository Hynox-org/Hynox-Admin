"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PrintLayout from "@/components/print-layout"
import ShareButtons from "@/components/share-buttons"
import { Button } from "@/components/ui/button"
import { getCompany, getQuote } from "@/lib/storage"
import type { CompanyInfo, Quotation } from "@/lib/types"

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

export default function QuotePrintPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [quote, setQuote] = useState<Quotation | null>(null)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      const q = await getQuote(params.id)
      setQuote(q ?? null)
      const c = await getCompany()
      setCompany(c ?? null)
      if (typeof window !== "undefined") setShareUrl(window.location.href)
    }
    fetchData()
  }, [params.id])

  const title = useMemo(() => (quote ? `Quotation ${quote.number}` : "Quotation"), [quote])

  if (!quote || !company) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">Loading quotation...</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/quotations")}>
          Back to Quotations
        </Button>
      </main>
    )
  }

  const subject = `Quotation ${quote.number} - ${company.name}`
  const message = `Dear ${quote.to?.name || "Client"},\nPlease find your quotation ${quote.number} totaling ${quote.total} ${quote.currency}.`

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
          docTitle="Quotation"
          docNumber={quote.number}
          dateLabel="Quotation Date"
          dateValue={quote.issueDate}
          company={company}
          billToName={quote.to?.name || "-"}
          billToAddress={quote.to?.address}
          billToGstin={quote.to?.gstin}
          items={quote.items || []}
          showTax
          taxPercent={(quote.cgstRate || 0) + (quote.sgstRate || 0) + (quote.igstRate || 0)}
          notes={quote.notes}
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
      <meta name="description" content="Quotation - Hynox" />
    </main>
  )
}
