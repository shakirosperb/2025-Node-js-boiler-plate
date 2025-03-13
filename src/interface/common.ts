
export interface IResponse <Type=any> {
    status?: number | string
    data?: Type
    message?: string | undefined | null;
    error?: any
}
export interface IObj {
    [key: string]: any
}
export interface JWT_TOEKN {
    ID: string
    EMAIL_ADDRESS: string
    ACCESS_TOKEN: string
    GENDER: string
    ROLE_TYPE?: any
}

export interface Obj {
    [key: string]: any
}
export interface IRoutes {
    method: string
    path: string
    handler: string
    middlewares: any[]
}
// rabbitmq header
export interface IDelayedHeader extends Obj{
    "x-delay":number
}


export interface Create {
    collection: string
    model: string
    params: Obj
}
export interface Read {
    collection: string
    model: string
    filter?: Obj
    select?: Obj | string
}
export interface Aggregate {
    collection: string
    model: string
    aggregator?: string
    filter?: Obj
    options?: Obj
    params?: Obj
    projections?: Obj|string
}
export interface Update {
    collection: string
    model: string
    params:{
        f:Obj
        u:Obj
    }
}
export interface Delete {
    collection: string
    model: string
    filter: Obj
}
export interface Count {
    collection: string
    model: string
    filter?: Obj
}
export interface Response {
    status: string | number
    message?: string
    data?: any
    error?: any
}