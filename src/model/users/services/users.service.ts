import { Body, HttpStatus, Injectable, NotFoundException, Post } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createCustomError } from 'src/common/utils/helpers';

import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from '../dto';
//import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService
    // private readonly jwtService: JwtService
  ) { }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const createUser = await this.prisma.user.create({  //for creating user 
        data,
      });
      return {
        statusCode: HttpStatus.CREATED, //check http status created when message user create success otherwise createcustomerror call
        message: "User created successfully",
        data: createUser,
      } as any;
    } catch (e) {
      throw createCustomError(
        e.message || "Something went wrong",
        e.status || HttpStatus.BAD_REQUEST,
      );
    }
  }


  async getAlldata(skip: number = 0, take: number = 10): Promise<any> {
    try {
      const users = await this.prisma.user.findMany({
        skip,
        take,
      });

      return {
        statusCode: HttpStatus.OK,
        message: " all data retrieved successfully",
        data: users,
      };
    } catch (error) {
      console.error("Error retrieving users:", error);

      const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.message || "An unexpected error occurred";

      throw createCustomError(message, statusCode);
    }
  }

  async getUserparticulardata(id: string): Promise<any> {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }
      const user = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: "User get Particular successfully",
        data: user,
      };
    } catch (error) {
      console.error("Error retrieving user by ID:", error);
      const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.message || "An unexpected error occurred";

      throw createCustomError(message, statusCode);
    }
  }


  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<any> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },//where clause compare to id = id 
        data,
      });

      return {
        statusCode: HttpStatus.OK,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (e) {
      throw createCustomError(
        e.message || "Something went wrong",
        e.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: "User deleted successfully",
        data: deletedUser,
      };
    } catch (e) {
      throw createCustomError(
        e.message || "Something went wrong",
        e.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: string):Promise<CreateUserDto> {
    return this.prisma.user.findUnique({ where: { id:id } });
  }
  // async findByEmail(email: string): Promise<CreateUserDto> {
  //   return this.prisma.user.findUnique({ where: { email: email } });
  // }

  async login(logindata: CreateUserDto) {
    console.log("logindata", logindata);
    
    const userExits = await this.findById(logindata.id);
    // const userId = await this.findByEmail(logindata);
    if (userExits) {
      if (logindata.password == (await userExits).password) {
        const token = await this.generateToken(userExits.id);
        const query = "INSERT INTO Token (token, userid) VALUES (token,logindata.id)";
        
      
        return { token: token, data: userExits }
      }
      throw new NotFoundException('password not match');
    }
    throw new NotFoundException('email not found');
  }

  async generateToken(id: string): Promise<string> {
    const payload = { sub: id };
    const secretKey = process.env.ACCES_TOKEN_SECRET_KEY;
    const expiresIn = process.env.ACCES_TOKEN_EXPIRE_TIME;
    return await sign(payload, secretKey, { expiresIn });
  }
  
  // async validateToken(token: string): Promise<any> {
  //   try {
  //     return verify(token);
  //   } catch (e) {
  //     return null;
  //   }
  // }
  async saveToken(token: string, userid: string): Promise<void> {
    await this.prisma.token.create({
      data: {
        token,
        userid
      },
    });
  }
  
}
