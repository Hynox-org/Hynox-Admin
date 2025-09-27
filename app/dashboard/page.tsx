import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsCards } from "@/components/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Invoice, Quotation, Client } from "@/lib/types"
import { listClients, listInvoices, listQuotes } from "@/lib/storage"
import { Stat } from "@/components/stats-cards" // Assuming Stat type is exported

interface DashboardData {
  invoices: Invoice[];
  quotations: Quotation[];
  clients: Client[];
  status: "success" | "error";
  message: string;
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const [invoices, quotations, clients] = await Promise.all([
      listInvoices(),
      listQuotes(),
      listClients(),
    ])
    return { invoices, quotations, clients, status: "success", message: "Dashboard data loaded" }
  } catch (e: any) {
    return { invoices: [], quotations: [], clients: [], status: "error", message: e.message }
  }
}

function formatCurrency(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

import { Toaster } from "@/components/ui/toaster"
import DashboardClientWrapper from "@/app/dashboard/dashboard-client-wrapper"
import DashboardAuthWrapper from "./dashboard-auth-wrapper" // Import the new wrapper

export default async function DashboardPage() {
  const { invoices, quotations, clients, status, message } = await getDashboardData()

  const totalInvoices = invoices.length
  const totalQuotations = quotations.length
  const totalClients = clients.length

  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalQuotationAmount = quotations.reduce((sum, quotation) => sum + quotation.total, 0)
  const pendingPayments = invoices
    .filter((invoice) => invoice.status === "Pending")
    .reduce((sum, invoice) => sum + invoice.total, 0)

  const stats: Stat[] = [
    { title: "Total Invoices", value: totalInvoices.toString() },
    { title: "Total Quotations", value: totalQuotations.toString() },
    { title: "Total Clients", value: totalClients.toString() },
    { title: "Pending Payments", value: formatCurrency(pendingPayments) },
    { title: "Total Invoice Amount", value: formatCurrency(totalInvoiceAmount) },
    { title: "Total Quotation Amount", value: formatCurrency(totalQuotationAmount) },
  ]

  const recentQuotations = quotations.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5)
  const recentInvoices = invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5)

  return (
    <DashboardAuthWrapper> {/* Wrap the entire content */}
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-balance">Dashboard</h1>
            <div className="flex gap-2">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/quotations">New Quotation</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/invoices">New Invoice</Link>
              </Button>
            </div>
          </header>

          <div className="mt-6">
            <StatsCards stats={stats} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Recent Quotations</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentQuotationsList quotations={recentQuotations} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentInvoicesList invoices={recentInvoices} />
              </CardContent>
            </Card>
          </div>
          <DashboardClientWrapper status={status} message={message} />
        </section>
        <Toaster />
      </main>
    </DashboardAuthWrapper>
  )
}

function RecentQuotationsList({ quotations }: { quotations: Quotation[] }) {
  return (
    <ul className="text-sm text-muted-foreground leading-6">
      {quotations.length === 0 ? (
        <li>No recent quotations.</li>
      ) : (
        quotations.map((q) => (
          <li key={q.id}>
            {q.number} — {q.to.name} — {formatCurrency(q.total, q.currency)}
          </li>
        ))
      )}
    </ul>
  )
}

function RecentInvoicesList({ invoices }: { invoices: Invoice[] }) {
  return (
    <ul className="text-sm text-muted-foreground leading-6">
      {invoices.length === 0 ? (
        <li>No recent invoices.</li>
      ) : (
        invoices.map((i) => (
          <li key={i.id}>
            {i.number} — {i.to.name} — {formatCurrency(i.total, i.currency)}
          </li>
        ))
      )}
    </ul>
  )
}
