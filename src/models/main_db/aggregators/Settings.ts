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
                    from: "TaxCategory",
                    localField: "shipping.tax_categories",
                    foreignField: "uid",
                    as: "shipping.tax_categories",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                            percentage: 1,
                          }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Country",
                    localField: "setup.default_country",
                    foreignField: "uid",
                    as: "setup.default_country_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                                uid:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "State",
                    localField: "setup.default_state",
                    foreignField: "uid",
                    as: "setup.default_state_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                                uid:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "setup.default_country": {
                        $cond: {
                            if: { $gt: [{ $size: "$setup.default_country_details" }, 0] },
                            then: { $arrayElemAt: ["$setup.default_country_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "setup.default_state": {
                        $cond: {
                            if: { $gt: [{ $size: "$setup.default_state_details" }, 0] },
                            then: { $arrayElemAt: ["$setup.default_state_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    "setup.default_country_details": 0,
                    "setup.default_state_details": 0,
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
                    from: "TaxCategory",
                    localField: "shipping.tax_categories",
                    foreignField: "uid",
                    as: "shipping.tax_categories",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                            percentage: 1,
                          }
                        }
                    ]
                }
            },
        ]

        return agg
    },
}