import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers["x-api-key"];

    const validApiKey = this.configService.get<string>("API_KEY");

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException("API key inválida ou ausente");
    }

    return true;
  }
}
