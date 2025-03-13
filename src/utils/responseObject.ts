import { IResponse } from "@/interface/common";

class ResponseObject implements IResponse {
    public status: number | string;
    public message?: string | undefined | null;
    public data?: any;
    public error?: any
    constructor(status: number | string, message?: string | null, data?: any, error?: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}

export default ResponseObject