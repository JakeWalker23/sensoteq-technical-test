import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Users, Search, Database } from "lucide-react";
import logo from "@/assets/sensoteq-logo.png"
import Header from "@/components/layout/Header";
import FilmsSection from "@/components/sections/FilmsSection";
import CustomersSection from "@/components/sections/CustomersSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("films");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
        <img src={logo} alt="Sensoteq" className="mx-auto mb-4 h-14 w-auto md:h-16" />

          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-8 h-8 text-primary glow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              DVD Rental Management
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern interface for managing your DVD rental database with advanced CRUD operations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto glass">
            <TabsTrigger 
              value="films" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Film className="w-4 h-4" />
              Films
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="films" className="animate-fade-in">
              <FilmsSection />
            </TabsContent>
            
            <TabsContent value="customers" className="animate-fade-in">
              <CustomersSection />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;