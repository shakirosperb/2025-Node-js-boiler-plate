import { AxiosResponse } from 'axios'

/**
 * @description Axios Success Reponse
 * @param response 
 * @returns Object { RESPONSE_DATA, STATUS_CODE }
 * @author Fasil Paloli
 * @data 01-07-2024
 */
export function AXIOS_SUCCESS_RESPONSE(response:AxiosResponse){
    if(response.status==200){
        return { status:1000, data:response.data, http_status:response.status }
    }else{
        return { status:1001, data:null, http_status:response.status }
    }
}

/**
 * @description Axios Error Response
 * @param err 
 * @returns Object { ERROR_MESSAGE, STATUS_CODE }
 * @author Fasil Paloli
 * @data 01-07-2024
 */
export function AXIOS_ERROR_RESPONSE(err:any){
    if(err){
        return { status:1001, data:err.message, http_status:err.status || 501 }
    }else{
        return { status:1001, data:'Invalid url', http_status:501 }
    }
}