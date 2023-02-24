import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(AuthGuard)
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

  @PublicAccess()
  @Get(':id')
  public async findUserById(@Param('id',new ParseUUIDPipe()) id: string) {
    return await this.usersService.findUserById(id);
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDTO) {
    return await this.usersService.relationToProject(body);
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
