import { describe, expect, it } from "vitest";
import { formatPaise } from "@/lib/format";
import { getExperience } from "@/components/experiences/registry";
import { MAX_PHOTOS, MAX_VIDEOS, checkMediaFile } from "@/lib/media";

const EXPERIENCE_TYPES = [
  "birthday",
  "sorry",
  "photo_puzzle",
  "proposal",
  "anniversary",
  "thankyou",
  "missyou",
] as const;

describe("formatPaise", () => {
  it("renders ₹249 for 24900 paise (default template price)", () => {
    expect(formatPaise(24900)).toBe("₹249");
  });

  it("renders ₹199 for 19900 paise", () => {
    expect(formatPaise(19900)).toBe("₹199");
  });

  it("keeps paise visible when the price has a fraction", () => {
    expect(formatPaise(19950)).toBe("₹199.50");
  });
});

describe("experience registry", () => {
  it("maps every live experience type to a component", () => {
    for (const type of EXPERIENCE_TYPES) {
      const meta = getExperience(type);
      expect(meta, `experience type ${type}`).not.toBeNull();
      expect(typeof meta?.component).toBe("function");
    }
  });

  it("only the photo puzzle needs photos", () => {
    for (const type of EXPERIENCE_TYPES) {
      expect(getExperience(type)?.needsPhotos).toBe(type === "photo_puzzle");
    }
  });
});

describe("media limits", () => {
  it("allows at most 3 photos and 1 video per card", () => {
    expect(MAX_PHOTOS).toBe(3);
    expect(MAX_VIDEOS).toBe(1);
  });

  it("accepts reasonable photos and videos", () => {
    const photo = { type: "image/jpeg", size: 5 * 1024 * 1024, name: "pic.jpg" } as File;
    expect(checkMediaFile(photo)).toEqual({ ok: true, kind: "photo" });
    const video = { type: "video/mp4", size: 20 * 1024 * 1024, name: "clip.mp4" } as File;
    expect(checkMediaFile(video)).toEqual({ ok: true, kind: "video" });
  });

  it("rejects oversized files and non-media files", () => {
    const bigPhoto = { type: "image/png", size: 11 * 1024 * 1024, name: "big.png" } as File;
    expect(checkMediaFile(bigPhoto).ok).toBe(false);
    const bigVideo = { type: "video/mp4", size: 51 * 1024 * 1024, name: "long.mp4" } as File;
    expect(checkMediaFile(bigVideo).ok).toBe(false);
    const pdf = { type: "application/pdf", size: 1024, name: "doc.pdf" } as File;
    expect(checkMediaFile(pdf).ok).toBe(false);
  });
});
