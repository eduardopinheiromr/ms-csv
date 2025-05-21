import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as express from "express";
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiKeyGuard } from "./common/guards/api-key.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));
  app.use(
    "/reports",
    express.static(join(__dirname, "..", "public", "reports")),
  );
  app.useGlobalGuards(app.get(ApiKeyGuard));

  const config = new DocumentBuilder()
    .setTitle("MS-CSV")
    .setDescription("Documentação da API de processamento de CSV")
    .setVersion("1.0")
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
      },
      "x-api-key",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  Logger.log(`\n\n\n🚀 CSV Processor rodando em: ${baseUrl}`);
  Logger.log(`\n\n📘 Swagger disponível em: ${baseUrl}/docs\n\n\n`);
}
bootstrap();
