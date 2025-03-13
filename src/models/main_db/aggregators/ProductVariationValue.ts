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
                    from: "ProductVariation",
                    localField: "product_variation",
                    foreignField: "uid",
                    as: "product_variation",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                path: "$product_variation",
                preserveNullAndEmptyArrays: true
                }
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
                    from: "ProductVariation",
                    localField: "product_variation",
                    foreignField: "uid",
                    as: "product_variation",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]

        return agg
    },
    raw: (f: Obj, _o: Obj, _p: Obj) => {
        
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $project: {
                    uid:1,
                    value:1
                }
            }       
        ]
        return agg
    },
}