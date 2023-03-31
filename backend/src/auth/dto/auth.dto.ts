import { IsEmail, IsNotEmpty, IsNumber, Max } from 'class-validator';
export class Msg {
  message: string;
}
export class AuthDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
export class OtpCodeDao {
  @IsNumber()
  otpcode: string;
}

export class SignUpUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Max(10)
  password?: string;
  image: string;
  isFtLogin?: boolean;
}
