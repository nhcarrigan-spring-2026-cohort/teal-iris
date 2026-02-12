import React from "react";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function ContactSection() {
  return (
    <section id="contact" className="py-12 md:py-16">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-0 overflow-hidden">
            <div className="min-h-[340px] bg-gradient-to-br from-white/10 to-white/0" />
          </Card>

          <Card>
            <div className="text-white font-semibold text-xl">Connect & Learn Together</div>
            <p className="mt-2 text-white/70 text-sm">
              Send us a message or request early access.
            </p>

            <form className="mt-6 space-y-3">
              <div>
                <div className="text-xs text-white/70 mb-1">Name</div>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-400/40"
                  placeholder="Your name"
                />
              </div>

              <div>
                <div className="text-xs text-white/70 mb-1">Email</div>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-400/40"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <div className="text-xs text-white/70 mb-1">Message</div>
                <textarea
                  className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-400/40"
                  placeholder="Tell us what you want to build…"
                />
              </div>

              <Button className="w-full">Send</Button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
}
