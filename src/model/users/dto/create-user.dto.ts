import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "id is required" })
  id: string;

  @IsEmail()
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @IsNotEmpty({ message: "name is required" })
  name: string;
  
  @IsNotEmpty({ message: "password is required" })
  password: string;


}