import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from "@prisma/client";
import { TokenModule as tokenmodel } from 'src/token/token.module';

import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signupUser(
    @Body() userData: { email: string; name: string; password:string}
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Post('login')
  async loginuser(
    @Body() logindata: CreateUserDto
  ): Promise<any> {
    return this.usersService.login(logindata);
  }

  @Get()
  findAll() {
    return this.usersService.getAlldata();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
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
