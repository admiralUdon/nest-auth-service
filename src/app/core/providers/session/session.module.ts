import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionService } from 'app/core/providers/session/session.service';
import { LogServiceModule } from '../log/log.module';

@Module({
    imports: [LogServiceModule, PassportModule],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionServiceModule {}