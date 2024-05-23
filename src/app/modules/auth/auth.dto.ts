import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordBody {
    @ApiProperty({example: "admin@example.com", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
}

export class ResetPasswordBody {
    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}

export class SignInBody {
    @ApiProperty({example: "admin", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}

export class SignInUsingTokenBody {
    @ApiProperty({example: "", required: true})
    @IsNotEmpty()
    @IsJWT()
    token: string;
}

export class SignOutBody {
    @ApiProperty({example: "", required: true})
    @IsNotEmpty()
    @IsJWT()
    token: string;
}

export class SignUpBody {
    @ApiProperty({example: "admin", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @ApiProperty({example: "name", required: true})
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}