import React from "react";
import { Container } from "../ui/Container";

export function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Container>
      <div className="mb-6 md:mb-10">
        {kicker ? (
          <div className="text-emerald-300 text-sm tracking-wide">{kicker}</div>
        ) : null}
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p>
        ) : null}
      </div>
    </Container>
  );
}
