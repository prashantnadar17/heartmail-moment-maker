import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatPaise } from "@/lib/format";
import { getExperience } from "@/components/experiences/registry";
import type { TemplateDto } from "@/lib/catalog.functions";

export function TemplateCard({ template }: { template: TemplateDto }) {
  const meta = getExperience(template.experienceType);
  return (
    <Link
      to="/cards/$slug"
      params={{ slug: template.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="dark relative flex h-44 items-center justify-center overflow-hidden border-b border-border bg-night-wash">
        <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
          {meta?.emoji ?? "💌"}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-card/70 px-2.5 py-1 text-[11px] font-medium text-foreground">
          Interactive experience
        </span>
        {template.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-xs font-semibold text-coral-foreground">
            New
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{template.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{template.tagline}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {formatPaise(template.pricePaise)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            Personalise
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
