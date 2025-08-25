import { Mail, Phone, MapPin, Trash2, Calendar, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city_id: number;
  store_id: number;
  created_date: string;
}

interface CustomerCardProps {
  customer: Customer;
  onDelete: (customerId: number) => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CustomerCard = ({ customer, onDelete, loading = false, className, style }: CustomerCardProps) => {
  const getCityName = (cityId: number): string => {
    const cities: { [key: number]: string } = {
      1: "London",
      2: "Manchester", 
      3: "Birmingham",
      4: "Liverpool",
      5: "Glasgow"
    };
    return cities[cityId] || "Unknown";
  };

  const getStoreName = (storeId: number): string => {
    const stores: { [key: number]: string } = {
      1: "Main Branch",
      2: "North Branch"
    };
    return stores[storeId] || "Unknown";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={cn("glass hover-scale group", className)}
      style={style}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {customer.first_name} {customer.last_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                ID: {customer.id}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Store className="w-3 h-3 mr-1" />
                {getStoreName(customer.store_id)}
              </Badge>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {customer.first_name} {customer.last_name}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(customer.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Customer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{customer.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{customer.phone}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-muted-foreground">Address:</span>
              <div className="font-medium">
                {customer.address}, {customer.district}
                <br />
                {getCityName(customer.city_id)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-border/50">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-medium">{formatDate(customer.created_date)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;