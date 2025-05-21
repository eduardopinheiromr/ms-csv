import { Module } from "@nestjs/common";
import { UploadController } from "./upload/upload.controller";
import { UploadService } from "./upload/upload.service";
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
  providers: [UploadService, ApiKeyGuard],
})
export class AppModule {}
