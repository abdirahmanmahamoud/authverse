import Link from "next/link";
import logoMain from "@/public/main.svg";
import logoDark from "@/public/dark.svg";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/">
      <div className="dark:hidden">
        <Image src={logoMain} alt="Logo" className={className} />
      </div>
      <div className="hidden dark:block">
        <Image src={logoDark} alt="Logo" className={className} />
      </div>
    </Link>
  );
};

export default Logo;
