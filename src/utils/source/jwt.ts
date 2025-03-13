//import { hashSync, genSaltSync, compare } from 'bcrypt' 
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'
import { JWT_TOEKN } from '@interface/common'
import { Hashing } from '@utils/source/index'

/**
 * @description Json Web Token Module
 * @author Fasil Paloli
 * @data 01-07-2024
 */
class JWT_MODULE {
    private JWT_SECRET:any
    private JWT_TOKEN_EXPIRY_MIN: number

    constructor(){
        this.JWT_SECRET = process.env.JWT_SECRET
        this.JWT_TOKEN_EXPIRY_MIN = parseInt(process.env.JWT_TOKEN_EXPIRY_MIN || "")
    }
    /**
     * This module will generate JWT token
     * @param data
     * @returns JWT Token
     */
    public generateToken<TOKEN_TYPE>(data:TOKEN_TYPE) {
        try {            
            let _data:any = data // override type
            let token = jsonwebtoken.sign(_data, this.JWT_SECRET, { expiresIn: this.JWT_TOKEN_EXPIRY_MIN * 60 });
            return token
        } catch (error) {
            console.log("JWT generate error: ", error)
            return null
        }
        
    }
    /**
     * Validate JWT Token using the provided secret
     * @param TOKEN 
     * @returns boolean True | False
     */
    public validateToken(TOKEN:string){
        try {
            let tokenData = jsonwebtoken.verify(TOKEN, this.JWT_SECRET);
            return tokenData
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return { error: "Token has expired" };
            }
            console.log("JWT validate error: ", error)
            return null
        }
    }
    /**
     * Geneate Auth token by hashing JWS response to bycrypt hash
     * @param jwtTokenObj 
     * @returns String bycrypt Hash <Token> | Null
     */
    public generateAuthToken(jwtTokenObj:JWT_TOEKN){
        let TOKEN = this.generateToken<JWT_TOEKN>(jwtTokenObj)
        if(TOKEN){
            return Hashing.cryptoEncrypt(TOKEN)
        }else{
            return null
        }
    }
}

export default new JWT_MODULE