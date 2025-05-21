import { parentPort, workerData } from "worker_threads";
import { Prescription, validatePrescription } from "../validation";
import { ZodError } from "zod";

const { headers, lines } = workerData;

const valid: Prescription[] = [];
const invalid: { row: any; errors: ZodError<Prescription> }[] = [];

for (const line of lines) {
  const values = line.split(",");
  const row: Record<string, string> = {};
  headers.split(",").forEach((h, idx) => (row[h] = values[idx]));

  const result = validatePrescription(row);
  if (result.success) valid.push(result.data);
  else invalid.push({ row, errors: result.error });
}

parentPort?.postMessage({
  valid: valid.length,
  invalid: invalid.length,
  errors: invalid,
});
