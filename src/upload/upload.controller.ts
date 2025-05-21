import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UploadService } from "./upload.service";
import {
  ApiConsumes,
  ApiBody,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";

@ApiSecurity("x-api-key")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: "Upload de arquivo CSV para processamento" })
  @ApiConsumes("multipart/form-data")
  @ApiQuery({
    name: "mode",
    required: false,
    enum: ["batch", "stream", "parallel"],
    description: "Modo de processamento (default: batch)",
  })
  @ApiBody({
    description: "Arquivo CSV",
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Processamento concluído" })
  @ApiResponse({ status: 401, description: "API key inválida ou ausente" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${Date.now()}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query("mode") mode: "batch" | "stream" | "parallel" = "batch",
  ) {
    return this.uploadService.processFile(file.path, mode);
  }
}
