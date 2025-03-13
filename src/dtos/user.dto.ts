import { Obj } from '@/interface/common';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserPasswordDto {
    
    @IsNotEmpty()
    @IsString()
    public old_password!: string;

    @IsNotEmpty()
    @IsString()
    public new_password!: string;

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

export class UserListQueryDto {
    @IsOptional()
    public filter_data?: Obj;

    @IsOptional()
    public sort_data?: Obj;
}

export class UserCountFilterDataDto {

    @IsNotEmpty()
    public title!: string;

    @IsNotEmpty()
    public filter_data!: Obj;
}

export class UserCountListQueryDto {
    @IsNotEmpty()
    public count_list!: UserCountFilterDataDto[];
}

export class UpdateUserActiveStatusDto {
    @IsNotEmpty()
    @IsBoolean()
    public is_active!: boolean;
}

export class CheckUserPhoneAvailibilityDto {
    @IsNotEmpty()
    @IsBoolean()
    public phone!: boolean;
}