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
                    localField: "product",
                    foreignField: "uid",
                    as: "productDetails",
                }
            },
            {
                $project: {
                    uid: 1,
                    user: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    product: {
                        $cond: {
                            if: { $eq: ["$productDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$productDetails.uid"},
                                url: { $first:"$productDetails.url"},
                                name: { $first:"$productDetails.name"},
                                sap_id: { $first:"$productDetails.sap_id"},
                                images: { $first:"$productDetails.images"},
                                price: { $first:"$productDetails.price"},
                                offer_price: { $first:"$productDetails.offer_price"},
                                stock: { $first:"$productDetails.stock"},
                            },
                        }
                    }
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
                    from: "UserCoupon",
                    localField: "uid", 
                    foreignField: "coupon",
                    as: "user_coupons"
                }
            },
            {
                $addFields: {
                    deductions_count: { $size: "$user_coupons" },
                    total_deducted_value: { $sum: "$user_coupons.value" }
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