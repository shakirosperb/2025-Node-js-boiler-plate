import { controllers } from "@/controllers"
import { Application } from "express"
import express from "express"
import { IRoutes } from "@/interface/common"
import asyncHandler from "@/utils/asyncHandler"


export default (app: Application) => {
    controllers.forEach(c => {
        const basePath = Reflect.getMetadata("base_path", c)
        const routers = Reflect.getMetadata("routers", c)
        const router = express.Router()
        Object.values(routers).forEach((r: IRoutes | any) => {
            (router as any)[r.method](r.path, r.middlewares, asyncHandler(routeHandler(c, r.handler)))
        })
        app.use(basePath, router)
    })
}


function routeHandler(c: any, h: string) {
    return (...args: any[]) => {
        let ins = new c()
        return ins[h](...args)
    }
}