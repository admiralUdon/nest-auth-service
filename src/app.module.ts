import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { appRoutes } from 'app.routes';
import { throttlerConfig } from 'app/config/throttler.config';
import { AuthServiceModule } from 'app/core/auth/auth.module';
import { SessionServiceModule } from 'app/core/providers/session/session.module';
import { AuthModule } from 'app/modules/auth/auth.module';
import { HelloModule } from 'app/modules/hello/hello.module';
import { UserModule } from 'app/modules/user/user.module';

@Module({
    imports: [
        // Config modules
        ConfigModule.forRoot({expandVariables: true}),
        ThrottlerModule.forRoot(throttlerConfig),
        AuthServiceModule,
        SessionServiceModule,
        // Custom modules
        HelloModule,
        AuthModule,
        UserModule,
        // Router modules
        RouterModule.register(appRoutes)
    ]
})
export class AppModule {}