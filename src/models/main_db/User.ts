
import { Model, Schema } from "mongoose"
import User from "./aggregators/User"
import { MainConnection } from "@/database/mongodb"
import { USER_ROLE } from "@/enums/User.enum"
import { v4 as uuidv4 } from 'uuid';

const conn = MainConnection.getConn()

export interface IUser {
    uid: string;
    name: string;
    phone: string;
    country_code: string;
    email: string;
    password: string;
    role: USER_ROLE;
    date_of_birth: Date;
    
    loyalty_point_balance: number;
    total_loyalty_points: number;
    current_loyalty_level: string;

    current_coordinates: [number, number]
    store_radius: number;
    store_driving_distance: number;
    store_driving_duration: string;
    is_verified: boolean;
    is_guest: boolean;
    last_login_at: Date;
    token: string;
    otp: string;
    otp_expiry: Date;
    reset_password_token: string;
    reset_password_expire: Date;

    is_active: boolean;
    is_deleted: boolean;
    created_by: string;
    updated_by: string;
}

export interface PreorderSchemaModel extends Model<IUser> { }

let schema = new Schema<IUser>({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    name: { 
        type: String,
    },
    phone: { 
        type: String,
    },
    country_code: { 
        type: String,
        default: '968'
    },
    email: { 
        type: String
    },
    password: { 
        type: String,
        select: false
    },
    role: { 
        type: String, 
        enum: { 
            values: Object.values(USER_ROLE) 
        } 
    },
    date_of_birth: Date,

    loyalty_point_balance: { 
        type: Number,
        default: 0
    },
    total_loyalty_points: { 
        type: Number,
        default: 0
    },
    current_loyalty_level: String,

    current_coordinates: {
        type: [Number, Number]
    },
    store_radius: { 
        type: Number,
        default: 0
    },
    store_driving_distance: { 
        type: Number,
        default: 0
    },
    store_driving_duration: { 
        type: String
    },

    is_verified: { 
        type: Boolean,
        default: false
    },
    is_guest: { 
        type: Boolean,
        default: false
    },
    
    last_login_at: Date,
    token: String,
    otp: String,
    otp_expiry: Date,
    reset_password_token: String,
    reset_password_expire: Date,

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

schema.statics = User

// export model
export default conn.model<IUser, PreorderSchemaModel>('User', schema, "User");