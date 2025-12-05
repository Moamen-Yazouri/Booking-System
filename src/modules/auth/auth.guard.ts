import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type {Request} from 'express';
import { IsPublic } from "src/decorators/isPublic";
import { JwtService } from "@nestjs/jwt";
import { IJWTPayload } from "src/@types";
import { UserService } from "../user/user.service";
import { userForClient } from "src/utils/userForClient";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IsPublic, context.getHandler());
    
    if(isPublic) {
        return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if(!token) {
        throw new UnauthorizedException('No token provided');
    }
    try {
        const tokenPayload = this.jwtService.verify<IJWTPayload>(token);
        const user = await this.userService.findById(tokenPayload.sub);

        request.user = {
            user: userForClient(user),
            token
        }
        return true;
    }
    catch {
        throw new UnauthorizedException('Invalid token');
    }
     
  }
}