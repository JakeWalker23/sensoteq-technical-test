import { useState } from "react";
import { Plus, Users, Trash2, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CustomerForm from "@/components/customer/CustomerForm";
import CustomerCard from "@/components/customer/CustomerCard";

const API_BASE = (import.meta.env.VITE_API_BASE)

const CustomersSection = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateCustomer = async (form: any) => {
    setLoading(true)
    try {
      const payload = {
        store_id: Number(form.store_id),
        first_name: String(form.first_name ?? "").trim(),
        last_name: String(form.last_name ?? "").trim(),
        email: String(form.email ?? "").trim(),
        phone: String(form.phone ?? "").trim(),
        address: String(form.address ?? "").trim(),
        address2: form.address2 ? String(form.address2).trim() : undefined,
        district: String(form.district ?? "").trim(),
        city_id: Number(form.city_id),
        postal_code: form.postal_code ? String(form.postal_code).trim() : undefined,
      }

      const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : null
      if (!res.ok) throw new Error(data?.error || res.statusText)

      const created = {
        id: data.customer.customer_id,
        first_name: data.customer.first_name,
        last_name: data.customer.last_name,
        email: data.customer.email,
        phone: payload.phone,
        address: payload.address,
        district: payload.district,
        city_id: payload.city_id,
        store_id: payload.store_id,
        created_date: (data.customer.create_date || "").slice(0, 10),
      }

      setCustomers(prev => [created, ...prev])
      setIsCreateDialogOpen(false)
      toast({ title: "Success!", description: `Customer #${created.id} created.` })
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to create customer", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }  
  
  const handleDeleteCustomer = async (customerId: number) => {
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/customers/${customerId}`, { method: "DELETE" })
      const text = await res.text()
      const data = text ? JSON.parse(text) : null
      if (!res.ok) throw new Error(data?.error || res.statusText)

      setCustomers(prev => prev.filter(c => c.id !== customerId))
      toast({ title: "Deleted", description: `Customer #${customerId} removed.` })
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete customer", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Customer Management
              </CardTitle>
              <CardDescription>
                Manage your customer database with CRUD operations
              </CardDescription>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="glass max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Customer</DialogTitle>
                  <DialogDescription>
                    Fill in the customer details below
                  </DialogDescription>
                </DialogHeader>
                <CustomerForm 
                  onSubmit={handleCreateCustomer}
                  loading={loading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Customer List */}
      {loading && customers.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-6">
                <div className="loading-pulse h-6 mb-3" />
                <div className="loading-pulse h-4 mb-2" />
                <div className="loading-pulse h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customers.map((customer, index) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDeleteCustomer}
              loading={loading}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {customers.length === 0 && !loading && (
        <Card className="glass text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first customer
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="glass max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Customer</DialogTitle>
                  <DialogDescription>
                    Fill in the customer details below
                  </DialogDescription>
                </DialogHeader>
                <CustomerForm 
                  onSubmit={handleCreateCustomer}
                  loading={loading}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomersSection;