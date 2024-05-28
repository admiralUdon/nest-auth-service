/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 23 May 2024
 * 
 * **/

import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Session } from 'express-session';

@Injectable()
export class JwtSessionGuard extends AuthGuard('local') implements CanActivate {

    private readonly logger = new Logger(JwtSessionGuard.name);
    private readonly jwtService = new JwtService();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug("JwtSessionGuard canActivate() called");
        try {
            const request = context.switchToHttp().getRequest<ExpressRequest>();
            // Check the session request is authenticated
            const sessionResult = request.isAuthenticated();
            // Check if jwt exists in header / cookie
            const jwtResult = !!(request.headers.authorization?.split("Bearer ")[1] || request.cookies?.accessToken);
            // Check if authentication is strict or not
            const result = (process.env.STRICT_AUTHENTICATION === "true") ? 
                                (sessionResult && jwtResult ):
                                (sessionResult || jwtResult);
            this.logger.debug(`JwtSessionGuard canActivate result: ${result}`);
                                
            return result || (await super.canActivate(context)) as boolean;
        } catch (error) {     
            this.logger.error('Error in SessionGuard canActivate:', error);
            throw error;
        }
    }

    /**
     * Explaination :-
     * handleRequest function only triggered when super.canActivate(context)) is called.
     * If you dont see this function is called in your debugging, it might due to result is true
     * meaning the request is sucessfull already
     * @param error 
     * @param user 
     * @param info this variable might send you wrong info if you trigger this function even thou 
     * request.isAuthenticated() is true. Why ? because the request is already authenticated and
     * you want this function to be called again for some reason. handleRequest should be called 
     * for login purpose only (not for guard). 
     * @param context 
     * @returns 
     */
    handleRequest<TUser = any>(error: any, user: any, info: any, context: ExecutionContext): TUser {
        this.logger.debug("JwtSessionGuard handleRequest() called");
        try {
            const response: ExpressResponse = context.switchToHttp().getResponse();
            const request: ExpressRequest & { session: Session & { user: any } } = context.switchToHttp().getRequest();

            /**
             * request.session.user -> after login baru ada ada value 
             * request.user -> undefined after login, will only have value after serialized
             */
            const accessToken = request.headers.authorization?.split("Bearer ")[1] || request.cookies?.accessToken;
            const jwtUser = accessToken ? (()=>{
                const secret = process.env.JWT_SECRET;
                const user = this.jwtService.verify(accessToken, { secret });
                return user;
            })() : null;

            user = jwtUser ?? request.session?.user ?? request.user ?? user;
        
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
    
            if (error || info) {
                this.logger.error(error || info.message);
                throw new Error(error || info.message);
            }
            
            return user;

        } catch (error) {
            this.logger.error(error);
            throw new DefaultHttpException(error);
        }
    }
}