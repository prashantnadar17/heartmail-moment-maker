import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Gift, Images, Star, Wand2 } from "lucide-react";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TemplateCard } from "@/components/template-card";
import { BirthdayExperience } from "@/components/experiences/birthday-experience";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({
    meta: [
      { title: "HeartMuse — Interactive Digital Greeting Cards" },
      {
        name: "description",
        content:
          "Create personalised, interactive digital cards — blow out birthday candles, open apology letters, reveal photo puzzles. One link, one special moment.",
      },
      { property: "og:title", content: "HeartMuse — Cards they'll play, not just read" },
      {
        property: "og:description",
        content:
          "Interactive digital greeting cards made for India. Personalise with words and photos, share one magical link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">The page didn't load. Please refresh.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">Page not found.</p>
    </div>
  ),
});

function Index() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const featured = data.templates.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero-wash">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div>
              <Badge variant="secondary" className="rounded-full">
                <Gift className="mr-1 size-3.5" />
                Made in India, made with love
              </Badge>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cards they'll <span className="text-gradient-violet">play</span>, not just read.
              </h1>
              <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
                Turn your words, photos and a little magic into an interactive card. They tap,
                reveal and relive it — all from one link you share on WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/cards" search={{ category: undefined }}>
                    Create a card
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl">
                  <Link to="/cards" search={{ category: undefined }}>Browse experiences</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No app to install. Opens right in their browser.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-lavender via-background to-coral/20 blur-2xl" />
              <BirthdayExperience
                mode="demo"
                personalization={{
                  recipientName: "Aarav",
                  senderName: "Diya",
                  message:
                    "Another year of you being absolutely wonderful. May every candle you blow out come back as a wish come true.",
                  photos: [],
                }}
              />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Try it — tap the candles to see the reveal
              </p>
            </div>
          </div>
        </section>

        {/* Featured cards */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Experiences, ready to personalise
              </h2>
              <p className="mt-2 text-muted-foreground">
                Each card is a little interactive story. Pick one, add your words.
              </p>
            </div>
            <Link
              to="/cards" search={{ category: undefined }}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </section>

        {/* Occasions */}
        <section className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Every occasion, one link
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {data.categories.map((category) => (
                <Link
                  key={category.slug}
                  to="/cards" search={{ category: undefined }}
                  search={{ category: category.slug }}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold text-foreground">
            Three steps to a moment they'll replay
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wand2,
                title: "Pick a card",
                text: "Choose an experience — birthday cake, apology letter or photo puzzle.",
              },
              {
                icon: Images,
                title: "Personalise it",
                text: "Add their name, your message and photos. Preview the magic live as you type.",
              },
              {
                icon: Gift,
                title: "Share the link",
                text: "Send it on WhatsApp or Instagram. They open it and play — no app needed.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        {data.testimonials.length > 0 && (
          <section className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className="text-center font-display text-3xl font-semibold text-foreground">
                Moments already made
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {data.testimonials.map((t, i) => (
                  <figure
                    key={i}
                    className="rounded-3xl border border-border bg-background p-6 shadow-card"
                  >
                    <div className="flex gap-0.5 text-coral">
                      {Array.from({ length: t.rating }, (_, j) => (
                        <Star key={j} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                      "{t.content}"
                    </blockquote>
                    <figcaption className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {t.author}
                      {t.location ? ` · ${t.location}` : ""}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="dark rounded-[2.5rem] bg-night-wash px-6 py-14 text-center shadow-card">
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Make someone's day today
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              It takes two minutes. The memory lasts a lot longer.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-xl">
              <Link to="/cards" search={{ category: undefined }}>
                Create your card
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
