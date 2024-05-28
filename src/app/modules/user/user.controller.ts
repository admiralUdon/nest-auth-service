import { Controller, Get, Request, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ConditionalGuard } from 'app/core/decorators/conditional-guard.decorator';
import { LogService } from 'app/core/providers/log/log.service';
import { AppCode } from 'app/core/types/app.type';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { DefaultHttpResponse } from 'app/shared/custom/http-response/default.http-response';

@Controller()
@ApiTags("User")
export class UserController {

    /**
     * Constructor
     */

    constructor(
        private _logService: LogService
    ){
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    @Get()
    @ConditionalGuard()
    @ApiBearerAuth()
    @ApiSecurity("oauth2")
    @ApiOperation({ summary: "Display User", description: "Display authenticated users" })
    getUser(
        @Request() request,
        @Response() response,
    ) {
        try {

            const {iat, accessToken, ...user} = request.user ?? {};
        
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data: { user }
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;

        } catch (error) {
            throw new DefaultHttpException(error);
        }
    }
}