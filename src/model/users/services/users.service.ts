import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createCustomError } from 'src/common/utils/helpers';

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const createUser = await this.prisma.user.create({
        data,
      });
      return {
        statusCode: HttpStatus.CREATED,
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
        where: { id: id },
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
}
