import { Injectable } from "@nestjs/common";
import { processBatch } from "./strategies/batch.processor";
import { processStream } from "./strategies/stream.processor";
import { processParallel } from "./strategies/parallel.processor";
import { performance } from "perf_hooks";

@Injectable()
export class UploadService {
  async processFile(filePath: string, mode: "batch" | "stream" | "parallel") {
    const start = performance.now();

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

    const end = performance.now();
    const durationMs = end - start;

    return {
      duration: {
        milliseconds: Math.round(durationMs),
        seconds: (durationMs / 1000).toFixed(2),
      },
      ...result,
    };
  }
}
