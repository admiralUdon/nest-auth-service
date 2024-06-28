/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 12 May 2024
 * 
 **/

import { Injectable, Logger } from '@nestjs/common';
import { IProfile } from 'passport-azure-ad';
import { MailService } from 'app/core/providers/mail/mail.service';
import { readHTMLFile } from 'app/core/utils/html-reader.util';
import { PrismaService } from 'app/core/providers/prisma/prisma.service';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    private readonly mailService = new MailService();
    private readonly prismaService = new PrismaService();

    /**
     * Constructor
     */

    constructor(
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // Implement your own logic to validate username/password
    async validateUser(username: string, password: string): Promise<any> {
        try {
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
            const user = await this.prismaService.user.findUnique({ where: { username }});
            if (!user) {
                throw new Error("User does not exists");
            }

            if (user.password !== password) {
                throw new Error("Invalid username or password");
            }
            
            return user;
        } catch(error) {
            this.logger.error(error);
            throw new Error(error);
        }
    }

    // Implement your own logic to validate JWT user
    async validateJwtUser(profile: IProfile): Promise<any> {
        try {
            this.logger.debug("validateJwtUser", profile);

            /**
             * TODO: Check DB for real user
             */

            return profile;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    // Implement your own logic to validate Azure AD user
    async validateAzureADUser(profile: IProfile): Promise<any> {
        try {
            this.logger.debug("validateAzureADUser", profile);

            /**
             * TODO: Check DB for real user
             */

            return profile;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    private readonly resetPasswordMail = readHTMLFile('reset-email.html');
    forgotPassword(username: string): void
    {        
        /**
         * TODO: 
         * - Check DB for real user
         * - Cache request to avoid spam (use redis provider)
         */

        const user = { name: "User", username };
        const token = "abc12345";

        const passwordResetLink = `https://www.teras.dev/reset-password?token=${token}`;
        const supportLink = `https://www.teras.dev/support`;
        const mail = this.resetPasswordMail
                        .replace("__NAME__", user.name)
                        .replace("__PASSWORD_RESET_LINK__", passwordResetLink)
                        .replace("__SUPPORT_LINK__", supportLink);

        this.mailService.sendMail(username, "Reset your password", mail);
    }

    resetPassword(token: string, password: string): void
    {
        /**
         * TODO: Check DB for real user
         */
    }
}