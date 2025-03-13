import { Request, Response, NextFunction } from "express";
const req_timeout=parseInt(process.env.REQ_TIMEOUT||"60000")

class ErrorHandler{
    public static notFound404(_req:Request,res:Response, _next:NextFunction){
        res.status(404).json({
            status:4004,
            message:"Invalid call"
        })
    }
    public static errHandler(err:any,_req:Request,res:Response, _next:NextFunction){
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        res.status(err?.status||200).send({status:2001,message:err?.message||err||"error"});
    }
    public static timeOut(req: Request, res: Response, next: NextFunction) {
        req.setTimeout(req_timeout, () => {
            let err = {status:408,message:"Req timeout"}
            next(err);
        });
        res.setTimeout(req_timeout, () => {
            let err = {status:408,message:"Req timeout"}
            next(err);
        });
        next();
    }
}

export default ErrorHandler