import ResponseObject from "@/utils/responseObject";
import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    if (!req?.body?.Price) return res.send(new ResponseObject(2001, "Price is required"))
    return next()
}