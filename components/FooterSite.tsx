import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";

const socialItems = [
  {
    icons: IconBrandGithub,
    href: "https://github.com/abdirahmanmahamoud/authverse",
  },
  {
    icons: IconBrandX,
    href: "https://x.com/abdumahamoud",
  },
  {
    icons: IconBrandLinkedin,
    href: "https://www.linkedin.com/in/abdirahmanmohamoud",
  },
];
const FooterSite = () => {
  return (
    <>
      <div className="mt-12 py-10 bg-primary/5 w-full flex flex-col items-center justify-center">
        <Logo className="w-40 lg:w-64" />
        <div className="mt-3 flex gap-2 justify-center">
          {socialItems.map((item, index) => (
            <Button key={index} variant="outline" asChild>
              <Link href={item.href}>
                <item.icons className="size-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="py-5 w-full flex flex-col items-center justify-center">
        <p className="text-center text-sm font-medium text-fd-muted-foreground">
          &copy; {new Date().getFullYear()} Authverse. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default FooterSite;
