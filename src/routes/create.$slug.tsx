import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  MessageCircle,
  ShieldCheck,
  PartyPopper,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getTemplate } from "@/lib/catalog.functions";
import { createDraft } from "@/lib/drafts.functions";
import { draftCardMessage } from "@/lib/ai.functions";
import {
  createCheckoutOrder,
  paySandboxOrder,
  type CheckoutOrder,
} from "@/lib/payments.functions";
import { validateDeliverAt } from "@/lib/schedule";
import { getExperience } from "@/components/experiences/registry";
import { formatPaise } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { MAX_PHOTOS, MAX_VIDEOS, checkMediaFile } from "@/lib/media";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExperiencePersonalization } from "@/components/experiences/experience-frame";

type PhotoItem = { path: string; previewUrl: string };
type VideoItem = { path: string; previewUrl: string };

export const Route = createFileRoute("/create/$slug")({
  loader: async ({ params }) => {
    const template = await getTemplate({ data: params.slug });
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.template.name;
    return {
      meta: [
        {
          title: name ? `Personalise ${name} — HeartMuse` : "Create a card — HeartMuse",
        },
        {
          name: "description",
          content:
            "Add their name, your message and photos. Watch the card come alive in a live preview, then share one link.",
        },
        {
          property: "og:title",
          content: name ? `Personalise ${name} — HeartMuse` : "Create a card — HeartMuse",
        },
        {
          property: "og:description",
          content: "Personalise an interactive card with your words and photos, then share it.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CreateCard,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">The page didn't load. Please refresh.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-display text-2xl font-semibold text-foreground">Card not found</p>
      <Button asChild className="mt-2 rounded-xl">
        <Link to="/cards" search={{ category: undefined }}>Browse cards</Link>
      </Button>
    </div>
  ),
});

function CreateCard() {
  const { template } = Route.useLoaderData();
  const navigate = useNavigate();
  const meta = getExperience(template.experienceType);
  const Experience = meta?.component;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [aiOccasion, setAiOccasion] = useState("");
  const [aiRelationship, setAiRelationship] = useState("");
  const [aiTone, setAiTone] = useState("Heartfelt");
  const [drafting, setDrafting] = useState(false);
  const [deliverAt, setDeliverAt] = useState("");
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const uploadToken = useRef<string | null>(null);

  const createDraftFn = useServerFn(createDraft);
  const draftAiFn = useServerFn(draftCardMessage);
  const checkoutFn = useServerFn(createCheckoutOrder);
  const payFn = useServerFn(paySandboxOrder);

  if (!meta || !Experience) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          This card is being crafted
        </p>
        <Button asChild className="mt-2 rounded-xl">
          <Link to="/cards" search={{ category: undefined }}>Browse cards</Link>
        </Button>
      </div>
    );
  }

  const messageField = meta.fields.find((f) => f.key === "message");
  const detailsValid =
    recipientName.trim().length > 0 &&
    senderName.trim().length > 0 &&
    message.trim().length > 0;
  const photosValid = !meta.needsPhotos || photos.length > 0;
  const canContinue = detailsValid && photosValid;

  const personalization: ExperiencePersonalization = {
    recipientName: recipientName.trim() || "Someone special",
    senderName: senderName.trim() || "With love",
    message:
      message.trim() ||
      (messageField?.placeholder ?? "Every word here is just for you."),
    photos: photos.map((p) => p.previewUrl),
    videos: videos.map((v) => v.previewUrl),
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const accepted: { file: File; kind: "photo" | "video" }[] = [];
    const fullByKind: Record<"photo" | "video", boolean> = { photo: false, video: false };
    for (const file of Array.from(files)) {
      const check = checkMediaFile(file);
      if (!check.ok) {
        toast.error(check.reason);
        continue;
      }
      const room =
        check.kind === "photo" ? MAX_PHOTOS - photos.length : MAX_VIDEOS - videos.length;
      if (room <= 0) {
        fullByKind[check.kind] = true;
        continue;
      }
      accepted.push({ file, kind: check.kind });
    }
    if (fullByKind.photo) toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
    if (fullByKind.video) toast.error(`Only ${MAX_VIDEOS} video is allowed per card.`);
    if (accepted.length === 0) return;

    setUploading(true);
    try {
      if (!uploadToken.current) uploadToken.current = crypto.randomUUID();
      const newPhotos: PhotoItem[] = [];
      const newVideos: VideoItem[] = [];
      let photoCount = photos.length;
      let videoCount = videos.length;
      for (const { file, kind } of accepted) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        // Path is relative to the "card-media" bucket.
        const path =
          kind === "photo"
            ? `${uploadToken.current}/photo-${photoCount++}-${safeName}`
            : `${uploadToken.current}/video-${videoCount++}-${safeName}`;
        const { error } = await supabase.storage.from("card-media").upload(path, file, {
          contentType: file.type,
        });
        if (error) throw new Error(error.message);
        if (kind === "photo") {
          newPhotos.push({ path, previewUrl: URL.createObjectURL(file) });
        } else {
          newVideos.push({ path, previewUrl: URL.createObjectURL(file) });
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
      setVideos((prev) => [...prev, ...newVideos]);
      const total = newPhotos.length + newVideos.length;
      toast.success(total === 1 ? "Media added." : `${total} items added.`);
    } catch {
      toast.error("Uploading didn't work. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (item: PhotoItem) => {
    setPhotos((prev) => prev.filter((p) => p !== item));
  };

  const removeVideo = (item: VideoItem) => {
    setVideos((prev) => prev.filter((v) => v !== item));
  };

  const draftWithAi = async () => {
    const relationship = aiRelationship.trim();
    if (!relationship) {
      toast.error("Tell us who it's for — e.g. 'my best friend'.");
      return;
    }
    setDrafting(true);
    try {
      const result = await draftAiFn({
        data: {
          occasion: aiOccasion.trim() || template.name,
          relationship,
          tone: aiTone,
          recipientName: recipientName.trim() || undefined,
        },
      });
      if (result.ok) {
        setMessage(result.text);
        toast.success("Message drafted — edit it any way you like.");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("The AI helper didn't respond. Please try again.");
    } finally {
      setDrafting(false);
    }
  };

  const finish = async () => {
    const deliverCheck = validateDeliverAt(deliverAt);
    if (!deliverCheck.ok) {
      toast.error(deliverCheck.reason);
      return;
    }
    setSaving(true);
    try {
      const result = await createDraftFn({
        data: {
          templateSlug: template.slug,
          deliverAt: deliverCheck.iso,
          personalization: {
            recipientName: recipientName.trim(),
            senderName: senderName.trim(),
            message: message.trim(),
            photos: photos.map((p) => p.path),
            videos: videos.map((v) => v.path),
          },
        },
      });
      setReference(result.reference);
      setStep(3);
      toast.success("Your card is ready to share!");
    } catch {
      toast.error("Saving your card didn't work. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const shareUrl = reference ? `${window.location.origin}/c/${reference}` : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Couldn't copy — long-press the link instead.");
    }
  };

  const stepLabels = ["Details", "Preview", "Share"];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/cards/$slug", params: { slug: template.slug } })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to card
          </button>

          <h1 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Personalise: {template.name}
          </h1>
          <div className="mt-4 flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                    step > i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    step > i ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && <span className="h-px w-6 bg-border sm:w-10" />}
              </div>
            ))}
          </div>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_0.95fr]">
            {/* Form column */}
            <div>
              {step === 1 && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    The details
                  </h2>
                  <div className="mt-6 space-y-5">
                    {meta.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {field.multiline ? (
                          <Textarea
                            id={field.key}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            maxLength={2000}
                          />
                        ) : (
                          <Input
                            id={field.key}
                            value={field.key === "recipientName" ? recipientName : senderName}
                            onChange={(e) =>
                              field.key === "recipientName"
                                ? setRecipientName(e.target.value)
                                : setSenderName(e.target.value)
                            }
                            placeholder={field.placeholder}
                            maxLength={60}
                          />
                        )}
                      </div>
                    ))}

                    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">Stuck for words?</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="ai-occasion">Occasion</Label>
                          <Input
                            id="ai-occasion"
                            value={aiOccasion}
                            onChange={(e) => setAiOccasion(e.target.value)}
                            placeholder={`e.g. ${template.name}`}
                            maxLength={120}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="ai-relationship">Your relationship</Label>
                          <Input
                            id="ai-relationship"
                            value={aiRelationship}
                            onChange={(e) => setAiRelationship(e.target.value)}
                            placeholder="e.g. my best friend"
                            maxLength={120}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="ai-tone">Tone</Label>
                          <select
                            id="ai-tone"
                            value={aiTone}
                            onChange={(e) => setAiTone(e.target.value)}
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                          >
                            {["Heartfelt", "Playful", "Funny", "Romantic", "Formal", "Poetic"].map(
                              (tone) => (
                                <option key={tone} value={tone}>
                                  {tone}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full rounded-xl"
                            disabled={drafting}
                            onClick={() => void draftWithAi()}
                          >
                            {drafting ? (
                              <Loader2 className="mr-1 size-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-1 size-4" />
                            )}
                            Draft with AI
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        It writes one message into the box above — edit it any way you like.
                      </p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="shrink-0">
                          Photos ({photos.length}/{MAX_PHOTOS}) · Video ({videos.length}/
                          {MAX_VIDEOS})
                        </Label>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                          {uploading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <ImagePlus className="size-3.5" />
                          )}
                          Add media
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              void handleFiles(e.target.files);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                      {photos.length === 0 && videos.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          {meta.needsPhotos
                            ? "The first photo hides inside the puzzle. Add 1–3 photos, up to 10 MB each, plus 1 video up to 50 MB."
                            : "Optional: add up to 3 photos (10 MB each) and 1 video (50 MB) to make it personal."}
                        </p>
                      ) : (
                        <>
                          {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {photos.map((photo, i) => (
                                <div
                                  key={photo.path}
                                  className="group relative overflow-hidden rounded-xl border border-border"
                                >
                                  <img
                                    src={photo.previewUrl}
                                    alt={`Photo ${i + 1}`}
                                    className="aspect-square w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(photo)}
                                    aria-label={`Remove photo ${i + 1}`}
                                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                  {i === 0 && meta.needsPhotos && (
                                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                                      In puzzle
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {videos.map((video, i) => (
                            <div
                              key={video.path}
                              className="relative overflow-hidden rounded-xl border border-border"
                            >
                              <video
                                src={video.previewUrl}
                                muted
                                playsInline
                                preload="metadata"
                                className="aspect-video w-full bg-black"
                              />
                              <button
                                type="button"
                                onClick={() => removeVideo(video)}
                                aria-label={`Remove video ${i + 1}`}
                                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                                Video {i + 1}
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="mt-6 w-full rounded-xl sm:w-auto"
                    disabled={!canContinue}
                    onClick={() => setStep(2)}
                  >
                    Preview the magic
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                  {!canContinue && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {detailsValid
                        ? "Add at least one photo to continue."
                        : "Fill in every detail to continue."}
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Looks right?
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Play with the preview. Go back any time to change your words.
                  </p>
                  <div className="mt-6 space-y-2 rounded-2xl border border-border bg-background p-4">
                    <Label htmlFor="deliver-at" className="flex items-center gap-1.5">
                      <CalendarClock className="size-4" />
                      Deliver later (optional)
                    </Label>
                    <Input
                      id="deliver-at"
                      type="datetime-local"
                      value={deliverAt}
                      onChange={(e) => setDeliverAt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Pick a date and time and the card stays locked until then. Leave empty to
                      share right away.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="rounded-xl"
                      onClick={() => void finish()}
                      disabled={saving}
                    >
                      {saving && <Loader2 className="mr-1 size-4 animate-spin" />}
                      Save & get my link
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setStep(1)}
                    >
                      Edit details
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Launch price {formatPaise(template.pricePaise)} · payments open soon ·
                    sharing this preview link is free.
                  </p>
                </div>
              )}

              {step === 3 && reference && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-coral/15 text-coral">
                      <PartyPopper className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        {deliverAt ? "Scheduled!" : "Your card is live"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {deliverAt
                          ? `It opens on ${new Date(deliverAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}. Share the link now — it unlocks then.`
                          : `Send this link to ${personalization.recipientName}.`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                    <p className="flex-1 truncate text-sm text-foreground">{shareUrl}</p>
                    <Button size="sm" variant="secondary" onClick={() => void copyLink()}>
                      <Copy className="mr-1 size-3.5" />
                      Copy
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="rounded-xl bg-primary">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `I made something for you 💌 ${shareUrl}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="mr-1 size-4" />
                        Share on WhatsApp
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-xl">
                      <Link to="/c/$reference" params={{ reference }}>
                        Open your card
                      </Link>
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    The link works for 90 days.{" "}
                    {deliverAt
                      ? "It stays locked until the time you chose."
                      : "Payments open soon — until then, sharing is completely free."}
                  </p>
                </div>
              )}
            </div>

            {/* Live preview column */}
            <div className="relative mx-auto w-full max-w-md lg:sticky lg:top-24">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-lavender via-background to-coral/20 blur-2xl" />
              <Experience personalization={personalization} mode="live" />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {step === 3 ? "This is the exact card they'll receive." : "Live preview — updates as you type."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
