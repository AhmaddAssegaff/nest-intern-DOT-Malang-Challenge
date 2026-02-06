import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthResponse } from 'src/auth/jwt.interface';
import { blogRespone } from 'src/blog/blog.interface';

describe('Blog E2E', () => {
  let app: INestApplication;

  let accessTokenUser: string;
  let refreshTokenUser: string;

  let accessTokenAdmin: string;
  let refreshTokenAdmin: string;

  let blogId: string;

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
    it('should user login successfully and return access tokens', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/${version}/auth/login`)
        .send({
          username: 'Ahmad',
          password: 'password',
        });

      const body = res.body as AuthResponse;

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();

      accessTokenUser = body.tokens.accessToken;
      refreshTokenUser = body.tokens.refreshToken;

      expect(accessTokenUser).toBeDefined();
      expect(refreshTokenUser).toBeDefined();
    });
  });

  describe('POST /api/v1/blog', () => {
    it('should create a blog when authenticated', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/${version}/blog`)
        .set('Authorization', `Bearer ${accessTokenUser}`)
        .send({
          title: `title blog test e2e ${Date.now()}`,
          content: `content blog test e2e ${Date.now()}`,
        });
      const body = res.body as blogRespone;

      blogId = body.id;

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
    });
  });

  describe('PATCH /api/v1/blog/:id', () => {
    it('should update a blog when user authenticated', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/${version}/blog/${blogId}`)
        .set('Authorization', `Bearer ${accessTokenUser}`)
        .send({
          title: `update title blog test e2e ${Date.now()}`,
          content: `update content blog test e2e ${Date.now()}`,
        });

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('GET /api/v1/blog?page=...&limit=...', () => {
    it('should get all blog, by default get 10 blog without any params', async () => {
      const res = await request(app.getHttpServer()).get(
        `/api/${version}/blog`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('GET /api/v1/blog/:id', () => {
    it('should get a single blog by id', async () => {
      const res = await request(app.getHttpServer()).get(
        `/api/${version}/blog/${blogId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should user admin login successfully and return access tokens', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/${version}/auth/login`)
        .send({
          username: 'admin',
          password: 'password',
        });

      const body = res.body as AuthResponse;

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();

      accessTokenAdmin = body.tokens.accessToken;
      refreshTokenAdmin = body.tokens.refreshToken;

      expect(accessTokenAdmin).toBeDefined();
      expect(refreshTokenAdmin).toBeDefined();
    });
  });

  describe('DELETE /api/v1/blog/:id ', () => {
    it('should delete a blog when user admin authenticated', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/${version}/blog/${blogId}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });
});
