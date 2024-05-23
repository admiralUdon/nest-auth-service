import { Module } from '@nestjs/common';
import { AuthServiceModule } from 'app/core/auth/auth.module';
import { JwtServiceModule } from 'app/core/providers/jwt/jwt.module';
import { LogServiceModule } from 'app/core/providers/log/log.module';
import { AuthController } from 'app/modules/auth/auth.controller';

@Module({
    imports: [
        AuthServiceModule,
        JwtServiceModule,
        LogServiceModule
    ],
    controllers: [AuthController],
})
export class AuthModule {}