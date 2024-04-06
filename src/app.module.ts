import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersController } from './application/controllers/users.controller';
import { UserModule } from './application/modules/user.module';
import { LoggerMiddleware } from './application/middleware/logger.middlewere';
import { HealthModule } from './application/modules/health.module';
import { AuthModule } from './application/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
