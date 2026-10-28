import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>HeartMuse — cards they'll play, not just read.</p>
        <div className="flex gap-4">
          <Link to="/cards" search={{ category: undefined }} className="transition-colors hover:text-foreground">
            Cards
          </Link>
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
