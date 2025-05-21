import { Worker } from "worker_threads";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

type ValidationResult = {
  valid: number;
  invalid: number;
  errors: Array<{
    row: Record<string, string>;
    errors: any;
  }>;
};

export async function processParallel(
  filePath: string,
): Promise<ValidationResult & { total: number }> {
  const cpuCount = os.cpus().length;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  const headers = lines[0];
  const chunks = Array.from({ length: cpuCount }, () => [] as string[]);

  for (let i = 1; i < lines.length; i++) {
    chunks[i % cpuCount].push(lines[i]);
  }

  const results: ValidationResult[] = await Promise.all(
    chunks.map((chunk) => {
      return new Promise<ValidationResult>((resolve, reject) => {
        const worker = new Worker(
          path.join(__dirname, "../workers/csv.worker.js"),
          {
            workerData: {
              headers,
              lines: chunk,
            },
          },
        );
        worker.on("message", (message) => resolve(message as ValidationResult));
        worker.on("error", reject);
      });
    }),
  );

  const combined = results.reduce<ValidationResult>(
    (acc, r) => {
      acc.valid += r.valid;
      acc.invalid += r.invalid;
      acc.errors.push(...r.errors);
      return acc;
    },
    { valid: 0, invalid: 0, errors: [] },
  );

  return {
    total: combined.valid + combined.invalid,
    ...combined,
  };
}
