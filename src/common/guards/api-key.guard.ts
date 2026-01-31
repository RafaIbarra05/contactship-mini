import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configServie: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ApiKeyHeader = req.headers['x-api-key'];
    const expectedApiKey = this.configServie.get<string>('API_KEY');

    if (!expectedApiKey) {
      throw new UnauthorizedException('Server API key is not configured');
    }
    if (!ApiKeyHeader || ApiKeyHeader !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
