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
import { OIDCStrategy, VerifyCallback, IOIDCStrategyOption } from 'passport-azure-ad';
import { AuthService } from 'app/core/auth/auth.service';
import { IProfile } from 'passport-azure-ad';

@Injectable()
export class AzureStrategy extends PassportStrategy(OIDCStrategy, 'azure-ad') {
    
    private readonly logger = new Logger(AzureStrategy.name);
    
    /**
     * Constructor
     */

    constructor(
        private _authService: AuthService
    ) {
        const config: IOIDCStrategyOption = {
            clientID: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_SECRET_KEY,
            identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: process.env.AZURE_CALLBACK_URL, // Replace with your app's redirect URI
            allowHttpForRedirectUrl: true, // Set to false in production
            scope: ['openid','profile'],
            nonceLifetime: 600,
            nonceMaxAmount: 5
        };
        super(config);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    async validate(profile: IProfile, done: VerifyCallback): Promise<void> {
        try {
            this.logger.debug("Microsoft Azure Profile", profile);
            const user = await this._authService.validateAzureADUser(profile);
            this.logger.debug("User", user);

            if (!user) {
                throw new Error('Unauthorized');
            }
            
            return done(null, user);
        } catch (error) {
            this.logger.error(error);
            return done(error, null, { message: error.message });
        }
    }
}
