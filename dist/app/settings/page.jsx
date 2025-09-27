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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompany, getDefaultTax, saveCompany, saveDefaultTax, } from "@/lib/storage";
import { SidebarNav } from "@/components/sidebar-nav";
import { toast } from "@/hooks/use-toast";
export default function SettingsPage() {
    const [company, setCompany] = useState();
    const [tax, setTax] = useState(18);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const companyInfo = yield getCompany();
                    setCompany(companyInfo);
                    const defaultTax = yield getDefaultTax();
                    setTax(defaultTax);
                    toast({
                        title: "Settings loaded successfully!",
                        description: "Company and tax settings have been loaded.",
                    });
                }
                catch (e) {
                    toast({
                        title: "Error loading settings",
                        description: e.message,
                        variant: "destructive",
                    });
                }
                finally {
                    setLoading(false);
                }
            });
        }
        fetchData();
    }, []);
    function onSave() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company)
                return;
            try {
                yield saveCompany(company);
                yield saveDefaultTax(Number(tax) || 0);
                toast({
                    title: "Settings saved successfully!",
                    description: "Your company and tax settings have been updated.",
                });
            }
            catch (e) {
                toast({
                    title: "Error saving settings",
                    description: e.message,
                    variant: "destructive",
                });
            }
        });
    }
    if (loading) {
        return (<main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p>Loading settings...</p>
        </section>
      </main>);
    }
    if (!company)
        return null;
    return (<main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <div className="mx-auto max-w-3xl p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Company & Tax Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Company Name</Label>
              <Input value={company.name} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { name: e.target.value }))}/>
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input value={company.address || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { address: e.target.value }))}/>
            </div>

            <div>
              <Label>GST Number</Label>
              <Input value={company.gstNumber || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { gstNumber: e.target.value }))}/>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={company.email || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { email: e.target.value }))}/>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={company.phone || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { phone: e.target.value }))}/>
            </div>

            <div className="md:col-span-2 pt-2">
              <h3 className="font-medium">Bank Details</h3>
            </div>

            <div>
              <Label>Bank Name</Label>
              <Input value={company.bankName || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { bankName: e.target.value }))}/>
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value={company.accountNumber || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { accountNumber: e.target.value }))}/>
            </div>
            <div>
              <Label>IFSC</Label>
              <Input value={company.ifsc || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { ifsc: e.target.value }))}/>
            </div>
            <div>
              <Label>UPI</Label>
              <Input value={company.upi || ""} onChange={(e) => setCompany(Object.assign(Object.assign({}, company), { upi: e.target.value }))}/>
            </div>

            <div className="md:col-span-2">
              <Label>Default Tax % (Invoices)</Label>
              <Input type="number" min={0} step="0.01" value={tax} onChange={(e) => setTax(Number(e.target.value))}/>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={onSave}>Save Settings</Button>
          </div>
        </div>
      </section>
    </main>);
}
