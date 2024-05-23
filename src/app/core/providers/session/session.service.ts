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
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionService extends PassportSerializer {

    private readonly logger = new Logger(SessionService.name);

    constructor(
    ) {
        super();
    }


    serializeUser(user: any, done: (err: Error, user: any) => void): void  {
        try {
            this.logger.debug("serializeUser", user);
            if (!user) {
                throw new Error ("Missing user, user not being serialized");
            }
            return done(null, user);
        } catch (error) {
            this.logger.debug(error);
            return done(null, {});
        }
    }

    deserializeUser(user: any, done: (err: Error, user: any) => void): void {
        try {
            this.logger.debug("deserializeUser", user);
            if (!user) {
                throw new Error ("Unknown user, user not being deserialized");
            }
            return done(null, user);
        } catch (error) {
            this.logger.debug(error);
            return done(null, {});
        }
    }
}