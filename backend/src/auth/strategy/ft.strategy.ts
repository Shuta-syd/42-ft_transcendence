import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {
    super({
      clientID: config.get('FTAPI_UID'),
      clientSecret: config.get('FTAPI_SECRET'),
      callbackURL: 'http://localhost:8080/auth/login/42/callback',
      scope: ['public'],
    });
  }

  async convertToBase64(imageUrl: string): Promise<string> {
    const response = await this.httpService
      .get(imageUrl, { responseType: 'arraybuffer' })
      .toPromise();
    return Buffer.from(response.data, 'binary').toString('base64');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const image = await this.convertToBase64(profile._json.image.link);
    const user = {
      name: profile.username,
      email: profile._json.email,
      image,
    };

    return this.authService.validateUser(user);
  }
}
