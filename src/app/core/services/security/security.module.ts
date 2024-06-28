import { Module } from '@nestjs/common';
import { SecurityService } from 'app/core/services/security/security.service';

@Module({
    providers: [
        SecurityService
    ],
    exports: [SecurityService],
})
export class SecurityServiceModule {}