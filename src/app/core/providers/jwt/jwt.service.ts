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
        return this._nestJwtService.sign(payload, { secret });
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
