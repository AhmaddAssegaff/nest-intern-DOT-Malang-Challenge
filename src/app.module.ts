import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { configurationModule } from './configurationModule.module';

@Module({
  imports: [BlogModule, DatabaseModule, configurationModule],
})
export class AppModule {}
