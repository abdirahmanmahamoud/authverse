"use client";

import {
  ShieldCheck,
  Layout,
  KeyRound,
  Globe,
  Github,
  FileCode,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Full Auth Setup",
    description:
      "Generate a complete authentication system instantly with Better Auth configuration.",
    icon: ShieldCheck,
    iconColor: "text-blue-400",
  },
  {
    title: "Login & Signup Screens",
    description:
      "Ready-made, beautiful ShadCN UI screens for login, signup, and forgot password.",
    icon: Layout,
    iconColor: "text-purple-400",
  },
  {
    title: "Forgot Password Flow",
    description:
      "Automated password reset system with secure token handling and email support.",
    icon: KeyRound,
    iconColor: "text-amber-400",
  },
  {
    title: "Google OAuth",
    description:
      "Enable Google login instantly with auto-generated OAuth configuration.",
    icon: Globe,
    iconColor: "text-red-400",
  },
  {
    title: "GitHub OAuth",
    description:
      "Built-in GitHub OAuth integration ready to use out of the box.",
    icon: Github,
    iconColor: "text-gray-400",
  },
  {
    title: "TypeScript + Modern Setup",
    description:
      "Clean, scalable, and production-ready folder structure generated automatically.",
    icon: FileCode,
    iconColor: "text-emerald-400",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background dark:bg-[#000000] relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-card dark:bg-gray-900/40 border border-border dark:border-gray-800 transition-all duration-300 overflow-hidden h-full"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`w-12 h-12 rounded-lg bg-secondary dark:bg-gray-800 flex items-center justify-center mb-6 shadow-sm`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-white transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
