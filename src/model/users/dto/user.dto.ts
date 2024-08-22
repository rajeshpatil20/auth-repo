import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class UserDto extends AbstractDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()y
  /**
   * Validates that the input meets the following criteria:
   * 1. The input must be exactly 6 characters long.
   * 2. The input must contain at least 2 numeric digits.
   * 3. The input can only contain letters and digits.
   * 
   * Regex breakdown:
   * - ^: Asserts the start of the string.
   * - (?=(?:.*\d){2}): Positive lookahead to ensure there are at least 2 digits in the string.
   * - [A-Za-z\d]{6}: Matches exactly 6 characters that can be either letters (uppercase or lowercase) or digits.
   * - $: Asserts the end of the string.
   * 
   * Example valid inputs: 'abc123', '1a2b34'
   * Example invalid inputs: 'abc12', '12345', 'abcdef', '1a2b3c4'
   */
  @Matches(/^(?=(?:.*\d){2})[A-Za-z\d]{4,10}$/, {
    message: 'The input must be exactly 4 to 10 characters long and include at least 2 numbers.',
  })
  email: string;
  @Expose()
  name: string;
}