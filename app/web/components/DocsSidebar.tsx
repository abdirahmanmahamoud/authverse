"use client";
import { PAGES_NEW } from "@/lib/docs";
import { source } from "@/lib/source";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

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

const DocsSidebar = ({ tree }: { tree: typeof source.pageTree }) => {
  const pathname = usePathname();

  return (
    <Sidebar className="fixed top-[calc(var(--header-height)+1px)] z-30 hidden h-screen overscroll-none bg-transparent lg:flex lg:border-r px-1">
      <div className="pt-10" />
      <SidebarContent className="mt-9">
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
                    if (item.type === "page" && item.url?.includes("/mcp")) {
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
    </Sidebar>
  );
};

export default DocsSidebar;
