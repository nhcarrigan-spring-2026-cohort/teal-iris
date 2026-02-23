// apps/backend/src/modules/auth/guards/auth.guard.ts
import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends NestAuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
