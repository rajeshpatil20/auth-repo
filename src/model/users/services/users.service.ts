import { Body, HttpStatus, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createCustomError } from 'src/common/utils/helpers';

import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from '../dto';
//import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { request } from 'http';
import { REQUEST } from '@nestjs/core';
import { LoginDto } from '../dto/login.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService
    //private readonly jwtService: JwtService
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

  async findById(id: string): Promise<CreateUserDto> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }
  async findByEmail(email: string): Promise<CreateUserDto> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async login(logindata: LoginDto) {
    console.log("logindata", logindata);
    const userExits = await this.findByEmail(logindata.email); //all data get throgh email using findbyemail method
    if (userExits) { //Check the Userexisi or Not 
      if (logindata.password == (await userExits).password) { //Also check Given password same or not in userexist database
        const token = await this.generateToken(userExits.id);
        if (!token) {
          throw new UnauthorizedException('Token is missing');
        }
        return { token: token, data: userExits }
      }
      throw new NotFoundException('password not match');
    }
    throw new NotFoundException('email not found');
  }

  async generateToken(id: string): Promise<string> {
    const payload = { sub: id };
    const secretKey = process.env.ACCES_TOKEN_SECRET_KEY; //when token generate  predefined Secret key in ENV
    const expiresIn = process.env.ACCES_TOKEN_EXPIRE_TIME;//also gave expire Time in ENV
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
