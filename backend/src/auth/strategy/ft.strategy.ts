import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get('FTAPI_UID'),
      clientSecret: config.get('FTAPI_SECRET'),
      callbackURL: 'http://localhost:8080/auth/login/42/callback',
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const image = await this.authService.convertToBase64(
      profile._json.image.link,
    );
    const user = {
      name: profile.username,
      email: profile._json.email,
      image,
    };

    return this.authService.validateUser(user);
  }
}
