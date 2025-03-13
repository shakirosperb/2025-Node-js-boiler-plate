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
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo: 1
                          }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo: 1
                          }
                        }
                    ]
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
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo: 1
                          }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            name: 1,
                            logo: 1
                          }
                        }
                    ]
                }
            }, 
        ]

        return agg
    },
}