
import { Model, Schema } from "mongoose"
import { MainConnection } from "@/database/mongodb"
import { BANNER_POSITION, BANNER_LINK_TYPE, BANNER_PLATFORM, BANNER_TYPE, BANNER_MODULE } from "@/enums/Banner.enum";
import banner from "./aggregators/Banner"
import { v4 as uuidv4 } from 'uuid';

const conn = MainConnection.getConn()

export interface IBanner {
    uid: string;
    banner_type: BANNER_TYPE;
    position: BANNER_POSITION;
    platform: BANNER_PLATFORM;
    link_type: BANNER_LINK_TYPE;
    priority: number;

    module: BANNER_MODULE;
    module_id: string;

    image: IBannerImage;
    video_id: string;
    link: string;

    is_active: boolean;
    is_deleted: boolean;
    created_by: string;
    updated_by: string;
}

export interface IBannerLanguageData {
    arabic: string;
    english: string;
}

export interface IBannerImage {
    public_id : string;
    url: string;
    alt_text: IBannerLanguageData;
}

export interface BannerSchemaModel extends Model<IBanner> { }

let schema = new Schema<IBanner>({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    banner_type: {
        type: String,
        enum: {
            values: Object.values(BANNER_TYPE),
        },
        default: BANNER_TYPE.IMAGE
    },
    position: {
        type: String,
        enum: {
            values: Object.values(BANNER_POSITION),
        },
        default: BANNER_POSITION.MAIN
    },
    platform: {
        type: String,
        enum: {
            values: Object.values(BANNER_PLATFORM),
        },
        default: BANNER_PLATFORM.COMMON
    },
    link_type: {
        type: String,
        enum: {
            values: Object.values(BANNER_LINK_TYPE),
        },
        default: BANNER_LINK_TYPE.INTERNAL
    },
    priority: Number,

    module: {
        type: String,
        enum: {
            values: Object.values(BANNER_MODULE)
        }
    },
    module_id: String,

    image: {
        public_id: String,
        url: String,
        alt_text: {
            arabic: {
                type: String,
                maxlength: [200, 'Max 200 characters']
            },
            english: {
                type: String,
                maxlength: [200, 'Max 200 characters']
            }
        }
    },
    video_id: String,
    link: String,

    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    created_by: String,
    updated_by: String,
},{timestamps: true})

schema.statics = banner

// export model
export default conn.model<IBanner, BannerSchemaModel>('Banner', schema, "Banner");