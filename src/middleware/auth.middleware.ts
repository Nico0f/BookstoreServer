import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareService } from './auth.service.middleware';
import { CustomRequest } from './types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private middlewareService: MiddlewareService) {}

  use(request: CustomRequest, response: Response, next: NextFunction) {
    return this.middlewareService.validate(request, response, next);
    // next();
  }
}
