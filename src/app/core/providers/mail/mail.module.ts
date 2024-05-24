import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'app/core/providers/mail/mail.service';
import { LogServiceModule } from 'app/core/providers/log/log.module';

@Module({
    imports: [LogServiceModule, PassportModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailServiceModule {}