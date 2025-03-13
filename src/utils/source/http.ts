import axios, { AxiosInstance } from 'axios'
import { AXIOS_SUCCESS_RESPONSE, AXIOS_ERROR_RESPONSE } from '@utils/source'

interface QueryParams {
    [key: string]: string | undefined;
}

/**
 * @description Axios API Service Module
 * @author Fahid Mohammad
 * @data 01-07-2024
 * @TODO Need to Improve Typing and Error Hanlding
 * @TODO Need to add interceptor for autherisation
 */
class ApiService {
    private axiosInstance: AxiosInstance

    constructor(){
        // Instantiate Axios Intance 
        this.axiosInstance = axios.create({
            baseURL: 'https://boilerplateapi.free.beeceptor.com',
            timeout: 15000,
            headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Credentials": true,
                "X-Requested-With": "XMLHttpRequest",
             }
        });

        // Handle Generic Error 
        this.axiosInstance.interceptors.response.use(
            (response) => { 
                return AXIOS_SUCCESS_RESPONSE(response) 
            },
            (err) => {
                return Promise.reject(AXIOS_ERROR_RESPONSE(err))
            }
        )
    }
    
    /**
     * @param endpoint 
     * @param headers 
     * @param queryParams 
     * @returns Object
     */
    public async get(endpoint: string, headers?: any,queryParams?: QueryParams){
        return this.axiosInstance.get(endpoint, {
            headers: headers,
            params: queryParams
        })
        .then((response) => { return response })
        .catch((err)=> { return err })
    }

    /**
     * @param endpoint 
     * @param headers 
     * @param data 
     * @returns Object
     */
    public async post(endpoint: string, headers?: any, data: any = {}){
        return this.axiosInstance.post(endpoint, {
            headers: headers,
            data: data
        })
        .then((response) => { return response })
        .catch((err)=> { return err })
    }

}

export default new ApiService