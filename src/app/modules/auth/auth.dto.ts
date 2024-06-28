import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordBody {
    @ApiProperty({example: "john.doe@example.com", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
}

export class ResetPasswordBody {
    @ApiProperty({example: "token", required: true})
    @IsNotEmpty()
    token: string;

    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}

export class SignInBody {
    @ApiProperty({example: "john.doe@example.com", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}

export class SignInUsingTokenBody {
    @ApiProperty({example: "eyJhbGciOiJIUzI1NiIs...OYVpa7idDakZlqZO7N0", required: true})
    @IsNotEmpty()
    @IsJWT()
    accessToken: string;
}

export class SignOutBody {
    @ApiProperty({example: "", required: true})
    @IsNotEmpty()
    @IsJWT()
    token: string;
}

export class SignUpBody {
    @ApiProperty({example: "john.doe@example.com", required: true})
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @ApiProperty({example: "John Doe", required: true})
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({example: "password", required: true})
    @IsNotEmpty()
    password: string;
}