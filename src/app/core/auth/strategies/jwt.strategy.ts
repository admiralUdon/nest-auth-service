/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 25 May 2024
 */

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'app/core/auth/auth.service';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    private readonly logger = new Logger(JwtStrategy.name);

    /**
     * Constructor
     */
    constructor(
        private readonly _authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request) => {
                    return (request && request.cookies) ? request.cookies['accessToken'] : null;
                },
            ]),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async validate(request: ExpressRequest, payload, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        try {
            const { username } = payload;            
            const validatedUser = await this._authService.validateJwtUser(username);
            if (!validatedUser) {
                return done(null, false, { message: 'Invalid token' });
            }
            const user = { username };
            return done(null, user);
        } catch (error) {
            this.logger.error('Error validating user', error);
            return done(error, false, { message: error.message });
        }
    }
}