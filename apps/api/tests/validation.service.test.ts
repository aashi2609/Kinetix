import { describe, it, expect } from "vitest";
import { validateExtractions } from "../src/services/validation.service";

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
});
