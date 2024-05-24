import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'app/core/providers/mail/mail.service';

@Module({
    imports: [PassportModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailServiceModule {}