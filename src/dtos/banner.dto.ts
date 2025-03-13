// import { BANNER_LINK_TYPE, BANNER_MODULE, BANNER_PLATFORM, BANNER_POSITION, BANNER_TYPE } from '@/enum/banner.enum';
import { BANNER_LINK_TYPE, BANNER_MODULE, BANNER_PLATFORM, BANNER_POSITION, BANNER_TYPE } from '@/enums/Banner.enum';
import { Obj } from '@/interface/common';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';

export class BannerLanguageDataDto {
    @IsNotEmpty()
    @IsString()
    public english!: string;

    @IsOptional()
    @IsString()
    public arabic?: string;
}

export class BannerImageDto {
    @IsNotEmpty()
    @IsString()
    public public_id!: string;

    @IsOptional()
    @IsString()
    public url?: string;

    @IsOptional()
    public alt_text?: BannerLanguageDataDto
}

export class CreateBannerDto {

    @IsNotEmpty()
    @IsEnum(BANNER_MODULE)
    public module!: BANNER_MODULE;

    @IsOptional()
    @IsString()
    public module_id?: string;

    @IsOptional()
    @IsEnum(BANNER_TYPE)
    public banner_type?: BANNER_TYPE;

    @IsOptional()
    @IsEnum(BANNER_POSITION)
    public position?: BANNER_POSITION;

    @IsOptional()
    @IsEnum(BANNER_PLATFORM)
    public platform?: BANNER_PLATFORM;

    @IsOptional()
    @IsEnum(BANNER_LINK_TYPE)
    public link_type?: BANNER_LINK_TYPE;

    @IsOptional()
    @IsNumber()
    public priority?: number;

    @IsOptional()
    public image?: BannerImageDto;

    @IsOptional()
    @IsString()
    public video_id?: string;

    @IsOptional()
    @IsString()
    public link?: string;    

}

export class UpdateBannerDto {
    
    @IsNotEmpty()
    @IsEnum(BANNER_MODULE)
    public module!: BANNER_MODULE;

    @IsOptional()
    @IsString()
    public module_id?: string;

    @IsOptional()
    @IsEnum(BANNER_TYPE)
    public banner_type?: BANNER_TYPE;

    @IsOptional()
    @IsEnum(BANNER_POSITION)
    public position?: BANNER_POSITION;

    @IsOptional()
    @IsEnum(BANNER_PLATFORM)
    public platform?: BANNER_PLATFORM;

    @IsOptional()
    @IsEnum(BANNER_LINK_TYPE)
    public link_type?: BANNER_LINK_TYPE;

    @IsOptional()
    @IsNumber()
    public priority?: number;

    @IsOptional()
    public image?: BannerImageDto;

    @IsOptional()
    @IsString()
    public video_id?: string;

    @IsOptional()
    @IsString()
    public link?: string;

}

export class BannerListQueryDto {
    @IsOptional()
    public filter_data?: Obj;

    @IsOptional()
    public sort_data?: Obj;
}

export class BannerCountFilterDataDto {

    @IsNotEmpty()
    public title!: string;

    @IsNotEmpty()
    public filter_data!: Obj;
}

export class BannerCountListQueryDto {
    @IsNotEmpty()
    public count_list!: BannerCountFilterDataDto[];
}

export class ModuleBannerListQueryDto {
    @IsNotEmpty()
    @IsEnum(BANNER_MODULE)
    public module!: BANNER_MODULE;

    @IsOptional()
    @IsString()
    public module_id?: string;

    @IsOptional()
    public filter_data?: Obj;

    @IsOptional()
    public sort_data?: Obj;
}

export class UpdateBannerActiveStatusDto {
    @IsNotEmpty()
    @IsBoolean()
    public is_active!: boolean;
}