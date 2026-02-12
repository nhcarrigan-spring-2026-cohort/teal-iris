import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function ResourceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="flex flex-col gap-3 hover:border-white/20 transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/20" />
        <div className="text-white font-semibold">{title}</div>
      </div>
      <div className="text-sm text-white/70 leading-relaxed">{desc}</div>
      <div className="pt-2">
        <Button variant="secondary" className="px-4 py-2">
          Explore →
        </Button>
      </div>
    </Card>
  );
}
