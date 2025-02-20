"use client";
import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
} from "lucide-react";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import UserAvaibleCredits from "./UserAvaibleCredits";
const routes = [
  { label: "Home", href: "/", icon: HomeIcon },
  {
    label: "Workflows",
    href: "workflows",
    icon: Layers2Icon,
  },
  {
    label: "credentianls",
    href: "credentinals",
    icon: ShieldCheckIcon,
  },
  {
    label: "billing",
    href: "billing",
    icon: CoinsIcon,
  },
];
const DesktopSidebar = () => {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 1 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvaibleCredits />
      </div>
      <div className="flex flex-col p-2 gap-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={buttonVariants({
              variant:
                activeRoute?.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem",
            })}>
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
export const MobileSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const activeRoute =
    routes.find(
      (route) => route.href.length > 1 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="block border-separate bg-background md:hidden p-2">
      <nav className="container flex items-center justify-center px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side={"left"}>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <UserAvaibleCredits />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  href={route.href}
                  key={route.href}
                  onClick={() => setOpen((prev) => !prev)}
                  className={buttonVariants({
                    variant:
                      activeRoute?.href === route.href
                        ? "sidebarActiveItem"
                        : "sidebarItem",
                  })}>
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
export default DesktopSidebar;
