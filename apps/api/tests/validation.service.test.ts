import { describe, it, expect } from "vitest";
import {
  validateExtractions,
  normalizeMultiValueFields,
  sanitizeLineBreaks,
} from "../src/services/validation.service";

const sourceRow = { name: "Jane Doe", email: "jane@example.com" };

describe("validateExtractions", () => {
  it("imports a well-formed record with contact info", () => {
    const { imported, skipped } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          name: "Jane Doe",
          email: "jane@example.com",
          country_code: "+91",
          mobile_without_country_code: "9876543210",
          company: null,
          city: null,
          state: null,
          country: null,
          lead_owner: null,
          crm_status: "GOOD_LEAD_FOLLOW_UP",
          crm_note: null,
          data_source: null,
          possession_time: null,
          description: null,
        },
      ],
      [sourceRow]
    );
    expect(imported).toHaveLength(1);
    expect(skipped).toHaveLength(0);
  });

  it("skips a record with neither email nor mobile", () => {
    const { imported, skipped } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          name: "No Contact",
          email: null,
          mobile_without_country_code: null,
        },
      ],
      [sourceRow]
    );
    expect(imported).toHaveLength(0);
    expect(skipped).toHaveLength(1);
    expect(skipped[0].reason).toMatch(/email or mobile/i);
  });

  it("skips a record with an invalid crm_status enum value", () => {
    const { imported, skipped } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          email: "jane@example.com",
          crm_status: "NOT_A_REAL_STATUS",
        },
      ],
      [sourceRow]
    );
    expect(imported).toHaveLength(0);
    expect(skipped).toHaveLength(1);
  });

  it("skips a record with an unparseable created_at date", () => {
    const { imported, skipped } = validateExtractions(
      [{ created_at: "not-a-date", email: "jane@example.com" }],
      [sourceRow]
    );
    expect(imported).toHaveLength(0);
    expect(skipped).toHaveLength(1);
  });

  it("throws when the model returns a mismatched record count", () => {
    expect(() => validateExtractions([], [sourceRow, sourceRow])).toThrow(/mismatch/i);
  });

  it("code-enforces the multi-email rule even when the model ignores the prompt", () => {
    const { imported, skipped } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          email: "primary@example.com, secondary@example.com",
          crm_note: "Client is interested",
        },
      ],
      [sourceRow]
    );
    expect(skipped).toHaveLength(0);
    expect(imported).toHaveLength(1);
    expect(imported[0].email).toBe("primary@example.com");
    expect(imported[0].crm_note).toContain("secondary@example.com");
    expect(imported[0].crm_note).toContain("Client is interested");
  });

  it("code-enforces the multi-mobile rule even when the model ignores the prompt", () => {
    const { imported } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          email: "jane@example.com",
          mobile_without_country_code: "9876543210 / 9123456780",
        },
      ],
      [sourceRow]
    );
    expect(imported[0].mobile_without_country_code).toBe("9876543210");
    expect(imported[0].crm_note).toContain("9123456780");
  });

  it("escapes raw line breaks in free-text fields so CSV re-export stays valid", () => {
    const { imported } = validateExtractions(
      [
        {
          created_at: "2026-05-13 14:20:48",
          email: "jane@example.com",
          description: "Line one\nLine two\r\nLine three",
        },
      ],
      [sourceRow]
    );
    expect(imported[0].description).toBe("Line one\\nLine two\\nLine three");
    expect(imported[0].description).not.toMatch(/\n|\r/);
  });
});

describe("normalizeMultiValueFields", () => {
  it("leaves a single clean email untouched", () => {
    const result = normalizeMultiValueFields({ email: "solo@example.com" });
    expect(result.email).toBe("solo@example.com");
    expect(result.crm_note).toBeUndefined();
  });

  it("handles an 'and'-separated multi-mobile value", () => {
    const result = normalizeMultiValueFields({
      mobile_without_country_code: "9876543210 and 9123456780",
    });
    expect(result.mobile_without_country_code).toBe("9876543210");
    expect(result.crm_note).toContain("9123456780");
  });
});

describe("sanitizeLineBreaks", () => {
  it("is a no-op for records with no line breaks", () => {
    const record = {
      created_at: "2026-05-13 14:20:48",
      name: "Jane",
      email: "jane@example.com",
      country_code: null,
      mobile_without_country_code: null,
      company: null,
      city: null,
      state: null,
      country: null,
      lead_owner: null,
      crm_status: null,
      crm_note: "A single-line note",
      data_source: null,
      possession_time: null,
      description: null,
    } as const;
    expect(sanitizeLineBreaks(record as any).crm_note).toBe("A single-line note");
  });
});