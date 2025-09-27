import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsCards } from "@/components/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Invoice, Quotation, Client } from "@/lib/types"
import { listClients, listInvoices, listQuotes } from "@/lib/storage"
import { Stat } from "@/components/stats-cards" // Assuming Stat type is exported
import { toast } from "@/hooks/use-toast"

async function getDashboardData() {
  try {
    const [invoices, quotations, clients] = await Promise.all([
      listInvoices(),
      listQuotes(),
      listClients(),
    ])
    toast({
      title: "Dashboard data loaded",
      description: "Latest invoices, quotations, and client data are displayed.",
    })
    return { invoices, quotations, clients }
  } catch (e: any) {
    toast({
      title: "Error loading dashboard data",
      description: e.message,
      variant: "destructive",
    })
    return { invoices: [], quotations: [], clients: [] } // Return empty arrays on error
  }
}

function formatCurrency(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export default async function DashboardPage() {
  const { invoices, quotations, clients } = await getDashboardData()

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
      </section>
    </main>
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
