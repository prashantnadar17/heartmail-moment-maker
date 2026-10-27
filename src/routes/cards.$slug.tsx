import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { getTemplate, type TemplateDto } from "@/lib/catalog.functions";
import { getExperience } from "@/components/experiences/registry";
import { formatPaise } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/cards/$slug")({
  loader: async ({ params }) => {
    const template = await getTemplate(params.slug);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => {
    const template: TemplateDto | undefined = loaderData?.template;
    if (!template) {
      return { meta: [{ title: "Card unavailable — HeartMuse" }] };
    }
    const description =
      template.tagline ??
      "A personalised, interactive digital card from HeartMuse — one link, one special moment.";
    return {
      meta: [
        { title: `${template.name} — HeartMuse` },
        { name: "description", content: description },
        { property: "og:title", content: `${template.name} — HeartMuse` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CardDetail,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">The page didn't load. Please refresh.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-display text-2xl font-semibold text-foreground">Card not found</p>
      <p className="text-sm text-muted-foreground">It may have been retired.</p>
      <Button asChild className="mt-2 rounded-xl">
        <Link to="/cards">Browse cards</Link>
      </Button>
    </div>
  ),
});

function CardDetail() {
  const { template } = Route.useLoaderData();
  const meta = getExperience(template.experienceType);
  const Experience = meta?.component;
  const Demo = Experience ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link
            to="/cards"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All cards
          </Link>

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Info */}
            <div>
              <div className="flex items-center gap-2">
                {template.isNew && (
                  <Badge className="rounded-full bg-coral text-coral-foreground">New</Badge>
                )}
                <Badge variant="secondary" className="rounded-full">
                  <Sparkles className="mr-1 size-3.5" />
                  Interactive experience
                </Badge>
              </div>
              <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
                {template.name}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{template.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {template.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-foreground">
                  {formatPaise(template.pricePaise)}
                </span>
                <span className="text-xs text-muted-foreground">per card · illustrative launch price</span>
              </div>

              {meta && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    How it plays
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {meta.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/create/$slug" params={{ slug: template.slug }}>
                    Personalise this card
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Live preview while you personalise. Payments open soon — share the preview link
                free for now.
              </p>
            </div>

            {/* Live demo */}
            <div className="relative mx-auto w-full max-w-md lg:sticky lg:top-24">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-lavender via-background to-coral/20 blur-2xl" />
              {Demo ? (
                <Demo mode="demo" personalization={meta.demo} />
              ) : (
                <p className="text-sm text-muted-foreground">Preview coming soon.</p>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Try it — this is a demo. Your words and photos replace everything here.
              </p>
            </div>
          </div>

          {/* Personalisation checklist */}
          <div className="mt-16 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              What you'll add
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: `Their name — shown inside the ${template.name.toLowerCase()}` },
                { label: "Your name — signed at the end" },
                { label: "Your message — up to 2,000 characters" },
                ...(meta?.needsPhotos
                  ? [{ label: "1–6 photos — the puzzle hides your favourite" }]
                  : []),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-background p-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3.5" />
                  </span>
                  <p className="text-sm text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
