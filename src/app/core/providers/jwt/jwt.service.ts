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
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {

    private readonly logger = new Logger(JwtService.name);
    private readonly expiresIn = process.env.JWT_EXPIRES_IN;
    private readonly notBefore = process.env.JWT_EXPIRES_IN;

    /**
     * Constructor
     */

    constructor(
        private readonly _nestJwtService: NestJwtService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    generateJwtToken(payload: any, secret: string): string {
        const { expiresIn, notBefore } = {
            expiresIn: this.expiresIn,
            notBefore: this.notBefore
        };
        return this._nestJwtService.sign(payload, { secret, expiresIn, notBefore });
    }

    verifyJwtToken<T>(token: string, secret: string): Promise<T> {
        try {
            return this._nestJwtService.verify(token, { secret });
        } catch (error) {
            this.logger.error(error);
            // Token is invalid or expired
            return null;
        }
    }
}
