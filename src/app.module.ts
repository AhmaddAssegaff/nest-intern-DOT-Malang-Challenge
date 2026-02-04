import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configurationModule.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    BlogModule,
    DatabaseModule,
    ConfigurationModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
