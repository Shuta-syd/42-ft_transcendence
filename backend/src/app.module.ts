import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}
