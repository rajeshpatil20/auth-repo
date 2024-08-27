import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from "@prisma/client";
import { CreateUserDto } from './dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersModule } from './users.module';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201, description: 'The user has been successfully created.', type: CreateUserDto, example: {
      'application/json': {
        id: 'gdgfdyuhedjfdhdnh',
        email: 'Rajesh@gmail.com',
        name: 'Rajesh',
        password: 'Raj@123',
        createdAt: '2024-08-24T00:00:00.000Z',
        updatedAt: '2024-08-24T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signupUser(
    @Body() userData: { email: string; name: string; password: string }
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200, description: 'The user has been successfully logged in.', example: {
      'application/json': {
        accessToken: 'eyfrtgdr55dfgfhghvjhfdhfjfjdjdfffoo',
        refreshToken: 'ttrrffddcvgdgdgdcgh887dhjdgdhdsdhs'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async loginuser(
    @Body() logindata: CreateUserDto
  ): Promise<any> {
    return this.usersService.login(logindata);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findall')
  @ApiOperation({ summary: ' get all users' })
  @ApiResponse({
    status: 200, description: 'Successfully retrieved all users.', example: {
      'application/json': [
        {
          id: 'dgffjhfhdhfgy98jhj',
          email: 'Rajesh@Gmail.com',
          name: 'Rajesh',
          password: 'Raj@123',
          createdAt: '2024-08-24T00:00:00.000Z',
          updatedAt: '2024-08-24T00:00:00.000Z'
        }, {
          id: 'hfdhdydsgsdjhhdcnhbcd',
          email: 'Pritam@Gmail.com',
          name: 'Pritam',
          password: 'Pritam@123',
          createdAt: '2024-08-24T00:00:00.000Z',
          updatedAt: '2024-08-24T00:00:00.000Z'
        },
        {
          id: '69732c1a-ffbd-4d4f-86db-a93289741fd9',
          email: 'Vishu@Gmail.com',
          name: 'vishu',
          password: 'Vi12dd',
          createdAt: '2024-08-24T00:00:00.000Z',
          updatedAt: '2024-08-24T00:00:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.usersService.getAlldata();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The user ID' })
  @ApiResponse({
    status: 200, description: 'Successfully get the user.', type: UsersModule, example: {
      'application/json': {
        id: '"d38e6799-ba2f-42b2-b20f-dfab18e4a27e"',
        email: 'sushan@gmail.com.com',
        name: 'sushant',
        password: 'sushant@555',
        createdAt: '2024-08-24T00:00:00.000Z',
        updatedAt: '2024-08-24T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The user ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200, description: 'Successfully updated the user.', type: UpdateUserDto, example: {
      'application/json': {
        id: '969297a6-f171-4a9e-b943-622f7f025885',
        email: 'Marry@gmail.com',
        name: 'Marry',
        password: 'Marry@111',
        createdAt: '2024-08-21T11:56:52.883Z',
        updatedAt: '2024-08-24T11:21:50.866Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The user ID' })
  @ApiResponse({
    status: 200, description: 'Successfully deleted the user.', example: {
      'application/json': {
        id: '969297a6-f171-4a9e-b943-622f7f025885',
        email: 'Marry@gmail.com',
        name: 'Marry',
        password: 'Marry@111',
        createdAt: '2024-08-21T11:56:52.883Z',
        updatedAt: '2024-08-24T11:21:50.866Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
