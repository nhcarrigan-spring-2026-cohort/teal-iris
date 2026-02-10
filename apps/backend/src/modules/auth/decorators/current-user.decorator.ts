import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Access the authenticated user from the Request object.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
