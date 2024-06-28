import { Body, Controller, Delete, Get, HttpStatus, Param, Put, Query, Request, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ConditionalGuard } from 'app/core/decorators/conditional-guard.decorator';
import { LogService } from 'app/core/providers/log/log.service';
import { AppCode } from 'app/core/types/app.type';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { DefaultHttpResponse } from 'app/shared/custom/http-response/default.http-response';
import { UpdateUserBody, UserQueryParam, UsersPathParam, UsersQueryParam } from 'app/modules/user/user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserService } from 'app/core/services/user/user.service';
import { SecurityService } from 'app/core/services/security/security.service';

@Controller()
@ApiTags("User")
export class UserController {

    /**
     * Constructor
     */

    constructor(
        private _userService: UserService,
        private _securityService: SecurityService,
        private _logService: LogService
    ){
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // @Get("list")
    // @ConditionalGuard()
    // @ApiBearerAuth()
    // @ApiSecurity("oauth2")
    // @ApiOperation({ summary: "Get users list", description: "API endpoint that allows clients to retrieve user information from the system. It provides access to user profiles and associated data, such as username, email, and user ID" })
    // async getUsers(
    //     @Request() request,
    //     @Response() response,
    //     @Query() query: UsersQueryParam
    // ) {
        
    //     try {
            
    //         // Validate and transform the query parameters
    //         const queryObject = plainToClass(UsersQueryParam, query);
    //         const errors = await validate(queryObject);
    
    //         if (errors.length > 0){
    //             const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
    //             const constraints = await getContraints(errors[0]);
    //             throw new DefaultHttpException({
    //                 message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
    //                 statusCode: HttpStatus.BAD_REQUEST,
    //                 module: UserController.name,
    //                 code: "INVALID_REQUEST",
    //                 // additionalMessage: errors
    //             })
    //         }
        
    //         // Query request
    //         const { appId: reqAppId, page, pageSize, sortBy, orderBy, search } = queryObject;
    
    //         // Get username from current JWT token
    //         const { username: sessionUsername } = request.user;
    
    //         // Absent of appId in request query mean user is requesting for all user data
    //         // Only superadmin have the authority to do so
    //         const appId = reqAppId ?? "00000000-0000-0000-0000-000000000000";
    
    //         const isSuperAdmin = await this._securityService.validateSuperAdmin({username: sessionUsername, appId});
    //         if (!isSuperAdmin) {
    //             throw new DefaultHttpException({
    //                 message: "Resource not authorized",
    //                 statusCode: HttpStatus.FORBIDDEN,
    //                 module: UserController.name,
    //                 code: "USER_FORBIDDEN",
    //                 // additionalMessage: errors
    //             })
    //         }

    //         const skip = page * pageSize;
    //         // Absent of appId in request query mean user is requesting for all user data
    //         // Only superadmin have the authority to do so
    //         const { users, totalCount: length } = await this._userService.users({
    //             appId: reqAppId ?? null,
    //             skip,
    //             take: pageSize,
    //             search,
    //             sortBy,
    //             orderBy,
    //         });

    //         const pagination = {
    //             length,
    //             pageSize,
    //             page,
    //             lastPage: Math.ceil(length/pageSize),
    //             startIndex: skip,
    //             endIndex: (page + pageSize - 1),
    //         }

    //         // Remove password from data
    //         const data = users.map(item => {
    //             const { password, ...result } = item;
    //             return result;
    //         });

    //         // Return in response
    //         const result = new DefaultHttpResponse({
    //             code: "OK",
    //             message: "API call successfull",
    //             statusCode: HttpStatus.OK,
    //             data: [...data],
    //             pagination
    //         });
    //         response.status(result.statusCode);
    //         response.json(result);
    //         return response;
            
    //     } catch (error) {
    //         throw new DefaultHttpException(error);
    //     }
    // }
    
    @Get(":username")
    @ConditionalGuard()
    @ApiBearerAuth()
    @ApiSecurity("oauth2")
    @ApiOperation({ summary: "Get user information", description: "API endpoint allows clients to update existing users profiles. Users can submit data to modify their user information, such as changing their username, email, or password" })
    async getUser(
        @Request() request,
        @Response() response,
        @Param() param: UsersPathParam,
    ) {
                
        try {
            
            // Validate and transform the path parameters
            const paramObject = plainToClass(UsersPathParam, param);
            const pathErrors = await validate(paramObject);
    
            if (pathErrors.length > 0){
                const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
                const constraints = await getContraints(pathErrors[0]);
                throw new DefaultHttpException({
                    message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
                    statusCode: HttpStatus.BAD_REQUEST,
                    module: UserController.name,
                    code: "INVALID_REQUEST",
                    // additionalMessage: pathErrors
                })
            }

            // Get username from request 
            const { username: reqUsername } = paramObject;
        
            // Get username from current JWT token
            const { username: sessionUsername } = request.user;

            // Check if requested username is same as session username
            const isSameUsername = sessionUsername === reqUsername;
            
            // Get user from the database
            const user = await this._userService.user({ username: reqUsername });

            // Check if the session user is an admin
            const isAdminUser = await this._userService.checkUserRole(sessionUsername, "admin");
            
            // If user request for other username and not an admin, throw forbidden error
            if (!isSameUsername && !isAdminUser) {
                throw new DefaultHttpException({
                    message: "Insuffient role access",
                    statusCode: HttpStatus.FORBIDDEN
                })
            }

            // Return in response
            const result = new DefaultHttpResponse({
                code: "OK",
                message: "API call successfull",
                statusCode: HttpStatus.OK,
                data: { user }
            });
            response.status(result.statusCode);
            response.json(result);
            return response;

        } catch (error) {
            throw new DefaultHttpException(error);
        }
    }

    // @Put(":userId")
    // @ConditionalGuard()
    // @ApiBearerAuth()
    // @ApiSecurity("oauth2")
    // @ApiOperation({ summary: "Update user", description: "API endpoint allows clients to update existing user profiles. Users can submit data to modify their user information, such as changing their username, email, or password" })
    // async editUser(
    //     @Request() request,
    //     @Response() response,
    //     @Param() param: UsersPathParam,
    //     @Body() body: UpdateUserBody
    // ) {
        
    //     // Validate and transform the path parameters
    //     const paramObject = plainToClass(UsersPathParam, param);
    //     const pathErrors = await validate(paramObject);

    //     if (pathErrors.length > 0){
    //         const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
    //         const constraints = await getContraints(pathErrors[0]);
    //         throw new DefaultHttpException({
    //             message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: UserController.name,
    //             code: "INVALID_REQUEST",
    //             // additionalMessage: pathErrors
    //         });
    //     }

    //     // Validate and transform the body parameters
    //     const bodyObject = plainToClass(UpdateUserBody, body);
    //     const bodyErrors = await validate(bodyObject);

    //     if (bodyErrors.length > 0){
    //         const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
    //         const constraints = await getContraints(bodyErrors[0]);
    //         throw new DefaultHttpException({
    //             message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: UserController.name,
    //             code: "INVALID_REQUEST",
    //             // additionalMessage: bodyErrors
    //         });
    //     }

    //     try {

    //         // Get username from current JWT token
    //         const { username: sessionUsername } = request.user;
    
    //         // Only superadmin of auth frontdoor able to update user info
    //         const appId = "00000000-0000-0000-0000-000000000000";
    
    //         const isSuperAdmin = await this._securityService.validateSuperAdmin({username: sessionUsername, appId});
    //         if (!isSuperAdmin) {
    //             throw new DefaultHttpException({
    //                 message: "Resource not authorized",
    //                 statusCode: HttpStatus.FORBIDDEN,
    //                 module: UserController.name,
    //                 code: "USER_FORBIDDEN",
    //                 // additionalMessage: errors
    //             })
    //         }
            
    //         const { username, name, password, avatar } = bodyObject;
    //         const updatedAt = new Date();
            
    //         const { userId } = paramObject;
    //         const user = await this._userService.user({id: userId});
    //         if (!user) {
    //             throw new Error("User provisioned not exists");
    //         }

    //         const existingUserName = await this._userService.user({username});
    //         if (existingUserName) {
    //             throw new Error("Username already taken");
    //         }

    //         const updatedUser = await this._userService.updateUser({
    //             where: { id: userId },
    //             data: { username, name, password, avatar, updatedAt }
    //         });

    //         const { password:dbPassword , ...data} = updatedUser;

    //         // Return in response
    //         const result = new DefaultHttpResponse({
    //             code: "USER_UPDATED",
    //             message: "API provisioned successfull",
    //             statusCode: HttpStatus.ACCEPTED,
    //             data: { ...data }
    //         });
    //         response.status(result.statusCode);
    //         response.json(result);
    //         return response;

    //     } catch (error) {
    //         throw new DefaultHttpException(error);
    //     }
    // }

    // @Delete(":userId")
    // @ApiBearerAuth()
    // @ApiSecurity("oauth2")
    // @ApiOperation({ summary: "Delete user", description: "API endpoint allows clients to delete user accounts from the system. Users can send a request to delete their accounts, which will remove their profile and associated data" })
    // async deleteUser(
    //     @Request() request, 
    //     @Response() response,
    //     @Param() param: UsersPathParam
    // ) {
    //     // Validate and transform the path parameters
    //     const paramObject = plainToClass(UsersPathParam, param);
    //     const errors = await validate(paramObject);

    //     if (errors.length > 0){
    //         const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
    //         const constraints = await getContraints(errors[0]);
    //         throw new DefaultHttpException({
    //             message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: UserController.name,
    //             code: "INVALID_REQUEST",
    //             // additionalMessage: errors
    //         })
    //     }
        
    //     try {

    //         // Get username from current JWT token
    //         const { username: sessionUsername } = request.user;
    
    //         // Only superadmin of auth frontdoor able to delete user info
    //         const appId = "00000000-0000-0000-0000-000000000000";
    
    //         const isSuperAdmin = await this._securityService.validateSuperAdmin({username: sessionUsername, appId});
    //         if (!isSuperAdmin) {
    //             throw new DefaultHttpException({
    //                 message: "Resource not authorized",
    //                 statusCode: HttpStatus.FORBIDDEN,
    //                 module: UserController.name,
    //                 code: "USER_FORBIDDEN",
    //                 // additionalMessage: errors
    //             })
    //         }
            
    //         const { userId } = paramObject;
    //         const user = await this._userService.user({id: userId});
    //         if (!user) {
    //             throw new Error("User does not exists");
    //         }

    //         const deletedUser = await this._userService.deleteUser({id: userId});
    //         const { password, ...data } = deletedUser;
            
    //         // Return in response
    //         const result = new DefaultHttpResponse({
    //             code: "USER_DELETED",
    //             message: "API provisioned successfull",
    //             statusCode: HttpStatus.ACCEPTED,
    //             data: { ...data }
    //         });
    //         response.status(result.statusCode);
    //         response.json(result);
    //         return response;

    //     } catch (error) {
    //         throw new DefaultHttpException(error);
    //     }
    // }

    // @Post()
    // @ApiBearerAuth()
    // @ApiSecurity("oauth2")
    // @ApiOperation({ summary: "Create user", description: "API endpoint allows clients to create new user accounts in the system. Clients can submit user registration data, such as username, email, and password, to create a new user profile" })
    // @ApiBody({type: CreateUserBody})
    // @UseGuards(JwtGuard)
    // async createUser(
    //     @Request() request,
    //     @Response() response,
    //     @Body() body: CreateUserBody
    // ) 
    // {
    //     // Validate and transform the body parameters
    //     const bodyObject = plainToClass(CreateUserBody, body);
    //     const errors = await validate(bodyObject);

    //     if (errors.length > 0){
    //         const getContraints = (error) => { return error.children?.length ? getContraints(error.children[0]) : error.constraints };
    //         const constraints = await getContraints(errors[0]);
    //         throw new DefaultHttpException({
    //             message: constraints[Object.keys(constraints)[0]] ?? "Validation error",
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: UserController.name,
    //             code: "INVALID_REQUEST",
    //             // additionalMessage: errors
    //         });
    //     }

    //     try {

    //         // User that will be created
    //         const { appId:reqAppId, username, name, password } = bodyObject;
    //         const createdAt = new Date();
    
    //         // Get username from current JWT token
    //         const { username: sessionUsername } = request.user;
    
    //         // Absent of appId in request query mean user is requesting for all user data
    //         // Only superadmin have the authority to do so
    //         const appId = reqAppId ?? "00000000-0000-0000-0000-000000000000";
    
    //         const isSuperAdmin = await this._securityService.validateSuperAdmin({username: sessionUsername, appId});
    //         if (!isSuperAdmin) {
    //             throw new DefaultHttpException({
    //                 message: "Resource not authorized",
    //                 statusCode: HttpStatus.FORBIDDEN,
    //                 module: UserController.name,
    //                 code: "USER_FORBIDDEN",
    //                 // additionalMessage: errors
    //             });
    //         }

    //         const existingUser = await this._userService.user({username});
    //         if (existingUser) {
    //             throw new Error("User already exists");
    //         }

    //         const existingApp = await this._applicationService.application({id: appId});
    //         if (!existingApp) {
    //             throw new Error("AppId does not exists")
    //         }
            
    //         const user = await this._userService.createUser({
    //             username, 
    //             name, 
    //             password,
    //             // Create new role since user still doesn't exists
    //             role: {
    //                 create: {
    //                     tag: "Default.User.ALL",
    //                     title: `${existingApp.name} Default User`,
    //                     // Connect to existing app since app must be exists
    //                     app: {
    //                         connect: {
    //                             id: existingApp.id
    //                         }
    //                     },
    //                     createdAt
    //                 }
    //             },
    //             createdAt
    //         });

    //         // Remove password from data
    //         const { password:dbPassword, ...data } = user;
            
    //         // Return in response
    //         const result = new DefaultHttpResponse({
    //             code: "USER_CREATED",
    //             message: "API provisioned successfull",
    //             statusCode: HttpStatus.CREATED,
    //             data: { ...data },
    //         });
    //         response.status(result.statusCode);
    //         response.json(result);
    //         return response;

    //     } catch (error) {
    //         throw new DefaultHttpException(error);
    //     }
    // }
}