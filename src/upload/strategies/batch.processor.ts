import { Prescription, validatePrescription } from "../validation";
import * as fs from "fs";
import * as csv from "csv-parser";
import { ZodError } from "zod";

export async function processBatch(filePath: string) {
  const data = await fs.promises.readFile(filePath, "utf-8");
  const lines = data.split("\n").filter(Boolean);
  const rows: Record<string, string>[] = [];

  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = values[idx]));
    rows.push(row);
  }

  const valid: Prescription[] = [];
  const invalid: { row: any; errors: ZodError<Prescription> }[] = [];

  for (const row of rows) {
    const result = validatePrescription(row);
    if (result.success) valid.push(result.data);
    else invalid.push({ row, errors: result.error });
  }

  return {
    total: rows.length,
    valid: valid.length,
    invalid: invalid.length,
    errors: invalid,
  };
}
