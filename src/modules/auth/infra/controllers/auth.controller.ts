import { SignInDto } from '@modules/auth/dto/signin.dto';
import { AuthService } from '@modules/auth/services/auth.service';
import { MeService } from '@modules/auth/services/me.service';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
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
import { Public } from '@shared/decorators';
import { Permission } from '@shared/decorators/Permission';

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
  @Permission(ListOfPermissionsEnum.auth_me)
  async me(@Req() req: any) {
    const user = await this.meService.execute(req?.user?.userId);
    return user;
  }
}
