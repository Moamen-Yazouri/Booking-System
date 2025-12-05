import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignInDTO, SignUpDTO } from './dto/auth.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { signInValidationSchema, signUpValidationSchema } from './validation/auth.validation';
import { IsPublic } from 'src/decorators/isPublic';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @IsPublic()
  signIn(@Body(new ZodValidationPipe(signInValidationSchema)) userData: SignInDTO) {
    return this.authService.signIn(userData);
  }
  @Post('sign-up')
  @HttpCode(201)
  @IsPublic()
  signUp(@Body(new ZodValidationPipe(signUpValidationSchema)) userData: SignUpDTO) {
    return this.authService.signUp(userData);
  }

}
