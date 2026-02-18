import React from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function Hero() {
  return (
  
    <section className="relative overflow-hidden" id="home">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-35 h-105 w-105 rounded-full bg-sky-500/15 blur-3xl" />

      <Container>
        <div className=" text-center py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-left text-4xl md:text-6xl font-semibold tracking-tight text-white">
              Practice Languages with{" "}
              <span className="italic text-emerald-300">Real People</span>
            </h1>

            <p className="mt-5 text-white/70 max-w-2xl leading-relaxed">
              Match with native speakers based on language goals, availability, and interests.
              Everyone teaches. Everyone learns.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="px-6">Get Started</Button>
              <Button variant="secondary" className="px-6">
                Browse Matches
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-white/70">
              <div className="flex -space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border border-white/10 bg-white/10"
                  />
                ))}
              </div>
              <div>
                <span className="text-white font-medium">20,000+</span> learners •{" "}
                <span className="text-emerald-300">4.7★</span> ratings
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

