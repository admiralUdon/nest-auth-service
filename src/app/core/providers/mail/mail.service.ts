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
import { transportConfig } from 'app/config/mail.config';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {

    private readonly logger = new Logger(MailService.name);
    private transporter: Transporter;
    private transporterOptions: any;

    /**
     * Constructor
     */

    constructor(
    ) {
        this.initialiseTransport();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async sendMail(to: string, subject: string, html: string) {
        const from = this.transporterOptions.auth.user;
        const mailOptions: SendMailOptions = {
            from,
            to,
            subject,
            html,
        };
        // this.logger.debug("mailOptions", mailOptions);
        await this.transporter.sendMail(mailOptions);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private async initialiseTransport() {
        try {
            this.transporterOptions = transportConfig();
            console.log("this.transporterOptions", this.transporterOptions);
            
            this.transporter = createTransport(this.transporterOptions);
            this.logger.debug(`SMTP connection transport successfully initialized`);
        } catch (error) {
            this.logger.error(`Failed to initialize SMTP connection transport: ${error}`);
        }
    }
}
