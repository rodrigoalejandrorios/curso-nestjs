import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserDTO, UserUpdateDTO } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  public async registerUser(@Body() body: UserDTO) {
    return await this.usersService.createUser(body);
  }

  @Get('all')
  public async findAllUsers() {
    return await this.usersService.findUsers();
  }

  @Get(':id')
  public async findUserById(@Param('id',new ParseUUIDPipe()) id: string) {
    return await this.usersService.findUserById(id);
  }

  @Put('edit/:id')
  public async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UserUpdateDTO,
  ) {
    return await this.usersService.updateUser(body, id);
  }

  @Delete('delete/:id')
  public async deleteUser(@Param('id',new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
