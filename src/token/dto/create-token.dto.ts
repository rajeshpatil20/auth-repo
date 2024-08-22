import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}
