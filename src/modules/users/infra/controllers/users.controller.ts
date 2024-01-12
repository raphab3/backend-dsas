import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { CreateUsersService } from '@modules/users/services/create.users.service';
import { FindAllUsersService } from '@modules/users/services/findAll.users.service';
import { FindOneUsersService } from '@modules/users/services/findOne.users.service';
import { RemoveUsersService } from '@modules/users/services/remove.users.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { UpdateUsersService } from '@modules/users/services/update.users.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Catch,
  HttpException,
  Req,
} from '@nestjs/common';

@Catch(HttpException)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUsersService: CreateUsersService,
    private readonly findAllUsersService: FindAllUsersService,
    private readonly findOneUsersService: FindOneUsersService,
    private readonly updateUsersService: UpdateUsersService,
    private readonly removeUsersService: RemoveUsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUsersService.execute(createUserDto);

    return user;
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  findOne(@Param('id') id: string) {
    return this.findOneUsersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUsersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeUsersService.remove(id);
  }
}
