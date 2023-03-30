import { ApiProperty } from '@nestjs/swagger';
export class Msg {
  message: string;
}
export class AuthDto {
  password: string;
  email: string;
}
export class OtpCodeDao {
  otpcode: string;
}

export class SignUpUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  isFtLogin?: boolean;
}
