/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 12 May 2024
 * 
 * **/

import { Injectable } from '@nestjs/common';
import { LogService } from 'app/core/providers/log/log.service';
import { IProfile } from 'passport-azure-ad';
import { MailService } from 'app/core/providers/mail/mail.service';
import { readHTMLFile } from 'app/core/utils/html-reader.util';

@Injectable()
export class AuthService {

    /**
     * Constructor
     */

    constructor(
        private _mailService: MailService,
        private _logService: LogService
    ) {
        this._logService.registerClassName(AuthService.name)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // Implement your own logic to validate username/password
    async validateUser(username: string, password: string): Promise<any> {
        try {
            this._logService.debug("validateUser", { username, password });

            const { admin_username, superadmin_password } = { 
                admin_username: process.env.SUPERADMIN_USERNAME, 
                superadmin_password: process.env.SUPERADMIN_PASSWORD 
            } ?? {};
            
            if (
                admin_username && superadmin_password && 
                username === admin_username && 
                password === superadmin_password
            ) {
                return { username, password };
            }

            /**
             * TODO: Check DB for real user
             */
            
            throw new Error("Invalid username or password");
        } catch(error) {
            this._logService.debug(error);
            return null;
        }
    }

    // Implement your own logic to validate Azure AD user
    async validateAzureADUser(profile: IProfile): Promise<any> {
        try {
            this._logService.debug("validateAzureADUser", profile);

            /**
             * TODO: Check DB for real user
             */

            return profile;
        } catch (error) {
            this._logService.debug(error);
            return null;
        }
    }

    private readonly resetPasswordMail = readHTMLFile('reset-email.html');
    forgotPassword(username: string): void
    {
        console.log("resetPasswordMail", this.resetPasswordMail);
        
        /**
         * TODO: Check DB for real user
         */

        this._mailService.sendMail(username, "Test", this.resetPasswordMail)
    }

    resetPassword(username: string, password: string): void
    {
        /**
         * TODO: Check DB for real user
         */
    }
}
