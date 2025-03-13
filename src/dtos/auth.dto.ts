import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    public country_code!: string;

    @IsNotEmpty()
    @IsString()
    public phone!: string;
}

export class VerifyUserOtpDto {
    @IsNotEmpty()
    @IsString()
    public user!: string;

    @IsNotEmpty()
    @IsString()
    public otp!: string;
}

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    public phone!: string;

    @IsNotEmpty()
    @IsString()
    public country_code?: string;

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public email?: string;

}

export class UpdateUserDto {
    
    @IsNotEmpty()
    @IsString()
    public phone!: string;

    @IsNotEmpty()
    @IsString()
    public country_code?: string;

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public email?: string;

}