import { Film, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sensoteq DVD Rental System</h1>
              <p className="text-sm text-muted-foreground">Tech Test Interface</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;