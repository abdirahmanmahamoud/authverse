import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { Icons } from "./icons";

const socialItems = [
  {
    icons: Icons.gitHub,
    href: "https://github.com/abdirahmanmahamoud/authverse",
    label: "GitHub",
    description: "Star our repository",
  },
  {
    icons: IconBrandX,
    href: "https://x.com/abdumahamoud",
    label: "X (Twitter)",
    description: "Follow for updates",
  },
  {
    icons: IconBrandLinkedin,
    href: "https://www.linkedin.com/in/abdirahmanmohamoud",
    label: "LinkedIn",
    description: "Connect professionally",
  },
  {
    icons: IconBrandInstagram,
    href: "https://www.instagram.com/abdirahman_mohamoud1",
    label: "Instagram",
    description: "Follow for updates",
  },
];

const FooterSite = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mt-6">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <Logo className="w-40 lg:w-48" />
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Authverse is a modern authentication solution that provides
              secure, scalable, and developer-friendly authentication services
              for your applications.
            </p>
          </div>

          {/* Connect with us - Updated UL Design */}
          <div className="flex flex-col items-center lg:items-end space-y-4">
            {/* Social Links List */}
            <ul className="grid grid-cols-2 gap-4 min-w-[280px]">
              {socialItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full h-auto p-3 justify-start gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                        <item.icons className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Authverse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSite;
