import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import type { SignInDTO, SignUpDTO } from './dto/auth.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import {
  signInValidationSchema,
  signUpValidationSchema,
} from './validation/auth.validation';
import { IsPublic } from 'src/decorators/isPublic';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @IsPublic()
  @ApiOperation({ summary: 'Sign in (public)' })
  @ApiBody({ type: Object, description: 'User credentials (email + password)' })
  @ApiResponse({ status: 200, description: 'Signed in successfully, returns token + user.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  signIn(
    @Body(new ZodValidationPipe(signInValidationSchema)) userData: SignInDTO,
  ) {
    return this.authService.signIn(userData);
  }

  @Post('sign-up')
  @HttpCode(201)
  @IsPublic()
  @ApiOperation({ summary: 'Sign up (public)' })
  @ApiBody({ type: Object, description: 'User registration payload.' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  signUp(
    @Body(new ZodValidationPipe(signUpValidationSchema)) userData: SignUpDTO,
  ) {
    return this.authService.signUp(userData);
  }
}
