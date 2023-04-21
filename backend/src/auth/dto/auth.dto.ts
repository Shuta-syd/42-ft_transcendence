import {
  IsBase64,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
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
  @IsNumberString()
  otpcode: string;
}

export class SignUpUserDto {
  @IsNotEmpty()
  @MinLength(1)
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}$/)
  password?: string;
  image?: string;
  isFtLogin?: boolean;
}

export class FtUpdateUserDto {
  @IsString()
  name: string;
  @IsString()
  @IsBase64()
  image: string;
}
