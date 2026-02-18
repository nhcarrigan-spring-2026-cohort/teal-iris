import React from "react";
import { Container } from "../ui/Container";
import { resources } from "../../utilis/landing";
import { ResourceCard } from "./ResourceCard";

export function ResourceGrid() {
  return (
    <section id="resources" className="py-10">
      <Container>
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard key={r.title} title={r.title} desc={r.desc} />
          ))}
        </div>
      </Container>
    </section>
  );
}
