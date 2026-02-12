import React from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071a2a]/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30" />
            <div className="leading-tight">
              <div className="text-white font-semibold">LinguaLink</div>
              <div className="text-xs text-white/60">Language Exchange</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-white transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Button>Sign In</Button>
        </div>
      </Container>
    </header>
  );
}

