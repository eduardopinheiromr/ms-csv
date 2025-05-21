import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as csv from "csv-parser";

@Injectable()
export class CsvParserService {
  async parse(filePath: string): Promise<any[]> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  }
}
