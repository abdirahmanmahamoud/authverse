"use client";

import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Search from "./Search";
import ModeToggle from "./ModeToggle";
import GithubRepo from "./GithubRepo";

const menuItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Docs",
    href: "/docs",
  },
];

const SiteHeader = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  return (
    <div className="fixed w-full h-12 z-50 px-6 lg:px-16 mx-auto top-0 left-0 right-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="w-full h-full flex items-center justify-between">
        <div className="w-full h-full flex items-center">
          <Logo className="w-36 lg:w-28" />
          <NavigationMenu viewport={!isMobile} className="hidden lg:block">
            <NavigationMenuList className="flex-wrap lg:ml-3">
              <NavigationMenuItem className="flex items-center">
                {menuItems.map((item, index) => (
                  <NavigationMenuLink
                    key={index}
                    href={item.href}
                    active={pathname === item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-1.5">
          <div className="hidden lg:block">
            <Search />
          </div>
          <ModeToggle />
          <GithubRepo />
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
