var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Link from "next/link";
import { SidebarNav } from "@/components/sidebar-nav";
import { StatsCards } from "@/components/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listClients, listInvoices, listQuotes } from "@/lib/storage";
function getDashboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [invoices, quotations, clients] = yield Promise.all([
                listInvoices(),
                listQuotes(),
                listClients(),
            ]);
            return { invoices, quotations, clients, status: "success", message: "Dashboard data loaded" };
        }
        catch (e) {
            return { invoices: [], quotations: [], clients: [], status: "error", message: e.message };
        }
    });
}
function formatCurrency(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
    }).format(amount);
}
import { Toaster } from "@/components/ui/toaster";
import DashboardClientWrapper from "@/app/dashboard/dashboard-client-wrapper";
export default function DashboardPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const { invoices, quotations, clients, status, message } = yield getDashboardData();
        const totalInvoices = invoices.length;
        const totalQuotations = quotations.length;
        const totalClients = clients.length;
        const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
        const totalQuotationAmount = quotations.reduce((sum, quotation) => sum + quotation.total, 0);
        const pendingPayments = invoices
            .filter((invoice) => invoice.status === "Pending")
            .reduce((sum, invoice) => sum + invoice.total, 0);
        const stats = [
            { title: "Total Invoices", value: totalInvoices.toString() },
            { title: "Total Quotations", value: totalQuotations.toString() },
            { title: "Total Clients", value: totalClients.toString() },
            { title: "Pending Payments", value: formatCurrency(pendingPayments) },
            { title: "Total Invoice Amount", value: formatCurrency(totalInvoiceAmount) },
            { title: "Total Quotation Amount", value: formatCurrency(totalQuotationAmount) },
        ];
        const recentQuotations = quotations.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5);
        const recentInvoices = invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5);
        return (<main className="flex h-screen">
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
          <StatsCards stats={stats}/>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Recent Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentQuotationsList quotations={recentQuotations}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoicesList invoices={recentInvoices}/>
            </CardContent>
          </Card>
        </div>
        <DashboardClientWrapper status={status} message={message}/>
      </section>
      <Toaster />
    </main>);
    });
}
function RecentQuotationsList({ quotations }) {
    return (<ul className="text-sm text-muted-foreground leading-6">
      {quotations.length === 0 ? (<li>No recent quotations.</li>) : (quotations.map((q) => (<li key={q.id}>
            {q.number} — {q.to.name} — {formatCurrency(q.total, q.currency)}
          </li>)))}
    </ul>);
}
function RecentInvoicesList({ invoices }) {
    return (<ul className="text-sm text-muted-foreground leading-6">
      {invoices.length === 0 ? (<li>No recent invoices.</li>) : (invoices.map((i) => (<li key={i.id}>
            {i.number} — {i.to.name} — {formatCurrency(i.total, i.currency)}
          </li>)))}
    </ul>);
}
