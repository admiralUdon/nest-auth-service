import { UseGuards } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthenticateGuard } from 'app/core/auth/guards/authenticate.guard';
import { JwtSessionGuard } from 'app/core/auth/guards/jwt-session.guard';
import { JwtGuard } from 'app/core/auth/guards/jwt.guard';
import { SessionGuard } from 'app/core/auth/guards/session.guard';

dotenv.config();
export function ConditionalGuard(action?: 'login') {
    if (
        process.env.STRICT_AUTHENTICATION === "true" &&
        (
            process.env.ENABLE_SESSION !== 'true' || 
            process.env.ENABLE_JWT !== 'true'
        )
    ) {
        throw new Error("Use of STRICT_AUTHENTICATION require BOTH authentication method (ENABLE_SESSION, ENABLE_JWT) to be true");
    }

    if (action === "login") {
        console.log("AuthenticateGuard Applied");
        return UseGuards(AuthenticateGuard);
    }

    if (process.env.ENABLE_SESSION === 'true' && process.env.ENABLE_JWT === 'true') {
        console.log("JwtSessionGuard Applied");
        return UseGuards(JwtSessionGuard);
    }

    if (process.env.ENABLE_SESSION === 'true') {
        console.log("SessionGuard Applied");
        return UseGuards(SessionGuard);
    }
    
    if (process.env.ENABLE_JWT === 'true') {
        console.log("JwtGuard Applied");
        return UseGuards(JwtGuard);
    }
    
    throw new Error("Need to enable at least ONE authentication method (ENABLE_SESSION, ENABLE_JWT)");
}