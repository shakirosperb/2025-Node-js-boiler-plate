import { IResponse, Obj } from "@/interface/common";
import ResponseObject from "@/utils/responseObject";
import { BannerCountListQueryDto, BannerListQueryDto, CreateBannerDto, UpdateBannerActiveStatusDto, UpdateBannerDto } from "@/dtos/banner.dto";
import { IBanner } from "@/models/main_db/banner";
import { BANNER_MODULE } from "@/enums/Banner.enum";
import { DB_MODELS } from "@/enums/common.enum";
import CrudHelper from "@/crud";

export default class Banner extends CrudHelper<IBanner> {
    constructor(){super(DB_MODELS.BANNER)} //banner model

    public async createBanner(bannerInputData: CreateBannerDto): Promise<IResponse<IBanner>> {
        let resp = new ResponseObject(2001, "Something went wrong")

        let {is_error, message, bannerData} = await this.checkBannerData(bannerInputData)
        if(is_error) return { ...resp, status: 2001, message}

        let banner = await this.create(bannerData)
        if (!banner?.data) 
            return { ...resp, status: 2001, message: "Something went wrong", error: banner?.message }
        
        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = banner?.data || {}
        return resp
    }

    public async updateBanner(bannerId: string, bannerInputData: UpdateBannerDto): Promise<IResponse<IBanner>> {
        let resp = new ResponseObject(2001, "Something went wrong")
       
        let findBannerData = await this.findOne({uid: bannerId})        
        if(!findBannerData?.data) return { ...resp, status: 2001, message: "banner doesn't exist with this id." }

        let {is_error, message, bannerData} = await this.checkBannerData(bannerInputData, findBannerData?.data)
        if(is_error) return { ...resp, status: 2001, message}

        let updatedBanner = await this.updateOne({uid: bannerId},bannerData)
        if (!updatedBanner?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedBanner?.message }
        
        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedBanner?.data || {}
        return resp
    }
    
    public async findAllBanners(page: number, limit: number, _query: any, data: BannerListQueryDto): Promise<IResponse<{ banners:IBanner[], total: number, page: number}>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let queryData: Obj = { is_active: true, is_deleted: false }
        let sort: Obj = {createdAt : -1}     
        if(data?.filter_data && Object.values(data?.filter_data)?.length > 0){
            queryData = {...data?.filter_data}
        }  
        if(data?.sort_data && Object.values(data?.sort_data)?.length > 0){
            sort = {...data?.sort_data}
        }

        let bannerResult = await this.aggregate("basic", queryData, { skip:(page-1)*limit, limit, sort })
        
        if (!bannerResult?.data) return {...resp, message: `DB Central: ${bannerResult?.message}`}
        let countResult = await this.count(queryData)

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = {
            banners: bannerResult?.data || {},
            total: countResult?.data || 0,
            page: page || 1
        }
        return resp
    }

    public async findAllBannerCounts(_query: any, data: BannerCountListQueryDto): Promise<IResponse<any>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        // let queryData: Obj = {}
        let count_list: Obj = {}  
        
        let options: Obj[] = [
            {
                $facet: {
                    ...data.count_list.reduce((acc, countItem) => ({
                        ...acc,
                        [countItem.title]: [
                            { $match: countItem.filter_data },
                            { $count: 'count' }
                        ]
                    }), {})
                }
            }
        ]

        let countResults = await this.aggregate("thrust", {}, {}, options)
        if (!countResults?.data) return resp

        for (const countItem of data.count_list) {
            let data: Obj = countResults?.data[0]
            count_list[countItem.title] = data[countItem.title][0]?.count ?? 0;
        }   

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = count_list
        return resp
    }

    public async findBannerDetails(bannerId: string): Promise<IResponse<IBanner>> {
        let resp = new ResponseObject(2001, "Something went wrong")
        let filter = { uid: bannerId };
        
        let result = await this.aggregate("single", filter)        
        if (!result?.data || result?.data?.length === 0) return { ...resp, status: 2001, message: "Banner doesn't exist with this id." }
        const banner: IBanner = result?.data[0]

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = banner || {}
        return resp
    }

    public async updateBannerStatus(bannerId: string, statusData: UpdateBannerActiveStatusDto): Promise<IResponse> {
        let resp = new ResponseObject(2001, "Something went wrong")

        let findBannerData = await this.findOne({uid: bannerId})
        if(!findBannerData?.data) return { ...resp, status: 2001, message: "banner doesn't exist with this id." }

        let banner: IBanner = findBannerData?.data as IBanner
        banner.is_active = statusData.is_active as boolean;

        let updatedBanner = await this.updateOne({uid: bannerId},{...banner})
        if (!updatedBanner?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedBanner?.message }
        
        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedBanner?.data || {}
        return resp
    }
    
    public async softDeleteBanner(bannerId: string): Promise<IResponse<IBanner>> {
        let resp = new ResponseObject(2001, "Something went wrong")

        let findBannerData: any = await this.findOne({uid: bannerId})
        if(!findBannerData?.data) return { ...resp, status: 2001, message: "Banner doesn't exist with this id." }

        let banner: any = findBannerData?.data
        banner.is_deleted = true;

        let updatedBanner = await this.updateOne({uid: bannerId},{...banner})
        if (!updatedBanner?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedBanner?.message }

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedBanner?.data || {}
        return resp
    }

    public async restoreDeletedBanner(bannerId: string): Promise<IResponse> {
        let resp = new ResponseObject(2001, "Something went wrong")

        let findBannerData = await this.findOne({uid: bannerId})
        if(!findBannerData?.data) return { ...resp, status: 2001, message: "Banner doesn't exist with this id." }

        let banner: any = findBannerData?.data
        banner.is_deleted = false;

        let updatedBanner = await this.updateOne({uid: bannerId},{...banner})
        if (!updatedBanner?.data) return { ...resp, status: 2001, message: "Something went wrong", error: updatedBanner?.message }
        
        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = updatedBanner?.data || {}
        return resp
    }

    public async hardDeleteBanner(bannerId: string): Promise<IResponse> {
        let resp = new ResponseObject(2001, "Something went wrong")

        let findBannerData: any = await this.findOne({uid: bannerId})
        if(!findBannerData?.data) return { ...resp, status: 2001, message: "Banner doesn't exist with this id." }

        let deletedBanner = await this.deleteOne({uid: bannerId})
        if (!deletedBanner?.data) return { ...resp, status: 2001, message: "Something went wrong", error: deletedBanner?.message }

        // response
        resp.status = 2000
        resp.message = "Success"
        resp.data = deletedBanner?.data || {}
        return resp
    }

    private async checkBannerData(bannerData: CreateBannerDto | UpdateBannerDto, _banner?: any): Promise<{ is_error: boolean, message?: string, bannerData: CreateBannerDto }> {
        // check for main banner if its a sub
        if(bannerData?.module != BANNER_MODULE.HOME && !bannerData?.module_id) return { is_error: true,  message: `Add module id for ${bannerData?.module?.toLowerCase()} banner`, bannerData }
        return {is_error: false, bannerData}
    }

}