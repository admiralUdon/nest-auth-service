import { Module } from '@nestjs/common';
import { AuthService } from 'app/core/auth/auth.service';
import { AzureStrategy } from './strategies/azure-ad.strategy';
import { UsernamePasswordStrategy } from './strategies/local.strategy';
import { LogServiceModule } from '../providers/log/log.module';

@Module({
    imports: [
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
