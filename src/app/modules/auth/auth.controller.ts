import { Body, Controller, HttpStatus, Post, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'app/core/auth/auth.service';
import { ConditionalGuard } from 'app/core/decorators/conditional-guard.decorator';
import { JwtService } from 'app/core/providers/jwt/jwt.service';
import { LogService } from 'app/core/providers/log/log.service';
import { AppCode } from 'app/core/types/app.type';
import { ForgotPasswordBody, ResetPasswordBody, SignInBody, SignInUsingTokenBody, SignOutBody, SignUpBody } from 'app/modules/auth/auth.dto';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { DefaultHttpResponse } from 'app/shared/custom/http-response/default.http-response';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags("Auth")
@Controller()
export class AuthController {

    /**
     * Constructor
     */

    constructor(
        private _authService: AuthService,
        private _jwtService: JwtService,
        private _logService: LogService
    ){
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    @Post("forgot-password")
    @ApiOperation({ 
        summary: "Forgot Password", 
        description: "Initiate the process to reset a user's password by sending a reset link to their email." 
    })
    async forgotPassword(
        @Request() request,
        @Response() response,
        @Body() body: ForgotPasswordBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(ForgotPasswordBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }

            const { username } = bodyObject;
            this._authService.forgotPassword(username);
            
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data: {
                    message: `An email has been sent to ${username} with password reset instructions. Please check your inbox.`
                }
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }

    @Post("reset-password")
    @ApiOperation({ 
        summary: "Reset Password", 
        description: "Reset the user's password using a token received in their email." 
    })
    async resetPassword(
        @Request() request,
        @Response() response,
        @Body() body: ResetPasswordBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(ResetPasswordBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }

            const { password, token } = bodyObject;

            /**
             * TODO:
             * - check token with redis to ensure correct username
             * - query user with the username
             */

            const username = "john.doe@example.com";

            this._authService.resetPassword(token, password);
            
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data: {
                    message: `Password for user ${username} has been successfully reset. You can now log in with your new password. If you encounter any issues, please contact our support team.`
                }
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }

    @Post("sign-in")
    @ConditionalGuard("login")
    @ApiOperation({ 
        summary: "Sign In", 
        description: "Authenticate a user using their email and password." 
    })
    async signIn(
        @Request() request,
        @Response() response,
        @Body() body: SignInBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(SignInBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                });
            }

            const { accessToken } = request.user;
            const data = { accessToken };

            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }

    @Post("sign-in-with-token")
    @ConditionalGuard("login")
    @ApiOperation({ 
        summary: "Sign In with Token", 
        description: "Renew the login token and provide a new accessToken with a new expiry." 
    })
    async signInUsingToken(
        @Request() request,
        @Response() response,
        @Body() body: SignInUsingTokenBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(SignInUsingTokenBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }

            const { accessToken } = request.user;
            const data = { accessToken };
            
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }
    
    @Post("sign-out")
    @ApiOperation({ 
        summary: "Sign Out", 
        description: "Sign out the user and invalidate their session." 
    })
    async signOut(
        @Request() request,
        @Response() response,
        @Body() body: SignOutBody
    ) {
        try {
            // Validate and transform the body parameters
            const bodyObject = plainToClass(SignOutBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }

            // Log user out
            request.logout((error) => {
                if (error) {
                    throw new Error(error);
                }
                request.session.destroy((error) => {
                    if (error) {
                        throw new Error(error);
                    }
                });
                response.clearCookie('connect.sid', { path: '/' });
            });

            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }

    @Post("sign-up")
    @ApiOperation({ 
        summary: "Sign Up", 
        description: "Register a new user account." 
    })
    async signUp(
        @Request() request,
        @Response() response,
        @Body() body: SignUpBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(SignInUsingTokenBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }

            /**
             * TODO: handle user registration
             */
            
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }

    @Post("unlock-session")
    @ApiOperation({ 
        summary: "Unlock Session", 
        description: "Unlock a user's session, typically after a timeout or temporary lock." 
    })
    async unlockSession(
        @Request() request,
        @Response() response,
        @Body() body: SignInBody
    ) {
        try { 
            // Validate and transform the body parameters
            const bodyObject = plainToClass(SignInBody, body);
            const errors = await validate(bodyObject);

            if (errors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(errors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: AuthController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: errors
                })
            }
            
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status, 
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
        } catch(error) {
            throw new DefaultHttpException(error);
        }
    }
}