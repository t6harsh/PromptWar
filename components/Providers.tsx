"use client";

import { ChronosProvider } from "../context/ChronosContext";
import { LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChronosProvider>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </ChronosProvider>
  );
}
