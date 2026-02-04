import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('Auth E2E - Register', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/auth/reqister → success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/reqister')
      .send({
        username: `e2e_user_${Date.now()}`,
        password: 'password',
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
