import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const personalizationSchema = z.object({
  recipientName: z.string().trim().min(1).max(60),
  senderName: z.string().trim().min(1).max(60),
  message: z.string().trim().min(1).max(2000),
  photos: z.array(z.string().min(1).max(600)).max(6).default([]),
});

export type SavedDraft = {
  reference: string;
  experienceType: string;
  templateName: string;
  personalization: {
    recipientName: string;
    senderName: string;
    message: string;
    photos: string[];
  };
};

export const createDraft = createServerFn({ method: "POST" })
  .inputValidator((data: { templateSlug: string; personalization: unknown }) =>
    z
      .object({
        templateSlug: z.string().min(1).max(120),
        personalization: personalizationSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: template, error: templateError } = await supabaseAdmin
      .from("templates")
      .select("id")
      .eq("slug", data.templateSlug)
      .eq("is_active", true)
      .maybeSingle();
    if (templateError) throw new Error(templateError.message);
    if (!template) throw new Error("Template not found");

    const reference = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("drafts").insert({
      session_reference: reference,
      template_id: template.id,
      personalization: data.personalization,
      status: "draft",
      expires_at: expiresAt,
    });
    if (error) throw new Error(error.message);

    return { reference };
  });

export const getDraftByReference = createServerFn({ method: "GET" })
  .inputValidator((reference: string) => reference)
  .handler(async ({ data: reference }): Promise<SavedDraft | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("drafts")
      .select(
        "session_reference, personalization, expires_at, templates(name, experience_type)",
      )
      .eq("session_reference", reference)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return null;

    const p = (row.personalization ?? {}) as {
      recipientName?: string;
      senderName?: string;
      message?: string;
      photos?: string[];
    };

    let photoUrls: string[] = [];
    const paths = (p.photos ?? []).filter((path) => !path.startsWith("http"));
    if (paths.length > 0) {
      const { data: signed, error: signError } = await supabaseAdmin.storage
        .from("card-media")
        .createSignedUrls(paths, 60 * 60 * 24);
      if (!signError && signed) {
        photoUrls = paths
          .map((path) => signed.find((s) => s.path === path)?.signedUrl ?? "")
          .filter(Boolean);
      }
    }

    return {
      reference: row.session_reference,
      experienceType: row.templates?.experience_type ?? "birthday",
      templateName: row.templates?.name ?? "Card",
      personalization: {
        recipientName: p.recipientName ?? "",
        senderName: p.senderName ?? "",
        message: p.message ?? "",
        photos: photoUrls,
      },
    };
  });
