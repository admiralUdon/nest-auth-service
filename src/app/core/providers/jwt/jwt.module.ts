import { Module } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from 'app/core/providers/jwt/jwt.service';
import { LogServiceModule } from 'app/core/providers/log/log.module';

@Module({
    imports: [LogServiceModule, PassportModule],
    providers: [JwtService, NestJwtService],
    exports: [JwtService],
})
export class JwtServiceModule {}