import { useState } from "react";
import { Plus, Users, Trash2, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CustomerForm from "@/components/customer/CustomerForm";
import CustomerCard from "@/components/customer/CustomerCard";

// Mock data for demonstration - replace with actual API calls
const mockCustomers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe", 
    email: "john.doe@example.com",
    phone: "0123456789",
    address: "123 Main St",
    district: "Downtown",
    city_id: 1,
    store_id: 1,
    created_date: "2024-01-15"
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com", 
    phone: "0987654321",
    address: "456 Oak Ave",
    district: "Uptown",
    city_id: 2,
    store_id: 1,
    created_date: "2024-02-10"
  }
];

const CustomersSection = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateCustomer = async (customerData: any) => {
    setLoading(true);
    try {
      // Replace with actual API call: POST /customer
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      console.log("Creating customer:", customerData);
      
      const newCustomer = {
        ...customerData,
        id: customers.length + 1,
        created_date: new Date().toISOString().split('T')[0]
      };
      
      setCustomers(prev => [newCustomer, ...prev]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success!",
        description: "Customer created successfully",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    setLoading(true);
    try {
      // Replace with actual API call: DELETE /customer/${customerId}
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      console.log(`Deleting customer: ${customerId}`);
      
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      
      toast({
        title: "Success!",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error", 
        description: "Failed to delete customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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