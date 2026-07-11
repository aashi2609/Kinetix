import { describe, it, expect } from "vitest";
import { parseCsvBuffer, CsvParseError } from "../src/services/csv-parser.service";

describe("parseCsvBuffer", () => {
  it("parses a well-formed CSV into header-keyed rows", () => {
    const csv = "name,email\nJane Doe,jane@example.com\nJohn Roe,john@example.com\n";
    const { headers, rows } = parseCsvBuffer(Buffer.from(csv));

    expect(headers).toEqual(["name", "email"]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ name: "Jane Doe", email: "jane@example.com" });
  });

  it("does not assume fixed column names — arbitrary headers pass through as-is", () => {
    const csv = "Full Name,Contact Number,Ad Campaign\nAnkit,9123456780,Meridian Tower\n";
    const { headers, rows } = parseCsvBuffer(Buffer.from(csv));

    expect(headers).toEqual(["Full Name", "Contact Number", "Ad Campaign"]);
    expect(rows[0]["Ad Campaign"]).toBe("Meridian Tower");
  });

  it("throws CsvParseError for a header-only file with no data rows", () => {
    const csv = "name,email\n";
    expect(() => parseCsvBuffer(Buffer.from(csv))).toThrow(CsvParseError);
    expect(() => parseCsvBuffer(Buffer.from(csv))).toThrow(/no data rows/i);
  });

  it("throws CsvParseError for structurally malformed CSV", () => {
    const csv = 'name,note\n"Jane,"unterminated quote\n';
    expect(() => parseCsvBuffer(Buffer.from(csv))).toThrow(CsvParseError);
  });

  it("strips a UTF-8 BOM instead of corrupting the first header name", () => {
    const csv = "\uFEFFname,email\nJane,jane@example.com\n";
    const { headers } = parseCsvBuffer(Buffer.from(csv));
    expect(headers[0]).toBe("name");
  });

  it("trims incidental whitespace around values", () => {
    const csv = "name, email \n Jane Doe , jane@example.com \n";
    const { rows } = parseCsvBuffer(Buffer.from(csv));
    expect(rows[0].email).toBe("jane@example.com");
    expect(rows[0].name).toBe("Jane Doe");
  });

  it("skips fully blank lines rather than producing empty records", () => {
    const csv = "name,email\nJane,jane@example.com\n\n\nJohn,john@example.com\n";
    const { rows } = parseCsvBuffer(Buffer.from(csv));
    expect(rows).toHaveLength(2);
  });

  it("parses real sample files unchanged (regression check against fixtures)", () => {
    const fs = require("fs");
    const path = require("path");
    const samplesDir = path.resolve(__dirname, "../../../samples");

    const fb = parseCsvBuffer(fs.readFileSync(path.join(samplesDir, "facebook_lead_export.csv")));
    expect(fb.headers).toContain("Full Name");
    expect(fb.rows).toHaveLength(3);

    const manual = parseCsvBuffer(fs.readFileSync(path.join(samplesDir, "manual_spreadsheet.csv")));
    expect(manual.headers).toContain("Lead");
    expect(manual.rows).toHaveLength(2);
    expect(manual.rows[0]["Contact"]).toContain("rahul.mehta@corp.com");
  });
});