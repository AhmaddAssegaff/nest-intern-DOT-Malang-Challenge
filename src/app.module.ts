import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BlogModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
