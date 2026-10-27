import { describe, expect, it } from "vitest";
import { formatPaise } from "@/lib/format";
import { experiences, getExperience } from "@/components/experiences/registry";

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
    for (const type of ["birthday", "sorry", "photo_puzzle"]) {
      const meta = getExperience(type);
      expect(meta, `experience type ${type}`).not.toBeNull();
      expect(typeof meta?.component).toBe("function");
    }
  });

  it("only the photo puzzle needs photos", () => {
    expect(experiences.birthday.needsPhotos).toBe(false);
    expect(experiences.sorry.needsPhotos).toBe(false);
    expect(experiences.photo_puzzle.needsPhotos).toBe(true);
  });
});
