import { Module } from "@nestjs/common";
import { UploadController } from "./upload/upload.controller";
import { UploadService } from "./upload/upload.service";
import { CsvParserService } from "./csv-parser/csv-parser.service";
import { ConfigModule } from "@nestjs/config";
import { ApiKeyGuard } from "./common/guards/api-key.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, CsvParserService, ApiKeyGuard],
})
export class AppModule {}
