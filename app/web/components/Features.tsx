"use client";

const features = [
  {
    title: "Framework Support",
    description:
      "Seamless integration with Next.js and TanStack Start for modern full-stack development.",
  },
  {
    title: "First-Class ORMs",
    description:
      "Native support for Prisma and Drizzle, letting you choose your preferred type-safe database toolkit.",
  },
  {
    title: "Zero-Config Auth",
    description:
      "Instant, fully-configured authentication system powered by Better Auth out of the box.",
  },
  {
    title: "Pre-Built Components",
    description:
      "Beautifully designed Shadcn UI interfaces for sign-in, registration, and password recovery.",
  },
  {
    title: "Account Recovery",
    description:
      "Built-in password reset flows with secure tokens and transactional email support.",
  },
  {
    title: "Social Logins",
    description:
      "Enable GitHub, Google, and other OAuth providers with simple auto-generated configurations.",
  },
  {
    title: "Production Ready",
    description:
      "A meticulously organized, scalable project structure that adheres to modern clean-code best practices.",
  },
];

const Features = () => {
  return (
    <section className="bg-background dark:bg-[#000000] relative overflow-hidden transition-colors duration-300 pt-10 pb-24">
      {/* Subtle Background Glow */}

      <div className="px-6 lg:px-16 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground dark:text-white">
            Everything You Need for Auth
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400">
            Authverse handles the complexity of authentication so you can focus
            on your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-blue-500/30 overflow-hidden h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-neutral-400 text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
