import { USER_ROLE } from '@/enums/User.enum';
import { IUser } from '@/models/main_db/User';
import { USER_SERVICE } from '@/services';
import { JWT_MODULE } from '@/utils/source';
import { RequestHandler } from 'express';

export const userAuthMiddleware = (): RequestHandler => {
    return async (req, res, next) => {
        const header = req?.header('Authorization')
        const token: string = header?.split('Bearer ')[1] as string;
        if (token) {
            let jwtData: any = await JWT_MODULE.validateToken(token)
            if(!jwtData?.id) {
                if(jwtData?.error) {
                    res.send({ status: 4001, message: `${jwtData?.error}, Access denied!`})
                    // next(`${jwtData?.error}, Access denied!`);
                }
                // next("Invalid token, Access denied!");
                res.send({ status: 4001, message: `Access denied!`})
            }
            let result = await new USER_SERVICE().findUserDetails(jwtData?.id)
            if(!result?.data){
                // next("Invalid user token, Access denied!");
                res.send({ status: 4001, message: `Access denied!`})
            }
            const user = result?.data
            if(user?.role !== USER_ROLE.USER) {
                // next("User access denied!");
                res.send({ status: 4001, message: `Access denied!`})
            }
            req.body.authUser = user
            next();
        }
        else res.send({ status: 4001, message: `Access denied!`})
        // next("Access denied!");
    };
};

export const userMiddleware = (): RequestHandler => {
    return async (req, _res, next) => {
        const header = req?.header('Authorization')
        if(header){
            const token: string = header?.split('Bearer ')[1] as string;
            if (token) {
                let jwtData: any = await JWT_MODULE.validateToken(token)
                if(!jwtData?.id) {
                    if(jwtData?.error) next();
                    // next();
                } else {
                    let result = await new USER_SERVICE().findUserDetails(jwtData?.id)
                    if(!result?.data){
                        next();
                    }
                    else {
                        const user: IUser = result.data
                        if(user.role === USER_ROLE.USER){
                            req.body.authUser = user
                        }
                        next();
                    }
                }
            } else next();
        } else next();
    };
};

export const adminAuthMiddleware = (): RequestHandler => {
    return async (req, res, next) => {
        const header = req?.header('Authorization')
        const token: string = header?.split('Bearer ')[1] as string;
        if (token) {
            let jwtData: any = await JWT_MODULE.validateToken(token)
            if(!jwtData?.id) {
                if(jwtData?.error) {
                    // next(`${jwtData?.error}, Access denied!`);
                    res.send({ status: 4001, message: `${jwtData?.error}, Access denied!`})
                }
                // next("Invalid token, Access denied!");
                else res.send({ status: 4001, message: `Access denied!`})
            }
            let result = await new USER_SERVICE().findUserDetails(jwtData?.id)
            if(!result?.data) {
                // next("Invalid user token, Access denied!");
                res.send({ status: 4001, message: `Access denied!`})
            }
            const user = result?.data
            if(user?.role !== USER_ROLE.ADMIN){ 
                // next("User access denied!");
                res.send({ status: 4001, message: `Access denied!`})
            }

            req.body.authUser = user
            next();
        }
        // else next("Access denied!");
        else res.send({ status: 4001, message: `Access denied!`})
    };
  };
  
// export default userMiddleware;