
import { auth } from "@/lib/auth";
import { Bars, Gear } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { 
  ChartArea, 
  History, 
  Image as ImageIcon, 
  PlusCircle, 
  DollarSign, 
  Users, 
  Paintbrush 
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  
  const role = user?.role || "buyer"; 

  const dashboardItems = {
    
    buyer: [
      { icon: History, label: "Purchase History", link: "/dashboard/buyer" },
      { icon: ImageIcon, label: "Bought Artworks", link: "/dashboard/buyer/bought-artworks" },
      { icon: Gear, label: "Profile Management", link: "/dashboard/buyer/profile" },
    ],

   
    artist: [
      { icon: Paintbrush, label: "Manage Artworks", link: "/dashboard/artist" },
      { icon: PlusCircle, label: "Add Artwork", link: "/dashboard/artist/add" },
      { icon: DollarSign, label: "Sales History", link: "/dashboard/artist/sales" },
      { icon: Gear, label: "Profile Management", link: "/dashboard/artist/profile" },
    ],

    
    admin: [
      { icon: Users, label: "Manage Users", link: "/dashboard/admin" },
      { icon: ImageIcon, label: "Manage All Artworks", link: "/dashboard/admin/artworks" },
      { icon: DollarSign, label: "View All Transactions", link: "/dashboard/admin/transactions" },
      { icon: ChartArea, label: "Analytics & Charts", link: "/dashboard/admin/analytics" },
    ],
  };

  const navItems = dashboardItems[role] || dashboardItems["buyer"];

  return (
    <Drawer>
      <Button className={"hidden "} variant="secondary">
        <Bars />
        Menu
      </Button>

     
      <nav className="flex flex-col gap-1 w-[240px] border-r h-screen p-4 bg-background">
        
        
        <div className="border-b pb-4 mb-4 flex flex-col items-center gap-2 text-center">
          {user?.image ? (
            <img
              src={user.image} 
              alt={user.name || "Profile"}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-500/20"
            />
          ) : (
           
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          
          <div>
            <h3 className="font-bold text-sm text-foreground tracking-tight line-clamp-1">
              {user?.name || "Guest User"}
            </h3>
            <p className="text-xs text-muted-foreground capitalize font-medium mt-0.5">
              {role}
            </p>
          </div>
        </div>

       
        {navItems.map((item) => (
          <Link key={item.label} href={item.link} passHref legacyBehavior>
            <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default-100 active:bg-default-200">
              <item.icon className="size-5 text-muted-foreground" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>

     
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.link} passHref legacyBehavior>
                    <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default-100">
                      <item.icon className="size-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}