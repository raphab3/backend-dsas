import { Public } from '@modules/auth/decorators';
import { SignInDto } from '@modules/auth/dto/signin.dto';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth('JWT')
export class AuthController {
  constructor(
    private authService: AuthService,
    private meService: MeService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('me')
  async me(@Req() req: any) {
    const user = await this.meService.execute(req.user.userId);
    return user;
  }
}
