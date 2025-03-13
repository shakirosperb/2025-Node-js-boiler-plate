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
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "items",
                    foreignField: "uid",
                    as: "items"
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
        
        // let agg: Obj[] = [
        //     {
        //         $match:f
        //     },
        //     {
        //         $limit: 1
        //     },
        //     {
        //         $lookup: {
        //             from: "Product",
        //             localField: "product",
        //             foreignField: "uid",
        //             as: "product"
        //         }
        //     },
        //     {
        //         $unwind: "$product"
        //     },
        //     {
        //         $lookup: {
        //             from: "Product",
        //             localField: "items",
        //             foreignField: "uid",
        //             as: "items"
        //         }
        //     }
        // ]

        let agg: Obj[] = [
            {
                $match: f
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "product",
                    foreignField: "uid",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $addFields: {
                    // Add an index to each item in the original array
                    itemsWithIndex: {
                        $map: {
                            input: { $range: [0, { $size: "$items" }] },
                            as: "idx",
                            in: {
                                idx: "$$idx",
                                uid: { $arrayElemAt: ["$items", "$$idx"] }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "itemsWithIndex.uid",
                    foreignField: "uid",
                    as: "populatedItems"
                }
            },
            {
                $addFields: {
                    // Sort the populated items based on the original index
                    items: {
                        $map: {
                            input: "$itemsWithIndex",
                            as: "origItem",
                            in: {
                                $arrayElemAt: [
                                    "$populatedItems",
                                    { $indexOfArray: ["$populatedItems.uid", "$$origItem.uid"] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    itemsWithIndex: 0,  // Remove the temporary field
                    populatedItems: 0   // Remove the temporary field
                }
            }
        ];

        return agg
    },
}