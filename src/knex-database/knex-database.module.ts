import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'postgres',
          connection: process.env.DATABASE_URL,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class KnexDatabaseModule {}
