import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { Hero } from "./Hero";
import { SectionTitle } from "./SectionTitle";
import { ResourceGrid } from "./ResourceGrid";
import { About } from "./About";
import { FeatureGrid } from "./FeatureGrid";
import { ContactSection } from "./ContactSection";
import { Footer } from "../Footer/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#071a2a] text-white">
      <Navbar />
      <Hero />

      <SectionTitle
        kicker="Explore"
        title={
          <>
            Explore Our <span className="italic text-emerald-300">Resources</span>
          </>
        }
        subtitle="Discover books, tutors, and media to help you learn and practice."
      />
      <ResourceGrid />

      <About />

      <SectionTitle
        kicker="Why LinguaLink"
        title={
          <>
            Learn with <span className="italic text-emerald-300">Confidence</span>
          </>
        }
        subtitle="A simple, structured approach so your language exchange actually works."
      />
      <FeatureGrid />

      <ContactSection />
      <Footer />
    </div>
  );
}
