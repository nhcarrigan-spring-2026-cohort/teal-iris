import React from "react";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { features } from "../../utilis/landing";

export function FeatureGrid() {
  return (
    <section id="why" className="py-12 md:py-16">
      <Container>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title} className="flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/20" />
              <div>
                <div className="text-white font-semibold">{f.title}</div>
                <div className="text-sm text-white/70 leading-relaxed">{f.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
