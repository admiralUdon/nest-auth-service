import { Module } from '@nestjs/common';
import { AuthService } from 'app/core/auth/auth.service';
import { AzureStrategy } from 'app/core/auth/strategies/azure-ad.strategy';
import { JwtStrategy } from 'app/core/auth/strategies/jwt.strategy';
import { SessionStrategy } from 'app/core/auth/strategies/session.strategy';
import { LogServiceModule } from 'app/core/providers/log/log.module';
import { MailServiceModule } from 'app/core/providers/mail/mail.module';
import { PrismaService } from 'app/core/providers/prisma/prisma.service';

@Module({
    imports: [
        MailServiceModule,
        LogServiceModule,
    ],
    providers: [
        PrismaService,
        AuthService,
        AzureStrategy,
        SessionStrategy,
        JwtStrategy
    ],
    exports: [
        AuthService
    ],
})
export class AuthServiceModule {}
