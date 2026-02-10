import React from "react";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-white/70 text-sm">© {new Date().getFullYear()} LinguaLink</div>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#resources" className="hover:text-white">Resources</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
