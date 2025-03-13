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
                    from: "Country", 
                    localField: "country",
                    foreignField: "uid",
                    as: "country",
                    pipeline: [
                        {
                          $project: {
                            _id:0,
                            uid: 1,
                            title: 1,
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$country",
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
                    from: "Country", 
                    localField: "country",
                    foreignField: "uid",
                    as: "country",
                    pipeline: [
                        {
                          $project: {
                            _id:0,
                            uid: 1,
                            title: 1,
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$country",
                  preserveNullAndEmptyArrays: true
                }
            },  
        ]

        return agg
    },
}