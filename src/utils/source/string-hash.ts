import { hashSync, genSaltSync, compare } from 'bcrypt' 
import crypto from 'crypto';

/**
 * @description Generic Hash Module
 * @author Fasil Paloli
 * @data 01-07-2024
 */
class Hashing {
    private CRYPTO_HASH_ALOGORITHM:any
    private CRYPTO_HASH_KEY: Buffer
    private CRYPTO_IV_KEY: Buffer

    constructor(){
        this.CRYPTO_HASH_ALOGORITHM = process.env.CRYPTO_HASH_ALOGORITHM
        this.CRYPTO_HASH_KEY = Buffer.from(process.env.CRYPTO_HASH_KEY || "", 'hex')
        this.CRYPTO_IV_KEY = Buffer.from(process.env.CRYPTO_IV_KEY || "", 'hex')
    }
    /**
     * @param data 
     * @returns String
     */
    public async generateHash(data:string) {
        return hashSync(data, genSaltSync(8))
    }

    /**
     * @param data 
     * @param encrypted 
     * @returns Object <string> <boolean>
     */
    public async validate(data:string, encrypted:string) {
        let resObj = false
         await compare(data, encrypted).then((result) => {
            resObj = result
         })
        return resObj
    }

    /**
     * This funcion will use Nodejs.Crypto module to Cipher with custom IV buffer key
     * @param text text which needs to be encrypted
     * @returns String encripted value
     */
    public cryptoEncrypt(text: string){
        var cipher = crypto.createCipheriv(this.CRYPTO_HASH_ALOGORITHM, this.CRYPTO_HASH_KEY, this.CRYPTO_IV_KEY)
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted = crypted + cipher.final('hex')
        return crypted
    }

    /**
     * This funcion will use Nodejs.Crypto module to Decipher with custom IV buffer key
     * @param hash Already encrypted hash
     * @returns String decrypted value | Null if error
     */
    public cryptoDecrypt(hash: string){
        try {
            var decipher = crypto.createDecipheriv(this.CRYPTO_HASH_ALOGORITHM,this.CRYPTO_HASH_KEY, this.CRYPTO_IV_KEY)
            var dec = decipher.update(hash, 'hex', 'utf8');
            dec = dec + decipher.final('utf8');
            return dec
        } catch (err) {
            return null
        }
    }
}

export default new Hashing