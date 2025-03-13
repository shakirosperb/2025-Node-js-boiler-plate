import { IResponse } from "@/interface/common";
import ResponseObject from "@/utils/responseObject";
import { UpdateUserDto, UpdateUserPasswordDto } from "@/dtos/user.dto";
import bcrypt from "bcryptjs";
import CrudHelper from "@/crud";
import { DB_MODELS } from "@/enums/common.enum";
import { IUser } from "@/models/main_db/User";

export default class User extends CrudHelper {
    constructor(){super(DB_MODELS.USER)}

    public async updateUserDetailsByToken(userId: string, userInputData: UpdateUserDto): Promise<IResponse<IUser>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let filter = { uid: userId };
        
        let result = await this.findOne(filter)
        if (!result?.data) return { ...resp, status: 2001, message: "User doesn't exist with this id." }
        const user: IUser = result?.data
        
        user.country_code = userInputData?.country_code ?? user?.country_code;
        user.email = userInputData?.email ?? user?.email;
        user.name = userInputData?.name ?? user?.name;

        let updatedUser = await this.updateOne({uid: userId}, {...user})
        if (!updatedUser?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedUser?.message }

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedUser || {}
        return resp
    }

    public async updateUserPasswordByToken(userId: string, userInputData: UpdateUserPasswordDto): Promise<IResponse<IUser>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let filter = { uid: userId };
        
        let result = await this.findOne(filter)
        if (!result?.data) return { ...resp, status: 2001, message: "User doesn't exist with this id." }
        const user: IUser = result?.data

        let isPasswordMatched = await bcrypt.compare(userInputData?.old_password, user?.password);
        if (!isPasswordMatched) return { ...resp, message: "Password doesn't match!" }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash( userInputData?.new_password, salt );
        user.password = password

        let updatedUser = await this.updateOne({uid: userId}, {...user})
        if (!updatedUser?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedUser?.message }

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedUser || {}
        return resp
    }

    public async findUserDetails(userId: string): Promise<IResponse<IUser>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let filter = { uid: userId };
        
        let result = await this.aggregate("single", filter)    
        if (!result?.data || result?.data?.length === 0) return { ...resp, status: 2001, message: "User doesn't exist with this id." }
        const user: IUser = result?.data[0]

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = user || {}
        return resp
    }

    public async updateUserNameFromOrder(userId: string, name: string): Promise<any> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let filter = { uid: userId };
        
        let result = await this.findOne(filter)
        if (!result?.data) return
        let user: IUser = result?.data
        if(!user?.name && name){
            user.name = name ?? user?.name;
        }
        
        let updatedUser = await this.updateOne({uid: userId}, {...user})
        if (!updatedUser?.data) return

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedUser || {}
        return resp
    }

}