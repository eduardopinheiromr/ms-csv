import { Injectable } from "@nestjs/common";
import { CsvParserService } from "../csv-parser/csv-parser.service";
import { validatePrescription } from "./validation";

@Injectable()
export class UploadService {
  constructor(private readonly csvParser: CsvParserService) {}

  async processFile(filePath: string) {
    const rows = await this.csvParser.parse(filePath);
    const valid: any[] = [];
    const invalid: any[] = [];

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
}
