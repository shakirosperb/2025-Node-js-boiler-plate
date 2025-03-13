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
                $lookup: {
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "userDetails",
                }
            },
            {
                $lookup: {
                    from: "Order",
                    localField: "order",
                    foreignField: "uid",
                    as: "orderDetails",
                }
            },
            {
                $project: {
                    uid: 1,
                    name: 1,
                    phone: 1,
                    message: 1,
                    rating: 1,
                    images: 1,
                    is_manual: 1,
                    is_active: 1,
                    is_deleted: 1,
                    createdAt: 1,
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
                            },
                        }
                    },
                    user: {
                        $cond: {
                            if: { $eq: ["$userDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$userDetails.uid"},
                                name: { $first:"$userDetails.name"},
                                country_code: { $first:"$userDetails.country_code"},
                                phone: { $first:"$userDetails.phone"},
                            },
                        }
                    },
                    order: {
                        $cond: {
                            if: { $eq: ["$orderDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$orderDetails.uid"},
                                order_id: { $first:"$orderDetails.order_id"},
                            },
                        }
                    },
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
                    localField: "product",
                    foreignField: "uid",
                    as: "productDetails",
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "userDetails",
                }
            },
            {
                $lookup: {
                    from: "Order",
                    localField: "order",
                    foreignField: "uid",
                    as: "orderDetails",
                }
            },
            {
                $project: {
                    name: 1,
                    phone: 1,
                    message: 1,
                    rating: 1,
                    images: 1,
                    is_manual: 1,
                    is_active: 1,
                    is_deleted: 1,
                    createdAt: 1,
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
                            },
                        }
                    },
                    user: {
                        $cond: {
                            if: { $eq: ["$userDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$userDetails.uid"},
                                name: { $first:"$userDetails.name"},
                                country_code: { $first:"$userDetails.country_code"},
                                phone: { $first:"$userDetails.phone"},
                            },
                        }
                    },
                    order: {
                        $cond: {
                            if: { $eq: ["$orderDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$orderDetails.uid"},
                                order_id: { $first:"$orderDetails.order_id"},
                            },
                        }
                    },
                }
            }  
        ]

        return agg
    }
}