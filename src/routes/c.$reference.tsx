import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { getDraftByReference } from "@/lib/drafts.functions";
import { getExperience } from "@/components/experiences/registry";
import { BirthdayExperience } from "@/components/experiences/birthday-experience";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/c/$reference")({
  loader: async ({ params }) => {
    const draft = await getDraftByReference({ data: params.reference });
    if (!draft) throw notFound();
    return { draft };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.draft.personalization.recipientName;
    const title = name ? `A little surprise for ${name} 💌` : "A card made for you";
    const description =
      loaderData?.draft.personalization.message.slice(0, 150) ??
      "Someone made this interactive card for you on HeartMuse.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ViewCard,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">The card didn't load. Please refresh.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-hero-wash px-4 text-center">
      <p className="font-display text-2xl font-semibold text-foreground">
        This link has expired or doesn't exist
      </p>
      <p className="text-sm text-muted-foreground">
        But you can make one just as special.
      </p>
      <Button asChild className="mt-2 rounded-xl">
        <Link to="/cards" search={{ category: undefined }}>Make a card</Link>
      </Button>
    </div>
  ),
});

function ViewCard() {
  const { draft } = Route.useLoaderData();
  const meta = getExperience(draft.experienceType);
  const Experience = meta?.component ?? BirthdayExperience;

  return (
    <div className="flex min-h-screen flex-col bg-hero-wash">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          A HeartMuse card for you
        </p>
        <div className="mt-6">
          <Experience personalization={draft.personalization} mode="live" />
        </div>
        <div className="mt-10 pb-8 text-center">
          <div className="mx-auto flex w-fit items-center gap-1.5 text-sm font-medium text-foreground">
            <Heart className="size-4 fill-current text-coral" />
            Made with HeartMuse
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Want to make someone else smile like this?
          </p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/cards" search={{ category: undefined }}>Make a card</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
