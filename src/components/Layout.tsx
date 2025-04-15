
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, CreditCard, History, Package2, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Ana Sayfa",
      icon: Home,
      url: "/"
    },
    {
      title: "Kasa Sayım",
      icon: CreditCard,
      url: "/kasa-sayim"
    },
    {
      title: "Geçmiş Sayımlar",
      icon: History,
      url: "/kasa-gecmis"
    },
    {
      title: "Stok Raporları",
      icon: Package2,
      url: "/stok-raporlari"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar menuItems={menuItems} currentPath={location.pathname} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-6">
            <SidebarTrigger className="mb-4 lg:hidden" />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  menuItems: {
    title: string;
    icon: React.ElementType;
    url: string;
  }[];
  currentPath: string;
}

function AppSidebar({ menuItems, currentPath }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-store-700">Kasa Takip</h1>
          <p className="text-sm text-muted-foreground">Mağaza Yönetim Portalı</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={currentPath === item.url ? "bg-store-50 text-store-700" : ""}>
                    <a href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default Layout;
