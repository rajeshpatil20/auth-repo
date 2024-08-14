import { Expose } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class UserDto extends AbstractDto {
  @Expose()
  email: string;

  @Expose()
  name: string;
}