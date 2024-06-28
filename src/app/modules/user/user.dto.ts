import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Operator } from "app/core/types/operator.type";
import { DefaultHttpException } from "app/shared/custom/http-exception/default.http-exception";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, IsUUID, Matches, Min, ValidateIf } from "class-validator";

export enum UserSortByEnum {
    username        = "username",
    name            = "name",
}

export enum UserOrderByEnum {
    asc = "asc",
    desc = "desc"
}

export class CreateUserBody {
    @ApiProperty({example: "00000000-0000-0000-0000-000000000000", required: false})
    @IsOptional()
    @IsUUID()
    appId: string;

    @ApiProperty({example: "John Doe", required: false})
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({example: "john@teras.com.my", required: true})
    @IsEmail()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty({example: "StR0nGP@s$w0rD", required: true})
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateUserBody {
    
    @ApiProperty({example: "john@teras.com.my", required: false})
    @IsOptional()
    @IsEmail()
    username: string;
  
    @ApiProperty({example: "John Doe", required: false})
    @IsOptional()
    @IsString()
    name: string;
    
    @ApiProperty({example: "StR0nGP@s$w0rD", required: false})
    @IsOptional()
    @IsString()
    password: string;

    @ApiProperty({example: "image.png", required: false})
    @IsOptional()
    @IsString()
    avatar: string;
}

export class DeleteUserBody {
    @ApiProperty({example: "00000000-0000-0000-0000-000000000000"})
    appId: string;
}

export class UserQueryParam {
    @ApiProperty({example: "00000000-0000-0000-0000-000000000000", required: false})
    @IsOptional()
    @IsUUID()
    appId: string;
}

export class UsersQueryParam {

    @ApiProperty({example: "00000000-0000-0000-0000-000000000000", required: false})
    @IsOptional()
    @IsUUID()
    appId: string;
    
    @ApiProperty({example: 0, type: "number", required: false})
    @IsOptional()
    @Transform(({value}) => parseInt(value))
    @IsInt({ message: "page must be an integer" })
    @Min(0, { message: "page must be greater than or equal to 0" })
    page: number = 0;

    @ApiProperty({example: 20, type: "number", required: false})
    @IsOptional()
    @Transform(({value}) => parseInt(value))
    @IsInt({ message: "page must be an integer" })
    @Min(0, { message: "page must be greater than or equal to 0" })
    pageSize: number = 20;

    @ApiProperty({example: "", required: false})
    @IsOptional()
    // @ValidateIf((object, value) => {        
    //     if (object.filter && object.search) {
    //         throw new DefaultHttpException({ 
    //             message: "search parameter can't be used together with filter parameter. Leave one of the parameter empty", 
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: "VehicleDTO"
    //         })
    //     }
    //     return true;
    // })
    @IsString()
    search?: string;

    @ApiProperty({example: "name:eq:John", required: false})
    @IsOptional()
    // @ValidateIf((object, value) => {        
    //     if (object.search && object.filter) {
    //         throw new DefaultHttpException({ 
    //             message: "filter parameter can't be used together with search parameter. Leave one of the parameter empty", 
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             module: "UserDTO"
    //         })
    //     }
    //     return true;
    // })
    @IsString()
    @Matches(new RegExp(`(${Object.values(UserSortByEnum).join("|")}):(${Object.values(Operator).join("|")}):([^;]+)(?:;|$)`), { message: "Invalid filter/operator value" })
    @Matches(new RegExp(`(\\w+):(\\w+):([^;]+)(?:;|$)`), { message: "Invalid filter format expected: <filter-name>:<operator>:<value>" })
    filter?: string;

    @ApiProperty({example: "", enum: UserSortByEnum,  required: false})
    @IsOptional()
    @ValidateIf((object, value) => {        
        if (object.sortBy && !object.orderBy) {
            throw new DefaultHttpException({ 
                message: "sortBy parameter must be used with orderBy parameter", 
                statusCode: HttpStatus.BAD_REQUEST,
                module: "UserDTO"
            })
        }
        return true;
    })
    @IsEnum(UserSortByEnum)
    sortBy: UserSortByEnum;

    @ApiProperty({example: "", enum: UserOrderByEnum, required: false})
    @IsOptional()
    @ValidateIf((object, value) => {        
        if (!object.sortBy && object.orderBy) {
            throw new DefaultHttpException({ 
                message: "orderBy parameter must be used with sortBy parameter", 
                statusCode: HttpStatus.BAD_REQUEST,
                module: "UserDTO"
            })
        }
        return true;
    })
    @IsEnum(UserOrderByEnum)
    orderBy: UserOrderByEnum;
}

export class UsersPathParam {
    @ApiProperty({example: "john.doe@example.com", required: true})
    @IsEmail()
    @IsNotEmpty()
    username: string;
}