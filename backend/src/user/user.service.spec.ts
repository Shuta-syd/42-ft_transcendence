import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  //  テスト実行前、テストデータ準備
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    console.log('💫 seed executing ...');

    await prismaService.user.create({
      data: {
        id: 1,
        email: 'one@example.com',
        name: 'one',
        password: 'password',
      },
    });

    console.log('💫 seed finished.');
  });

  it('getUserById', async () => {
    const expected = {
      id: 1,
      email: 'one@example.com',
      name: 'one',
      password: 'password',
    };

    const actual = await userService.getUserById(1);

    expect(expected).toEqual(actual);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.$disconnect();
  });
});
