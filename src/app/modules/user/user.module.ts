import { Module } from '@nestjs/common';
import { LogServiceModule } from 'app/core/providers/log/log.module';
import { UserController } from 'app/modules/user/user.controller';

@Module({
  imports: [LogServiceModule],
  controllers: [UserController],
})
export class UserModule {}