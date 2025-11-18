import SiteHeader from "@/components/SiteHeader";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteHeader />
      <div className="mt-10">{children}</div>
    </div>
  );
};

export default SiteLayout;
