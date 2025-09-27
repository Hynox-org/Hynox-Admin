"use client";
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
import { useRouter } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listQuotes } from "@/lib/storage";
import { useEffect, useState } from "react";
export default function QuotationsPage() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        const fetchQuotes = () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield listQuotes();
            setRows(quotes);
        });
        fetchQuotes();
    }, []);
    return (<main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Quotations</h1>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/quotations/new">Create Quotation</Link>
          </Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (<TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No quotations yet. Create your first one.
                  </TableCell>
                </TableRow>) : (rows.map((q) => {
            var _a;
            return (<TableRow key={q.id}>
                    <TableCell>{q.number}</TableCell>
                    <TableCell>{((_a = q.to) === null || _a === void 0 ? void 0 : _a.name) || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat(undefined, { style: "currency", currency: q.currency }).format(q.total)}
                    </TableCell>
                    <TableCell>{q.status}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => router.push(`/quotations/print/${q.id}`)}>
                        View / Print
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/quotations/print/${q.id}`)}>
                        Share
                      </Button>
                    </TableCell>
                  </TableRow>);
        }))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>);
}
