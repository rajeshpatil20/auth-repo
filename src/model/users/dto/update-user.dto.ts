
import { PartialType } from "@nestjs/mapped-types";
import { IsDefined, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly id: string;
}
