import { IRoutes } from "@/interface/common";

import validationMiddleware from "@/middleware/validation.middleware";
// controller handler
export const Controller = (basePath: string): ClassDecorator => (target) => {
    Reflect.defineMetadata("base_path", basePath, target);
}
// decerator handler
const deceratorHandler = (method: string) => (path: string, middlewares?: any[]) => (target: object, propertyKey: string) => {
    const parentClass = target.constructor;
    const routers: { [key: string]: IRoutes } = Reflect.hasMetadata("routers", parentClass) ? Reflect.getMetadata("routers", parentClass) : {}
    const route: IRoutes = {
        method,
        path,
        handler: propertyKey,
        middlewares: middlewares || []
    }
    routers[propertyKey] = route
    Reflect.defineMetadata("routers", routers, parentClass)
}

// get req decerator
export const Get = deceratorHandler("get")
// post req decerator
export const Post = deceratorHandler("post")
// put req decerator
export const Put = deceratorHandler("put")
// delete req decerator
export const Delete = deceratorHandler("delete")
/**
 * @description decorator for middleware functions 
 * @param args middlleware functions
 */
export function Middleware(...args: any[]) {
    return function (target: object, propertyKey: string) {
        const parentClass = target.constructor;
        let routers: { [key: string]: IRoutes } = {}
        if (Reflect.hasMetadata("routers", parentClass)) routers = Reflect.getMetadata("routers", parentClass)
        else throw new Error("Route is not defined")
        routers[propertyKey] = { ...routers[propertyKey], middlewares: args }
        Reflect.defineMetadata("routers", routers, parentClass)
    }
}
/**
 * @description decorator to for req validation
 * @param method validation functtion
 * @param doc data object, default it will take req.body
 */
export const Validate = (  type: any,value: 'body' | 'query' | 'params' = 'body',skipMissingProperties = false,whitelist = true,forbidNonWhitelisted = false,) => (target: object, propertyKey: string) => {
    const parentClass = target.constructor;
    let routers: { [key: string]: IRoutes } = {}
    if (Reflect.hasMetadata("routers", parentClass)) routers = Reflect.getMetadata("routers", parentClass)
    else throw new Error("Route is not defined")
    routers[propertyKey].middlewares.push(validationMiddleware( type,value,skipMissingProperties,whitelist,forbidNonWhitelisted ))
    Reflect.defineMetadata("routers", routers, parentClass)
}
