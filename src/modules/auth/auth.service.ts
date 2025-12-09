import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/user.dto';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';
import { IJWTPayload, TUserForToken } from 'src/@types';
import { JwtService } from '@nestjs/jwt';
import { userForClient } from 'src/utils/userForClient';
import { AuthResponseDTO, SignInDTO } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(userCreds: SignInDTO): Promise<AuthResponseDTO> {
    //get user by email
    const user = await this.userService.findUserByEmail(userCreds.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    //verify password
    const isPasswordValid = await this.verifyPassword(
      user.password,
      userCreds.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    //create token
    const token = this.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });
    //return user with token
    return {
      user: userForClient(user),
      token,
    };
  }

  async signUp(userData: CreateUserDTO): Promise<AuthResponseDTO> {
    //hash pass
    const hashPassword = await this.hashPassword(userData.password);
    //create user
    const user = await this.userService.create({
      ...userData,
      password: hashPassword,
    });
    // create token
    const token = this.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });
    // return user with token
    return {
      user: userForClient(user),
      token,
    };
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private verifyPassword(hash: string, password: string) {
    return argon.verify(hash, password);
  }

  private generateToken(userForToken: TUserForToken) {
    const token = this.jwtService.sign<IJWTPayload>({
      sub: userForToken.id,
      role: userForToken.role,
      email: userForToken.email,
      name: userForToken.name,
    });
    return token;
  }
}
