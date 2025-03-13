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
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "userDetails",
                }
            },
            {
                $lookup: {
                    from: "Coupon",
                    localField: "coupon",
                    foreignField: "uid",
                    as: "couponDetails"
                }
            },
            {
                $lookup: {
                    from: "Order",
                    localField: "order",
                    foreignField: "uid",
                    as: "orderDetails"
                }
            },    
            {
                $project: {
                    uid: 1,
                    createdAt: 1,
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
                    coupon: {
                        $cond: {
                            if: { $eq: ["$couponDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$couponDetails.uid"},
                                title: { $first:"$couponDetails.title"},
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
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "userDetails",
                }
            },
            {
                $lookup: {
                    from: "Coupon",
                    localField: "coupon",
                    foreignField: "uid",
                    as: "couponDetails"
                }
            },
            {
                $lookup: {
                    from: "Order",
                    localField: "order",
                    foreignField: "uid",
                    as: "orderDetails"
                }
            },    
            {
                $project: {
                    uid: 1,
                    createdAt: 1,
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
                    coupon: {
                        $cond: {
                            if: { $eq: ["$couponDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$couponDetails.uid"},
                                title: { $first:"$couponDetails.title"},
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
    },
}