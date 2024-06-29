/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 12 May 2024
 */

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'app/core/auth/auth.service';
import { IVerifyOptions, Strategy } from 'passport-local';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'local') {

    private readonly logger = new Logger(SessionStrategy.name);

    /**
     * Constructor
     */

    constructor(
        private _authService: AuthService,
    ) {
        super({
            usernameField: "username",
            passwordField: "password",
            session: true,
            passReqToCallback: true
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async validate(request, username: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void ): Promise<void> {
        try {
            const { accessToken } = request.user ?? {};               
            const user = await this._authService.validateUser(username, password);
            if (!user) {
                throw new Error("Invalid username or password");
            }
            return done(null, {accessToken, ...user});
        } catch (error) {
            this.logger.error(error);
            return done(error, null, { message: error.message });
        }
    }
}