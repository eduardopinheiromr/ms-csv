import { Injectable } from "@nestjs/common";
import { processBatch } from "./strategies/batch.processor";
import { processStream } from "./strategies/stream.processor";
import { processParallel } from "./strategies/parallel.processor";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async processFile(filePath: string, mode: "batch" | "stream" | "parallel") {
    const start = Date.now();

    let result;
    switch (mode) {
      case "stream":
        result = await processStream(filePath);
        break;
      case "parallel":
        result = await processParallel(filePath);
        break;
      case "batch":
      default:
        result = await processBatch(filePath);
        break;
    }

    const durationMs = Date.now() - start;

    let reportUrl: string | undefined;

    if (result.errors?.length) {
      const reportId = uuidv4();
      const reportsDir = join(__dirname, "..", "..", "public", "reports");

      if (!existsSync(reportsDir)) {
        mkdirSync(reportsDir, { recursive: true });
      }

      const reportPath = join(reportsDir, `${reportId}.json`);
      writeFileSync(
        reportPath,
        JSON.stringify(result.errors, null, 2),
        "utf-8",
      );

      const baseUrl = this.configService.get("BASE_URL");
      reportUrl = `${baseUrl}/reports/${reportId}.json`;
    }

    return {
      mode,
      duration: {
        milliseconds: durationMs,
        seconds: (durationMs / 1000).toFixed(2),
      },
      total: result.total,
      valid: result.valid,
      invalid: result.invalid,
      reportUrl,
    };
  }
}
