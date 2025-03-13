import axios from 'axios';
import { IsNotEmpty, IsString } from 'class-validator';
import { companyName, smsApiKey } from './consts';

export class SmsDataDto {
    @IsNotEmpty()
    @IsString()
    public country_code!: string;

    @IsNotEmpty()
    @IsString()
    public phone!: string;
  
    @IsNotEmpty()
    @IsString()
    public otp!: string;  
}

export function generateOtp(otp_length: number) {
  var digits = "0123456789";
  let otp = "";
  for (let i = 0; i < otp_length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export async function smsCarrierSender(smsData: SmsDataDto): Promise<{is_success: boolean, message: string, error?: any}> {
    let phoneWithCode = smsData.country_code+smsData.phone;
    let resp = { is_success: false, message: "Something went wrong!", error: {} }

    if(smsData.country_code === "91") {
        // For development testing from India
        try {
            await axios.post(`https://mail-sender.vingb.com/send-sms/${smsApiKey}/`, {
                "phone": [phoneWithCode],
                "message": `${smsData.otp} is the OTP to access \n${companyName}.\n\nPlease do not share this with anyone`,
                "sender": "OSPERB"
            })
        
        } catch (error) {
            console.log(error);
            return { ...resp, message: "SMS service errored", error }
        }
        
    } else {
        // Oman Ooredoo sms service
        // let message = `${smsData.otp} is the OTP to access Buildex Stores. Please do not share this with anyone.`
        let message = `${smsData.otp} is your OTP for Buildex Stores. Enter this code to complete your sign-up and start shopping online with us. Welcome to Buildex Stores!`
        try {
            let res = await axios.post(`https://sms.ooredoo.com.om/user/smspush.aspx?phoneno=${smsData.phone}&message=${message}&sender=BuildexOM&username=AlKhalili3&password=95970191@$SMS&source=API`)
            if(res?.status != 200) return { ...resp, message: "SMS service errored", error: res?.data }
        } catch (error) {
            console.log(error);
            return { ...resp, message: "SMS service errored", error }
        }
    }

    return {
        is_success: true,
        message: "SMS sent successfully"
    }
}