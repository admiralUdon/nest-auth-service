/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 12 May 2024
 * 
 * **/

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'app/core/auth/auth.service';
import { IVerifyOptions, Strategy } from 'passport-local';

@Injectable()
export class UsernamePasswordStrategy extends PassportStrategy(Strategy, 'local') {

    private readonly logger = new Logger(UsernamePasswordStrategy.name);

    /**
     * Constructor
     */

    constructor(
        private _authService: AuthService,
    ) {
        super();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async validate(username: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void ): Promise<void> {
        try {
            this.logger.debug("Username & Password", { username, password });
            const validateUser = await this._authService.validateUser(username, password);
            this.logger.debug("Validate User", validateUser);

            if (!validateUser) {
                throw new Error("Invalid username or password");
            }

            const { password: userPassword, ...user } = validateUser;

            return done(null, user);
        } catch (error) {
            this.logger.error(error);
            return done(error, null, { message: error.message });
        }
    }
}