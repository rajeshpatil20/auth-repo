import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "id is required" })
  id: string;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "name is required" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "password is required" })
  password: string;


}