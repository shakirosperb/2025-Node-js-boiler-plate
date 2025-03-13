import { CreateBannerDto, BannerListQueryDto, UpdateBannerActiveStatusDto, UpdateBannerDto, BannerCountListQueryDto} from "@/dtos/banner.dto";
import { adminAuthMiddleware } from "@/middleware/auth.middleware";
import { BANNER_SERVICE } from "@/services";
import { Controller, Delete, Get, Middleware, Post, Put, Validate } from "@/utils/decarators";
import { Request, Response } from "express";

@Controller("/banner/admin")
export default class BannerController {

    @Validate(BannerListQueryDto, 'body', false)
    // @Middleware(adminAuthMiddleware())
    @Post("/all")
    public async allBanners(req: Request, res: Response) {
        let page = Number(req.query.page || 1 )as number
        let limit = Number(req.query.limit || 10) as number
        let query = req.query;
        let data: BannerListQueryDto = req.body;
        
        let result =await new BANNER_SERVICE().findAllBanners(page, limit, query, data)
        return res.send(result)
    }

    @Validate(BannerCountListQueryDto, 'body', false)
    // @Middleware(adminAuthMiddleware())
    @Post("/count/all")
    public async allBannerCounts(req: Request, res: Response) {
        let data: BannerCountListQueryDto = req.body
        let query = req.query;

        let result =await new BANNER_SERVICE().findAllBannerCounts(query,data)
        return res.send(result)
    }

    // @Middleware(adminAuthMiddleware())
    @Get("/single/:id")
    public async singleBannerDetails(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let result =await new BANNER_SERVICE().findBannerDetails(bannerId)
        return res.send(result)
    }

    @Validate(CreateBannerDto, 'body', false)
    // @Middleware(adminAuthMiddleware())
    @Post("/new")
    public async createBanner(req: Request, res: Response) {
        console.log('check');
        
        let bannerData: CreateBannerDto = req.body
        let result = await new BANNER_SERVICE().createBanner(bannerData)
        return res.send(result)
    }

    @Validate(UpdateBannerDto, 'body', false)
    // @Middleware(adminAuthMiddleware())
    @Put("/:id")
    public async updateBanner(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let bannerData: UpdateBannerDto = req.body
        let result = await new BANNER_SERVICE().updateBanner(bannerId, bannerData)
        return res.send(result)
    }

    @Validate(UpdateBannerActiveStatusDto, 'body', false)
    // @Middleware(adminAuthMiddleware())
    @Post("/status/active/:id")
    public async updateBannerActiveStatus(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let statusData: UpdateBannerActiveStatusDto = req.body
        let result =await new BANNER_SERVICE().updateBannerStatus(bannerId, statusData)
        return res.send(result)
    }

    // @Middleware(adminAuthMiddleware())
    @Post("/delete/:id")
    public async deleteBanner(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let result =await new BANNER_SERVICE().softDeleteBanner(bannerId)
        return res.send(result)
    }
    
    // @Middleware(adminAuthMiddleware())
    @Post("/restore/:id")
    public async restoreDeletedBanner(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let result =await new BANNER_SERVICE().restoreDeletedBanner(bannerId)
        return res.send(result)
    }

    @Middleware(adminAuthMiddleware())
    @Delete("/:id")
    public async hardDeleteBanner(req: Request, res: Response) {
        let bannerId: string = req.params.id
        let result =await new BANNER_SERVICE().hardDeleteBanner(bannerId)
        return res.send(result)
    }

}