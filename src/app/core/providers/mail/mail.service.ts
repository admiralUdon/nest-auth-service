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
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;
    private transporterOptions;

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

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: this.transporterOptions.user,
            to,
            subject,
            text,
        };
    
        await this.transporter.sendMail(mailOptions);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private async initialiseTransport() {
        try {
            this.transporterOptions = transportConfig();
            this.transporter = nodemailer.createTransport(this.transporterOptions);
            this.logger.debug(`SMTP connection transport successfully initialized`);
        } catch (error) {
            this.logger.error(`Failed to initialize SMTP connection transport: ${error}`);
        }
    }
}
