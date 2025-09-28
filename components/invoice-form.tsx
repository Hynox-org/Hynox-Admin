"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  saveInvoice,
  getCompany,
  getDefaultTax,
  getDefaultCurrency,
  saveDefaultCurrency,
  saveDefaultTax,
  listClients,
  listServices,
} from "@/lib/storage";
import type {
  LineItem,
  Invoice,
  CompanyInfo,
  Client,
  Service,
} from "@/lib/types";
import { toast } from "@/hooks/use-toast";

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export default function InvoiceForm() {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyInfo>({
    name: "Hynox",
    email: "",
    address: "",
    phone: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    upi: "",
  });
  const [currency, setCurrency] = useState("INR");
  const [taxRate, setTaxRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [
          companyData,
          defaultCurrency,
          defaultTax,
          fetchedClients,
          fetchedServices,
        ] = await Promise.all([
          getCompany(),
          getDefaultCurrency(),
          getDefaultTax(),
          listClients(),
          listServices(),
        ]);
        setCompany(companyData);
        setCurrency(defaultCurrency);
        setTaxRate(defaultTax);
        setClients(fetchedClients);
        setServices(fetchedServices);
        setFrom({
          name: companyData.name || "Hynox",
          email: companyData.email || "",
          address: companyData.address || "",
          phone: companyData.phone || "",
        });
      } catch (e: any) {
        toast({
          title: "Error loading initial data",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const [from, setFrom] = useState({
    name: company.name || "Hynox",
    email: company.email || "",
    address: company.address || "",
    phone: company.phone || "",
  });
  const [to, setTo] = useState({ name: "", email: "", address: "", phone: "" });
  const [issueDate, setIssueDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState("");
  const [number, setNumber] = useState(
    () =>
      `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`
  );
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: uuid(), description: "", quantity: 1, unitPrice: 0, selectedServiceId: undefined },
  ]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
        0
      ),
    [items]
  );
  const tax = useMemo(
    () => (subtotal * (Number(taxRate) || 0)) / 100,
    [subtotal, taxRate]
  );
  const total = useMemo(
    () => Math.max(0, subtotal + tax - (Number(discount) || 0)),
    [subtotal, tax, discount]
  );

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }
  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: uuid(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function onSave(printAfter = false) {
    const inv: Invoice = {
      id: uuid(),
      number,
      issueDate,
      dueDate,
      from,
      to,
      items,
      taxRate: Number(taxRate) || 0,
      discount: Number(discount) || 0,
      notes,
      currency,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: "Pending",
    };
    try {
      saveInvoice(inv);
      toast({
        title: "Invoice saved successfully!",
        description: `Invoice ${inv.number} has been saved.`,
      });
      if (printAfter) {
        router.push(`/invoices/print/${inv.id}`);
      } else {
        router.push("/invoices");
      }
    } catch (e: any) {
      toast({
        title: "Error saving invoice",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Loading Invoice Form...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while the form data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="number">Invoice Number</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="issue">Issue Date</Label>
            <Input
              id="issue"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="due">Due Date</Label>
            <Input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={async (e) => {
                const next = e.target.value.toUpperCase();
                setCurrency(next);
                await saveDefaultCurrency(next);
                toast({
                  title: "Default currency updated",
                  description: `Currency set to ${next}.`,
                });
              }}
            />
          </div>
          <div>
            <Label htmlFor="tax">Tax Rate (%)</Label>
            <Input
              id="tax"
              type="number"
              value={taxRate}
              onChange={async (e) => {
                const next = Number(e.target.value);
                setTaxRate(next);
                await saveDefaultTax(next);
                toast({
                  title: "Default tax rate updated",
                  description: `Tax rate set to ${next}%.`,
                });
              }}
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount ({currency})</Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">From</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={from.name} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={from.email} readOnly />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea value={from.address} readOnly />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={from.phone} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Bill To</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="client-select">Select Existing Client</Label>
            <Select
              onValueChange={(clientId) => {
                const selectedClient = clients.find((c) => c._id === clientId);
                if (selectedClient) {
                  setTo({
                    name: selectedClient.name,
                    email: selectedClient.email || "",
                    address: selectedClient.address || "",
                    phone: selectedClient.phone || "",
                  });
                }
              }}
            >
              <SelectTrigger id="client-select">
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client._id} value={client._id || ""}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={to.name}
              onChange={(e) => setTo({ ...to, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={to.email}
              onChange={(e) => setTo({ ...to, email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={to.address}
              onChange={(e) => setTo({ ...to, address: e.target.value })}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={to.phone}
              onChange={(e) => setTo({ ...to, phone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms or additional notes"
          />
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="grid gap-3 md:grid-cols-12 items-end">
              <div className="md:col-span-6">
                <Label>Description</Label>
                <Select onValueChange={(value) => {
                  if (value === "custom") {
                    updateItem(it.id, { selectedServiceId: undefined, description: "", unitPrice: 0 });
                  } else {
                    const selectedService = services.find(s => s._id === value);
                    if (selectedService) {
                      updateItem(it.id, {
                        selectedServiceId: selectedService._id,
                        description: selectedService.name,
                        unitPrice: selectedService.price,
                      });
                    }
                  }
                }} value={it.selectedServiceId || "custom"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service or type custom">
                      {it.selectedServiceId ? services.find(s => s._id === it.selectedServiceId)?.name : it.description || "Select a service or type custom"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id || ""}>
                        {service.name} ({money(service.price, currency)})
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Other / Custom</SelectItem>
                  </SelectContent>
                </Select>
                {/* {it.selectedServiceId === undefined && ( */}
                  <Input
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Service or item description"
                    className="mt-2"
                  />
                {/* )} */}
              </div>
              <div className="md:col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  value={it.quantity}
                  onChange={(e) =>
                    updateItem(it.id, { quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="md:col-span-3">
                <Label>Unit Price ({currency})</Label>
                <Input
                  type="number"
                  value={it.unitPrice}
                  onChange={(e) =>
                    updateItem(it.id, { unitPrice: Number(e.target.value) })
                  }
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => removeItem(it.id)}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addItem}>
            Add Item
          </Button>

          <div className="border-t pt-4 grid gap-2 md:grid-cols-3">
            <div className="md:col-span-2" />
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{money(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>{money(tax, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span>- {money(Number(discount) || 0, currency)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{money(total, currency)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => onSave(false)}
          className="bg-primary text-primary-foreground"
        >
          Save Invoice
        </Button>
        <Button onClick={() => onSave(true)} variant="secondary">
          Save & Print
        </Button>
      </div>
    </div>
  );
}
