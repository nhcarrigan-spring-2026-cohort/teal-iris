import React from "react";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { stats } from "../../utilis/landing";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-emerald-300 text-2xl font-semibold">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="py-12 md:py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-emerald-300 text-sm">About</div>
            <h3 className="mt-2 text-3xl font-semibold text-white">
              Learn together — with confidence.
            </h3>
            <p className="mt-4 text-white/70 leading-relaxed">
              LinguaLink connects learners with native speakers for language exchange.
              We make it easy to find the right partner and actually start conversations.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            {/* Replace this with an actual image later */}
            <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/0" />
          </Card>
        </div>
      </Container>
    </section>
  );
}
