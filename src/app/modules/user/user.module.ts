import { Module } from '@nestjs/common';
import { LogServiceModule } from 'app/core/providers/log/log.module';
import { SecurityServiceModule } from 'app/core/services/security/security.module';
import { UserServiceModule } from 'app/core/services/user/user.module';
import { UserController } from 'app/modules/user/user.controller';

@Module({
  imports: [UserServiceModule, SecurityServiceModule, LogServiceModule],
  controllers: [UserController],
})
export class UserModule {}