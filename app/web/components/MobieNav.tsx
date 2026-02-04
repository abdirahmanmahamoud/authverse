"use client";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PAGES_NEW } from "@/lib/docs";
import { source } from "@/lib/source";
import Logo from "./Logo";

const MobieNav = () => {
  const tree = source.pageTree;
  const sessionOne = [
    {
      title: "Introduction",
      href: "/docs",
    },
    {
      title: "Changelog",
      href: "/docs/changelog",
    },
    {
      title: "Installation",
      href: "/docs/installation",
    },
  ];
  const pages = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ];
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 shadow-none">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SidebarProvider className="min-h-fit">
          <div className="flex h-full w-full flex-col px-1">
            <SidebarHeader className="mt-3 pl-2">
              <Logo className="w-40 p-0 m-0" />
            </SidebarHeader>
            <SidebarContent className="mt-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  {pages.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[1rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="text-muted-foreground font-medium">
                  Getting Started
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {sessionOne.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[1rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
              {tree.children.map((item) => (
                <SidebarGroup key={item.$id}>
                  <SidebarGroupLabel className="text-muted-foreground font-medium">
                    {item.name}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    {item.type === "folder" && (
                      <SidebarMenu className="gap-0.5">
                        {item.children.map((item) => {
                          if (
                            item.type === "page" &&
                            item.url?.includes("/mcp")
                          ) {
                            return null;
                          }

                          return (
                            item.type === "page" && (
                              <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === item.url}
                                  className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[1rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                                >
                                  <Link href={item.url}>
                                    {item.name}
                                    {PAGES_NEW.includes(item.url) && (
                                      <span
                                        className="flex size-2 rounded-full bg-blue-500"
                                        title="New"
                                      />
                                    )}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            )
                          );
                        })}
                      </SidebarMenu>
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </div>
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MobieNav;
