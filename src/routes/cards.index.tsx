import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TemplateCard } from "@/components/template-card";

export const Route = createFileRoute("/cards/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({
    meta: [
      { title: "All Cards — HeartMuse" },
      {
        name: "description",
        content:
          "Browse interactive digital greeting cards: birthday cake reveals, heartfelt apologies, photo puzzles and more. Personalise and share one link.",
      },
      { property: "og:title", content: "Interactive Cards — HeartMuse" },
      {
        property: "og:description",
        content: "Pick an interactive card experience, personalise it and share the magic link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CardsPage,
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

function CardsPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();

  const activeCategory = data.categories.find((c) => c.slug === category);
  const templates = activeCategory
    ? data.templates.filter((t) => t.categoryId === activeCategory.id)
    : data.templates;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {activeCategory ? activeCategory.name : "All cards"}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {activeCategory?.description ??
              "Every card is an interactive experience. Tap one to see it play."}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => navigate({ search: (prev) => ({ ...prev, category: undefined }) })}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !activeCategory
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {data.categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => navigate({ search: (prev) => ({ ...prev, category: c.slug }) })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory?.slug === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>

          {templates.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                No cards here yet — but one is probably on the way.
              </p>
              <Link
                to="/cards"
                search={{ category: undefined }}
                className="mt-2 inline-block text-sm font-medium text-primary"
              >
                Show all cards
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
