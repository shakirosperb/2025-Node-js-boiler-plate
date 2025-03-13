import { UpdateUserDto, UpdateUserPasswordDto } from "@/dtos/user.dto";
import { userAuthMiddleware } from "@/middleware/auth.middleware";
import { IUser } from "@/models/main_db/User";
import { USER_SERVICE } from "@/services";
import { Controller, Get, Middleware, Post, Put, Validate } from "@/utils/decarators";
import { Request, Response } from "express";

@Controller("/user")
export default class UserController {

    @Middleware(userAuthMiddleware())
    @Get("/me")
    public async userDetailsByToken(req: Request, res: Response) {
        let user: IUser = req.body.authUser
        let result =await new USER_SERVICE().findUserDetails(user.uid)
        return res.send(result)
    }

    @Validate(UpdateUserDto, 'body', false)
    @Middleware(userAuthMiddleware())
    @Put("/update")
    public async updateUserDetailsByToken(req: Request, res: Response) {
        let user: IUser = req.body.authUser
        let userData: UpdateUserDto = req.body
        let result =await new USER_SERVICE().updateUserDetailsByToken(user.uid,userData)
        return res.send(result)
    }

    @Validate(UpdateUserPasswordDto, 'body', false)
    @Middleware(userAuthMiddleware())
    @Post("/password/update")
    public async updateUserPasswordByToken(req: Request, res: Response) {
        let user: IUser = req.body.authUser
        let userData: UpdateUserPasswordDto = req.body
        let result =await new USER_SERVICE().updateUserPasswordByToken(user.uid, userData)
        return res.send(result)
    }

}