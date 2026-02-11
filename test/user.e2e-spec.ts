import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthResponseDto } from 'src/auth/jwt.interface';

describe('User E2E', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  const version = 'v1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(`api/${version}`);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully and return access tokens', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/${version}/auth/login`)
        .send({
          username: 'user test',
          password: 'password',
        });

      const body = res.body as AuthResponseDto;

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();

      accessToken = body.tokens.accessToken;
      refreshToken = body.tokens.refreshToken;

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
  });

  describe('GET /api/v1/user/me', () => {
    it('should return user profile when authenticated', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/${version}/user/me`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });
});
