import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { ConfigSchema } from 'src/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;
  private readonly dbHost: string;
  private readonly dbPort: number;
  private readonly dbUser: string;
  private readonly dbPassword: string;
  private readonly dbName: string;

  constructor(private readonly config: ConfigService<ConfigSchema>) {
    const databaseConfig =
      this.config.getOrThrow<ConfigSchema['database']>('database');

    this.dbHost = databaseConfig.DB_HOST;
    this.dbPort = databaseConfig.DB_PORT;
    this.dbUser = databaseConfig.DB_USER;
    this.dbPassword = databaseConfig.DB_PASSWORD;
    this.dbName = databaseConfig.DB_NAME;
  }

  async onModuleInit() {
    try {
      this.pool = new Pool({
        host: this.dbHost,
        port: this.dbPort,
        user: this.dbUser,
        password: this.dbPassword,
        database: this.dbName,
        max: 20,
        connectionTimeoutMillis: 5000,
      });

      const client = await this.pool.connect();
      client.release();

      Logger.log(
        `PostgreSQL connected → ${this.dbHost}:${this.dbPort}/${this.dbName}`,
      );
    } catch (error) {
      Logger.error('Failed to connect PostgreSQL', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
    Logger.fatal('PostgreSQL pool has been closed');
  }

  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(sql, params);
  }
}
