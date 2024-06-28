import { Module } from '@nestjs/common';
import { PrismaService } from 'app/core/providers/prisma/prisma.service';
import { UserService } from 'app/core/services/user/user.service';

@Module({
    providers: [
        UserService,
        PrismaService
    ],
    exports: [UserService],
})
export class UserServiceModule {}