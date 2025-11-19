import FooterSite from "@/components/FooterSite";
import SiteHeader from "@/components/SiteHeader";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteHeader />
      <div className="mt-12">
        {children}
        <FooterSite />
      </div>
    </div>
  );
};

export default SiteLayout;
