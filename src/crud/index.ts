import { MONGO_DB_NAMES } from '@/database/mongodb'
import { DB_MODELS } from '@/enums/common.enum'
import { IResponse } from '@/interface/common'
import * as MAIN_DB from '@/models/main_db'

const MODEL_OBJ: MONGO_DB_NAMES = {
    'MAIN_DB': MAIN_DB,
}
interface Obj {
    [key: string]: any
}

export default class CrudHelper<TResponse = any> {
    private model: DB_MODELS;

    constructor(model: DB_MODELS){
        this.model = model;
    }
   
    /**
    * @description CREATE
    */
    /**
     * 
    //  * @param c connection name 
     * @param m model name
     * @param d data object
     * @returns object
     */
    protected async create(d: object | object[]): Promise<IResponse<TResponse>> {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].create(d)
            return { data: result }
        } catch (error: any) {
            let message=error.message ||"something went wrong"
            if(error?.code==11000&&error?.keyPattern) message=`${Object.keys(error.keyPattern)[0]} already exist`
            return { status: 1001, message }
        }
    }
    
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param p params object
     * @returns object
     */
    protected async save(p: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await new MODEL_OBJ['MAIN_DB'][this.model](p).save()
            return { data: result }
        } catch (error: any) {
            console.log(error);
            
            let message=error.message ||"something went wrong"
            if(error?.code==11000&&error?.keyPattern) message=`${Object.keys(error.keyPattern)[0]} already exist`
            return { status: 1001, message }
        }
    }
    
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param p params object
     * @returns object
     */
    protected async insert(p: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].collection.insert(p)
            return { data: result }
        } catch (error: any) {
            let message=error.message ||"something went wrong"
            if(error?.code==11000&&error?.keyPattern) message=`${Object.keys(error.keyPattern)[0]} already exist`
            return { status: 1001, message }
        }
    }
        /**
     * 
     * @param c connection name 
     * @param m model name
     * @param p params object
     * @returns object
     */
    protected async insertMany(p: Obj[]): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].insertMany(p)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
    /**
    * @description READ
    */
    /**
    * 
    * @param c connection name 
    * @param m model name
    * @param q query object
    * @param s select object
    * @returns object
    */
    protected async find(q: object, s?: any): Promise<IResponse<TResponse[]>> {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].find(q, s)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
        /**
    * 
    * @param c connection name 
    * @param m model name
    * @param q query object
    * @param s select object
    * @returns object
    */
    protected async findOne(q: object, s?: any): Promise<IResponse<TResponse>> {
        try {            
            let result = await MODEL_OBJ['MAIN_DB'][this.model].findOne(q, s)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
    /**
    * 
    * @param c connection name 
    * @param m model name
    * @param a aggregator string
    * @param f filter object
    * @param o options object
    * @param p params object
    * @returns object
    */
    protected async aggregate(a: string, f?: Obj, p?: Obj, o?: Obj): Promise<IResponse<TResponse[]>> {
        console.log({a,f,p,o});
        try {
            let agg = (MODEL_OBJ['MAIN_DB'] as any)[this.model][a](f || {}, p || {}, o || {})
            console.log({agg});
            
            let result = await MODEL_OBJ['MAIN_DB'][this.model].aggregate(agg)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
   //---UPDATE
   /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @param u update object
     * @returns object
     */
    protected async update(f: Obj, u: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].update(f, u, { upsert: true, new: true, runValidators: true })
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @param u update object
     * @returns object
     */
    protected async updateOne(f: Obj, u: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].findOneAndUpdate(f, u, { upsert: true, new: true, runValidators: true })            
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @param u update object
     * @returns object
     */
    protected async updateNotCreate(f: Obj, u: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].findOneAndUpdate(f, u, { upsert: false, new: true, runValidators: true })
            return { data: result }
        } catch (error: any) {
            let message=error.message ||"something went wrong"
            if(error?.code==11000&&error?.keyPattern) message=`${Object.keys(error.keyPattern)[0]} already exist`
            return { status: 1001, message }
        }
    }
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @param u update object
     * @returns object
     */
    protected async updateMany(f: Obj, u: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].updateMany(f, u)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }

    //---DELETE
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @returns object
     */
    protected async deleteOne(f: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].findOneAndDelete(f)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
    /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @returns object
     */
    protected async deleteMany(f: Obj): Promise<IResponse<TResponse>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].deleteMany(f)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }
        /**
     * 
     * @param c connection name 
     * @param m model name
     * @param f filter object
     * @returns object
     */
    protected async count(f: Obj): Promise<IResponse<number>>  {
        try {
            let result = await MODEL_OBJ['MAIN_DB'][this.model].countDocuments(f)
            return { data: result }
        } catch (error: any) {
            return { status: 1001, message: error.message || "something went wrong" }
        }
    }

}
