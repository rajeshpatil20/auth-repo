import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from "@prisma/client";
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signupUser(
    @Body() userData: { email: string; name: string },
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Get()
  findAll() {
    return this.usersService.getAlldata();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserparticulardata(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
