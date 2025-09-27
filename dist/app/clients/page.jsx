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
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
    const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [newClient, setNewClient] = useState({ name: "", email: "", address: "", phone: "" });
    const fetchClients = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/clients");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            setClients(data);
            toast({
                title: "Clients loaded successfully!",
                description: `Found ${data.length} clients.`,
            });
        }
        catch (e) {
            setError(e.message);
            toast({
                title: "Error fetching clients",
                description: e.message,
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        fetchClients();
    }, []);
    if (loading) {
        return (<main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p>Loading clients...</p>
        </section>
      </main>);
    }
    if (error) {
        return (<main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>);
    }
    return (<main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <Button variant="secondary" onClick={() => {
            setNewClient({ name: "", email: "", address: "", phone: "" });
            setIsAddClientDialogOpen(true);
        }}>Add Client</Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (<TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No Clients yet. Create your first one.
                  </TableCell>
                </TableRow>) : (clients.map((client) => (<TableRow key={client._id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                setCurrentClient(client);
                setNewClient({ name: client.name, email: client.email, address: client.address, phone: client.phone });
                setIsEditClientDialogOpen(true);
            }}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => {
                setCurrentClient(client);
                setIsDeleteDialogOpen(true);
            }}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>)))}
            </TableBody>
          </Table>
        </div>

        {/* Add Client Dialog */}
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={newClient.name} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { name: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" value={newClient.email} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { email: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input id="phone" value={newClient.phone} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { phone: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea id="address" value={newClient.address} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { address: e.target.value }))} className="col-span-3"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/api/clients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newClient),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Client added successfully!",
                    description: `${newClient.name} has been added.`,
                });
                setIsAddClientDialogOpen(false);
                fetchClients(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error adding client",
                    description: e.message,
                    variant: "destructive",
                });
            }
        })}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" value={newClient.name} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { name: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input id="edit-email" type="email" value={newClient.email} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { email: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input id="edit-phone" value={newClient.phone} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { phone: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <Textarea id="edit-address" value={newClient.address} onChange={(e) => setNewClient(Object.assign(Object.assign({}, newClient), { address: e.target.value }))} className="col-span-3"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditClientDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => __awaiter(this, void 0, void 0, function* () {
            if (!(currentClient === null || currentClient === void 0 ? void 0 : currentClient._id)) {
                toast({
                    title: "Error updating client",
                    description: "Client ID is missing.",
                    variant: "destructive",
                });
                return;
            }
            try {
                const response = yield fetch(`/api/clients/${currentClient._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newClient),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Client updated successfully!",
                    description: `${newClient.name} has been updated.`,
                });
                setIsEditClientDialogOpen(false);
                fetchClients(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error updating client",
                    description: e.message,
                    variant: "destructive",
                });
            }
        })}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Client Alert Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the client "{currentClient === null || currentClient === void 0 ? void 0 : currentClient.name}" from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => __awaiter(this, void 0, void 0, function* () {
            if (!(currentClient === null || currentClient === void 0 ? void 0 : currentClient._id)) {
                toast({
                    title: "Error deleting client",
                    description: "Client ID is missing.",
                    variant: "destructive",
                });
                return;
            }
            try {
                const response = yield fetch(`/api/clients/${currentClient._id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Client deleted successfully!",
                    description: `${currentClient.name} has been deleted.`,
                });
                setIsDeleteDialogOpen(false);
                fetchClients(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error deleting client",
                    description: e.message,
                    variant: "destructive",
                });
            }
        })}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </main>);
}
