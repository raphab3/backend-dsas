import { SignInDto } from '@modules/auth/dto/signin.dto';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { AuthService } from '@modules/auth/services/auth.service';
import { MeService } from '@modules/auth/services/me.service';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private meService: MeService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    console.log(req.user.userId);
    const user = await this.meService.execute(req.user.userId);
    return user;
  }
}
