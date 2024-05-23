/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 12 May 2024
 * 
 * **/

import { Injectable, ExecutionContext, CanActivate, Logger, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Session } from 'express-session';

@Injectable()
export class AzureADGuard extends AuthGuard('azure-ad') implements CanActivate {

    private readonly logger = new Logger(AzureADGuard.name);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const result = (await super.canActivate(context)) as boolean;
            await super.logIn(request);
            
            return result;
        } catch (error) {     
            this.logger.error(error);
            throw error;
        }
    }

    handleRequest<TUser = any>(error: any, user: any, info: any, context: ExecutionContext): TUser {
        try {

            const response: ExpressResponse = context.switchToHttp().getResponse();
            const request: ExpressRequest & { session: Session & { user: any } } = context.switchToHttp().getRequest();
    
            /**
             * request.session.user -> after login baru ada ada value 
             * request.user -> undefined after login, will only have value after serialized
             */
            user = request.session.user ?? request.user ?? user;
        
            // Check if response has been sent already
            if (response.headersSent) {
                return null;
            }
        
            // If error or not authenticated, redirect to /login or throw UnauthorizedException
            if (!user) {
    
                this.logger.debug("User session missing, consider it expired / unauthorized", user);
    
                //  If user are requesting for /api and unauthenticated
                if (request && request.url.includes("/api/")) {
                    // throw unauthorized error
                    throw new DefaultHttpException({
                        statusCode: HttpStatus.UNAUTHORIZED,
                        message: "User not authorized"
                    });
                }
    
                //  If user are requesting url except /api (page, html) and still unauthenticated
                if (request && !request.url.includes("/api/")) {
                    // Redirect to login page
                    response.redirect('/login?status=failed');
                }
            }
    
            if (error) {
                this.logger.error(error);
                throw new Error(error);
            }
            
            return user;

        } catch (error) {
            this.logger.error(error);
            throw new DefaultHttpException(error);
        }
    }
}