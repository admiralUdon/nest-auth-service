import { Module } from '@nestjs/common';
import { AuthService } from 'app/core/auth/auth.service';
import { AzureStrategy } from './strategies/azure-ad.strategy';
import { UsernamePasswordStrategy } from './strategies/local.strategy';
import { LogServiceModule } from '../providers/log/log.module';
import { MailServiceModule } from '../providers/mail/mail.module';

@Module({
    imports: [
        MailServiceModule,
        LogServiceModule,
    ],
    providers: [
        AuthService,
        AzureStrategy,
        UsernamePasswordStrategy
    ],
    exports: [
        AuthService
    ],
})
export class AuthServiceModule {}
