import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createPublicSupabase } from "./supabase-public.server";

export type TemplateDto = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  experienceType: string;
  pricePaise: number;
  categoryId: string | null;
  isNew: boolean;
  isFeatured: boolean;
};

export type CategoryDto = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
};

export type TestimonialDto = {
  author: string;
  content: string;
  location: string | null;
  rating: number;
};

export type CatalogDto = {
  templates: TemplateDto[];
  categories: CategoryDto[];
  testimonials: TestimonialDto[];
};

export const getCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogDto> => {
    const db = createPublicSupabase();
    const [templatesRes, categoriesRes, testimonialsRes] = await Promise.all([
      db
        .from("templates")
        .select(
          "slug,name,tagline,description,experience_type,base_price_paise,category_id,is_new,is_featured",
        )
        .eq("is_active", true)
        .order("sort_order"),
      db
        .from("categories")
        .select("id,slug,name,icon,description")
        .eq("is_active", true)
        .order("sort_order"),
      db
        .from("testimonials")
        .select("author_display_name,content,location,rating")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    if (templatesRes.error) throw new Error(templatesRes.error.message);
    if (categoriesRes.error) throw new Error(categoriesRes.error.message);
    if (testimonialsRes.error) throw new Error(testimonialsRes.error.message);

    return {
      templates: (templatesRes.data ?? []).map((t) => ({
        slug: t.slug,
        name: t.name,
        tagline: t.tagline,
        description: t.description,
        experienceType: t.experience_type,
        pricePaise: t.base_price_paise,
        categoryId: t.category_id,
        isNew: t.is_new,
        isFeatured: t.is_featured,
      })),
      categories: (categoriesRes.data ?? []).map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        description: c.description,
      })),
      testimonials: (testimonialsRes.data ?? []).map((t) => ({
        author: t.author_display_name,
        content: t.content,
        location: t.location,
        rating: t.rating,
      })),
    };
  },
);

export const getTemplate = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<TemplateDto | null> => {
    const db = createPublicSupabase();
    const { data, error } = await db
      .from("templates")
      .select(
        "slug,name,tagline,description,experience_type,base_price_paise,category_id,is_new,is_featured",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      slug: data.slug,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      experienceType: data.experience_type,
      pricePaise: data.base_price_paise,
      categoryId: data.category_id,
      isNew: data.is_new,
      isFeatured: data.is_featured,
    };
  });

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 60_000,
});
