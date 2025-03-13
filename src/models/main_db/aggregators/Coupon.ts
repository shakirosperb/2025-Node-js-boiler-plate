import { Obj } from "@/interface/common"

export default {
    pagination: (f: Obj, _o: Obj, p: Obj) => {
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $skip:p.skip
            },
            {
                $limit:p.limit
            },

        ]
        return agg
    },
    basic: (f: Obj, _o: Obj, p: Obj) => {
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "products",
                    foreignField: "uid",
                    as: "products",
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands",
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "whitelist_users",
                    foreignField: "uid",
                    as: "whitelist_users",
                }
            }, 
            {
                $lookup: {
                    from: "PickupLocation",
                    localField: "pickup_locations",
                    foreignField: "uid",
                    as: "pickup_locations",
                }
            },  
            {
                $sort: p.sort
            },
            {
                $skip: p.skip
            },
            {
                $limit: p.limit
            },       
        ]
        return agg
    },
    thrust: (_f: Obj, o: Obj, _p: Obj) => {
        let agg: Obj[] = [o]
        return agg
    },
    single: (f: Obj, _o: Obj, _p: Obj) => {
        
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "products",
                    foreignField: "uid",
                    as: "products",
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands",
                }
            }, 
            {
                $lookup: {
                    from: "User",
                    localField: "whitelist_users",
                    foreignField: "uid",
                    as: "whitelist_users",
                }
            }, 
            {
                $lookup: {
                    from: "PickupLocation",
                    localField: "pickup_locations",
                    foreignField: "uid",
                    as: "pickup_locations",
                }
            }, 
        ]

        return agg
    },
    summary: (f: Obj, _o: Obj, p: Obj) => {
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $sort: p.sort
            },
            {
                $skip: p.skip
            },
            {
                $limit: p.limit
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "products",
                    foreignField: "uid",
                    as: "products",
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands",
                }
            },   
            {
                $lookup: {
                    from: "PickupLocation",
                    localField: "pickup_locations",
                    foreignField: "uid",
                    as: "pickup_locations",
                }
            }, 
            {
                $lookup: {
                    from: "UserCoupon",
                    localField: "uid", 
                    foreignField: "coupon",
                    as: "user_coupons"
                }
            },
            {
                $addFields: {
                    redeemed_count: { $size: "$user_coupons" },
                    total_redeemed_value: { $sum: "$user_coupons.value" }
                }
            },
            {
                $project: {
                    user_coupons: 0
                }
            }     
        ]
        return agg
    },
}