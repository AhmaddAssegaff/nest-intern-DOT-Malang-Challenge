import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthResponse } from 'src/auth/jwt.interface';

const versions = ['v1'];

describe.each(versions)('User E2E - login -> profile ', (version) => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

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

  it('POST /api/v1/auth/login -> success', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/${version}/auth/login`)
      .send({
        username: 'Ahmad',
        password: 'password',
      });

    const body = res.body as AuthResponse;

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();

    accessToken = body.tokens.accessToken;
    refreshToken = body.tokens.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('GET /api/user/me', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/${version}/user/me`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
