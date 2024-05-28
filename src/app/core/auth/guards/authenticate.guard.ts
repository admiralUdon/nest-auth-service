/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 27 May 2024
 * 
 * **/

import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Session } from 'express-session';
import { AuthService } from '../auth.service';

/**
 * This AuthenticateGuard is mainly used for login. For conditional guard, check 
 * ConditionalGuard @ app/core/decorators/conditional-guard.decorator. This authenticate
 * guard will check basic username & password, then decide whether to serialize user
 * by using session or create a jwt token that response in api reponse body and cookies
 */
@Injectable()
export class AuthenticateGuard extends AuthGuard('local') implements CanActivate {

    private readonly logger = new Logger(AuthenticateGuard.name);
    private readonly jwtService = new JwtService();
    private readonly authService = new AuthService();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: ExpressRequest & { session: Session & { user: any } } = context.switchToHttp().getRequest();
            const response: ExpressResponse = context.switchToHttp().getResponse();
            // Extract username & password from request body
            const { username, password } = request.body;
            const validatedUser = await this.authService.validateUser(username, password);
            if (!validatedUser) {
                console.error("Not authorized");
            }
            // Create a user object
            const user = { username };
            // Decide whether to serialize user into session
            const authenticateSession = (process.env.ENABLE_SESSION === "true") ? (async () => {
                const request = context.switchToHttp().getRequest();
                const result = (await super.canActivate(context)) as boolean;
                await super.logIn(request);
                return result;
            })() : false;
            // Decide whether to create jwt token and put it in cookie
            const accessToken = (process.env.ENABLE_JWT === "true") ? (() => {
                const secret = process.env.JWT_SECRET;
                const accessToken = this.jwtService.sign(user, {secret});
                response.cookie('accessToken', accessToken, { httpOnly: true });
                // Set accessToken into request.user so that in controller, we can use the 
                // accessToken and put it in response body
                request.user = { ...user, accessToken} ;
                return accessToken;
            })() : false;
            // Check if STRICT_AUTHENTICATION were set to true in .env
            const isStrictAuth = process.env.STRICT_AUTHENTICATION === "true" ?? false;
            // Check if strict authentication condition were meet
            const isStrictAuthCondMeet = authenticateSession && !!accessToken;
            // Check if STRICT_AUTHENTICATION were set to true and strict authentication 
            // condition were meet. If it were, set user and accessToken into session
            if (isStrictAuth && isStrictAuthCondMeet) {
                const secret = process.env.JWT_SECRET;
                const accessToken = this.jwtService.sign(user, {secret});                
                request.session.user = { ...user, accessToken};
                console.log("request.session.user", request.session.user);
            }
            // Check if STRICT_AUTHENTICATION were set to true and strict authentication 
            // condition were NOT meet. If it were, (well i havent finish having thought
            // about this). Do something.
            /**
             * TODO: Do code here
             */

            const result = authenticateSession || !!accessToken;
            return result;
        } catch (error) {     
            this.logger.error(error);
            throw new DefaultHttpException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Unauthorized access",
                error
            });
        }
    }
}