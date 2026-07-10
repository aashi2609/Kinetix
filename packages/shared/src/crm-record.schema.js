"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmRecordBatchSchema = exports.CrmRecordSchema = void 0;
exports.hasContactInfo = hasContactInfo;
const zod_1 = require("zod");
const enums_1 = require("./enums");
/**
 * Base shape validation only — field types, enum membership, date parseability.
 * Business rules (e.g. "must have email or mobile") are enforced separately
 * in `hasContactInfo` so we can distinguish "malformed" from "valid but skippable".
 */
exports.CrmRecordSchema = zod_1.z.object({
    created_at: zod_1.z
        .string()
        .refine((v) => !Number.isNaN(Date.parse(v)), {
        message: "created_at must be a valid, JS-parseable date string",
    }),
    name: zod_1.z.string().trim().min(1).nullable().default(null),
    email: zod_1.z.string().trim().email().nullable().default(null),
    country_code: zod_1.z.string().trim().nullable().default(null),
    mobile_without_country_code: zod_1.z.string().trim().nullable().default(null),
    company: zod_1.z.string().trim().nullable().default(null),
    city: zod_1.z.string().trim().nullable().default(null),
    state: zod_1.z.string().trim().nullable().default(null),
    country: zod_1.z.string().trim().nullable().default(null),
    lead_owner: zod_1.z.string().trim().nullable().default(null),
    crm_status: zod_1.z.enum(enums_1.CRM_STATUS).nullable().default(null),
    crm_note: zod_1.z.string().trim().nullable().default(null),
    data_source: zod_1.z.enum(enums_1.DATA_SOURCE).nullable().default(null),
    possession_time: zod_1.z.string().trim().nullable().default(null),
    description: zod_1.z.string().trim().nullable().default(null),
});
/** Business rule from the spec: a record with neither email nor mobile must be skipped. */
function hasContactInfo(record) {
    return Boolean(record.email) || Boolean(record.mobile_without_country_code);
}
/** The array shape the LLM must return for a batch of input rows. */
exports.CrmRecordBatchSchema = zod_1.z.array(exports.CrmRecordSchema);
