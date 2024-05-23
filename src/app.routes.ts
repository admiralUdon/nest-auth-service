import { Routes } from "@nestjs/core";
import { AuthModule } from "app/modules/auth/auth.module";
import { HelloModule } from "app/modules/hello/hello.module";
import { UserModule } from "app/modules/user/user.module";

export const appRoutes: Routes = [
    {
        path: 'api',
        children: [
            { path: 'hello', module: HelloModule },
            { path: 'auth', module: AuthModule },
            { path: 'user', module: UserModule },
        ],
    },
]