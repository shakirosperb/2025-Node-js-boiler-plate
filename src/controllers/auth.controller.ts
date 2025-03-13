import { LoginUserDto, VerifyUserOtpDto} from "@/dtos/auth.dto";
import { userAuthMiddleware } from "@/middleware/auth.middleware";
import { IUser } from "@/models/main_db/User";
import { AUTH_SERVICE } from "@/services";
import { Controller, Middleware, Post, Validate } from "@/utils/decarators";
import { Request, Response } from "express";

@Controller("/auth/user")
export default class AuthController {

    @Validate(LoginUserDto, 'body', false)
    @Post("/login")
    public async loginUser(req: Request, res: Response) {
        let loginData: LoginUserDto = req.body
        let result = await new AUTH_SERVICE().loginUser(loginData)
        return res.send(result)
    }

    @Validate(VerifyUserOtpDto, 'body', false)
    @Post("/verify-otp")
    public async verifyUserOtp(req: Request, res: Response) {
        let loginData: VerifyUserOtpDto = req.body
        let result = await new AUTH_SERVICE().verifyUserOtp(loginData)
        return res.send(result)
    }

    @Middleware(userAuthMiddleware())
    @Post("/logout")
    public async logoutUser(req: Request, res: Response) {
        let authUser: IUser = req.body.authUser
        let result = await new AUTH_SERVICE().logoutUser(authUser)
        return res.send(result)
    }

    @Post("/guest/login")
    public async loginGuestUser(_req: Request, res: Response) {
        let result = await new AUTH_SERVICE().loginGuestUser()
        return res.send(result)
    }

}