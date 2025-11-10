const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-800">
      {children}
    </div>
  );
};

export default AuthLayout;
