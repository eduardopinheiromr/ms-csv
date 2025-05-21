import { Prescription, validatePrescription } from "../validation";
import * as fs from "fs";
import * as csv from "csv-parser";
import { ZodError } from "zod";

export async function processStream(filePath: string) {
  return new Promise((resolve, reject) => {
    const valid: Prescription[] = [];
    const invalid: { row: any; errors: ZodError<Prescription> }[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const result = validatePrescription(row);
        if (result.success) valid.push(result.data);
        else invalid.push({ row, errors: result.error });
      })
      .on("end", () => {
        resolve({
          total: valid.length + invalid.length,
          valid: valid.length,
          invalid: invalid.length,
          errors: invalid,
        });
      })
      .on("error", (err) => reject(err));
  });
}
