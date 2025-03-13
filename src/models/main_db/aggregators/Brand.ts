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
                    from: "Brand", 
                    localField: "main_brand",
                    foreignField: "uid",
                    as: "main_brand",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo:1
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$main_brand",
                  preserveNullAndEmptyArrays: true
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
                    from: "Brand", 
                    localField: "main_brand",
                    foreignField: "uid",
                    as: "main_brand",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo:1
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$main_brand",
                  preserveNullAndEmptyArrays: true
                }
            },
        ]

        return agg
    },
}