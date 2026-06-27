import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GetUserT } from "../get-user.models";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): GetUserT => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);