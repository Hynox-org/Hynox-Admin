"use client"
import type { CompanyInfo, LineItem } from "@/lib/types"
import { calcSubtotal, calcTax } from "@/lib/types"
import { cn } from "@/lib/utils"

type Props = {
  docTitle: string // "Tax Invoice" or "Quotation"
  docNumber: string
  dateLabel: string // "Invoice Date" or "Quotation Date"
  dateValue: string
  company: CompanyInfo
  billToName: string
  billToAddress?: string
  items: LineItem[] | undefined | null
  showTax: boolean
  taxPercent?: number
  notes?: string
  className?: string
}

export default function PrintLayout({
  docTitle,
  docNumber,
  dateLabel,
  dateValue,
  company,
  billToName,
  billToAddress,
  items,
  showTax,
  taxPercent = 0,
  notes,
  className,
}: Props) {
  const subtotal = calcSubtotal(items)
  const tax = showTax ? calcTax(subtotal, taxPercent) : 0
  const total = subtotal + tax

  return (
    <div className={cn("bg-white text-black p-6 md:p-10 mx-auto w-full max-w-4xl", className)}>
      {/* Header */}
      <header className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/images/hynox-logo.jpg"
            alt="HYNOX logo"
            className="h-14 w-14 rounded-sm border border-gray-200 object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold">{company.name || "HYNOX"}</h1>
            {company.address && <p className="text-sm leading-6">{company.address}</p>}
            {(company.email || company.phone) && (
              <p className="text-sm">{[company.email, company.phone].filter(Boolean).join(" • ")}</p>
            )}
            {company.gstNumber && <p className="text-sm">GST Registration Number: {company.gstNumber}</p>}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold">{docTitle}</p>
          <p className="text-sm">
            <span className="font-medium">No:</span> {docNumber}
          </p>
          <p className="text-sm">
            <span className="font-medium">{dateLabel}:</span> {dateValue}
          </p>
        </div>
      </header>

      {/* Bill To */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium">Bill To</p>
          <p className="font-semibold">{billToName}</p>
          {billToAddress && <p className="text-sm leading-6">{billToAddress}</p>}
        </div>

        {/* Bank details */}
        <div className="md:text-right">
          <p className="text-sm font-medium">Bank Details</p>
          {company.bankName && <p className="text-sm">Bank: {company.bankName}</p>}
          <p className="text-sm">Account Name: {company.accountName || company.name}</p>
          {company.accountNumber && <p className="text-sm">Account No.: {company.accountNumber}</p>}
          {company.ifsc && <p className="text-sm">IFSC: {company.ifsc}</p>}
          {company.branch && <p className="text-sm">Branch: {company.branch}</p>}
          {company.upi && <p className="text-sm">UPI: {company.upi}</p>}
        </div>
      </section>

      {/* Items */}
      <section className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left font-medium w-10">#</th>
              <th className="py-2 text-left font-medium">Description</th>
              <th className="py-2 text-right font-medium w-24">Qty</th>
              <th className="py-2 text-right font-medium w-32">Unit Price</th>
              <th className="py-2 text-right font-medium w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((it, idx) => {
              const qty = Number(it.quantity) || 0
              const unit = Number(it.unitPrice) || 0
              const amt = qty * unit
              return (
                <tr key={it.id} className="border-b last:border-b-0">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2">{it.description}</td>
                  <td className="py-2 text-right">{qty}</td>
                  <td className="py-2 text-right">{unit.toFixed(2)}</td>
                  <td className="py-2 text-right">{amt.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* Totals */}
      <section className="mt-6 flex flex-col items-end gap-1">
        <div className="w-full max-w-sm grid grid-cols-2 gap-2">
          <div className="text-right font-medium">Subtotal</div>
          <div className="text-right">{Number(subtotal || 0).toFixed(2)}</div>

          {showTax && (
            <>
              <div className="text-right font-medium">Tax ({taxPercent}%)</div>
              <div className="text-right">{Number(tax || 0).toFixed(2)}</div>
            </>
          )}

          <div className="text-right font-semibold">Total</div>
          <div className="text-right font-semibold">{Number(total || 0).toFixed(2)}</div>
        </div>
      </section>

      {notes && (
        <section className="mt-8">
          <p className="text-sm font-medium">Notes</p>
          <p className="text-sm leading-6">{notes}</p>
        </section>
      )}

      <footer className="mt-10 text-center text-xs text-gray-500 print:mt-6">Thank you for your business.</footer>
    </div>
  )
}
