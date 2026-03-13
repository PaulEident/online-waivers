import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use Volntir - Volntir",
  description: "A step-by-step guide to using Volntir for your events — from sharing waiver links to managing volunteer shifts and tracking hours.",
};

export default function HowToUseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
