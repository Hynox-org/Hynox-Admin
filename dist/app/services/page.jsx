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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
    const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [newService, setNewService] = useState({ name: "", description: "", price: 0 });
    const fetchServices = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/services");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            setServices(data);
            toast({
                title: "Services loaded successfully!",
                description: `Found ${data.length} services.`,
            });
        }
        catch (e) {
            setError(e.message);
            toast({
                title: "Error fetching services",
                description: e.message,
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        fetchServices();
    }, []);
    if (loading) {
        return (<main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Services</h1>
          <p>Loading services...</p>
        </section>
      </main>);
    }
    if (error) {
        return (<main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>);
    }
    return (<main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Services</h1>
          <Button variant="secondary" onClick={() => {
            setNewService({ name: "", description: "", price: 0 });
            setIsAddServiceDialogOpen(true);
        }}>Add Service</Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (<TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No Clients yet. Create your first one.
                  </TableCell>
                </TableRow>) : (services.map((service) => (<TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>₹{service.price.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => {
                setCurrentService(service);
                setNewService({ name: service.name, description: service.description, price: service.price });
                setIsEditServiceDialogOpen(true);
            }}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                setCurrentService(service);
                setIsDeleteDialogOpen(true);
            }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>)))}
            </TableBody>
          </Table>
        </div>

        {/* Add Service Dialog */}
        <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={newService.name} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { name: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" value={newService.description} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { description: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" type="number" value={newService.price} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { price: parseFloat(e.target.value) || 0 }))} className="col-span-3"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddServiceDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/api/services", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newService),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Service added successfully!",
                    description: `${newService.name} has been added.`,
                });
                setIsAddServiceDialogOpen(false);
                fetchServices(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error adding service",
                    description: e.message,
                    variant: "destructive",
                });
            }
        })}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" value={newService.name} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { name: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea id="edit-description" value={newService.description} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { description: e.target.value }))} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input id="edit-price" type="number" value={newService.price} onChange={(e) => setNewService(Object.assign(Object.assign({}, newService), { price: parseFloat(e.target.value) || 0 }))} className="col-span-3"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditServiceDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => __awaiter(this, void 0, void 0, function* () {
            if (!(currentService === null || currentService === void 0 ? void 0 : currentService._id)) {
                toast({
                    title: "Error updating service",
                    description: "Service ID is missing.",
                    variant: "destructive",
                });
                return;
            }
            try {
                const response = yield fetch(`/api/services/${currentService._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newService),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Service updated successfully!",
                    description: `${newService.name} has been updated.`,
                });
                setIsEditServiceDialogOpen(false);
                fetchServices(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error updating service",
                    description: e.message,
                    variant: "destructive",
                });
            }
        })}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Service Alert Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the service "{currentService === null || currentService === void 0 ? void 0 : currentService.name}" from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => __awaiter(this, void 0, void 0, function* () {
            if (!(currentService === null || currentService === void 0 ? void 0 : currentService._id)) {
                toast({
                    title: "Error deleting service",
                    description: "Service ID is missing.",
                    variant: "destructive",
                });
                return;
            }
            try {
                const response = yield fetch(`/api/services/${currentService._id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                toast({
                    title: "Service deleted successfully!",
                    description: `${currentService.name} has been deleted.`,
                });
                setIsDeleteDialogOpen(false);
                fetchServices(); // Refresh the list
            }
            catch (e) {
                toast({
                    title: "Error deleting service",
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
