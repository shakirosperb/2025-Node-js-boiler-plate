
import { Model, Schema } from "mongoose"
import { MainConnection } from "@/database/mongodb"
import File from "./aggregators/File"
import { v4 as uuidv4 } from 'uuid';
import { FILE_EXTENSION, FILE_TYPE } from "@/enums/File.enum";

const conn = MainConnection.getConn()

export interface IFile {
    uid: string;
    public_id: string;
    url: string;

    name: string;
    size: number;
    path: string;
    type: FILE_TYPE;
    extension: FILE_EXTENSION;
    tags: Array<string>;

    is_varient: boolean;
    master_file: string;
    variation: IVariation;
    uploader: string;
    
    is_active: boolean;
    is_deleted: boolean;
    created_by: string;
    updated_by: string;
}

export interface IVariation {
    width: number;
    height: number;
    quality: number;
}

export interface FileSchemaModel extends Model<IFile> { }

let schema = new Schema<IFile>({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    public_id: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true,
    },
    name: String,
    size: {
        type: Number,
        default: 0
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(FILE_TYPE),
        index: true,
    },
    extension: {
        type: String,
        enum: Object.values(FILE_EXTENSION),
        index: true,
    },
    tags: [
        {
          type: String,
        }
    ],
    
    is_varient: {
        type: Boolean,
        default: false
    },
    master_file: String,
    variation: {
        width: Number,
        height: Number,
        quality: Number,
    },
    
    uploader:{
        type: String,
        index: true,
    },

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

schema.statics = File

// export model
export default conn.model<IFile, FileSchemaModel>('File', schema, "File");