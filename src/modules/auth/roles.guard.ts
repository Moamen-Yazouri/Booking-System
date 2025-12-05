import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/decorators/roles";
import type {Request} from 'express';
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride(Roles, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<Request>();
        const data = request.user;
        if(!data) {
            throw new UnauthorizedException('')
        }
        const hasRole = roles.includes(data.user.role);
        if(!hasRole) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        return true;
    }
}