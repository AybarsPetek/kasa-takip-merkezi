
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Ara..."
            className="w-[200px] md:w-[300px] border-none focus-visible:ring-0"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-store-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <div className="ml-2">
            <p className="text-sm font-medium">Mağaza Yöneticisi</p>
            <p className="text-xs text-muted-foreground">admin@kasatakip.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
