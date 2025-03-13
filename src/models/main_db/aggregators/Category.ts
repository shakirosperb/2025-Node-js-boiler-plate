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
                    from: "Category", 
                    localField: "main_category",
                    foreignField: "uid",
                    as: "main_category",
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
                  path: "$main_category",
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
                    from: "Category", 
                    localField: "main_category",
                    foreignField: "uid",
                    as: "main_category",
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
                  path: "$main_category",
                  preserveNullAndEmptyArrays: true
                }
            },       
        ]

        return agg
    },
}