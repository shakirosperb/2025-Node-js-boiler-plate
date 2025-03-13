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
                    localField: "products",
                    foreignField: "uid",
                    as: "products",
                    pipeline:[
                        {
                            $lookup: {
                                from: "ProductLabel",
                                localField: "product_labels",
                                foreignField: "uid",
                                as: "product_labels"
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands"
                }
            },
            {
                $lookup: {
                    from: "Collection",
                    localField: "collections",
                    foreignField: "uid",
                    as: "collections"
                }
            },
            {
                $lookup: {
                    from: "ProductGroup",
                    localField: "product_groups",
                    foreignField: "uid",
                    as: "product_groups"
                }
            },
            {
                $lookup: {
                    from: "SpecialSale",
                    localField: "special_sales",
                    foreignField: "uid",
                    as: "special_sales"
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
                    pipeline:[
                        {
                            $lookup: {
                                from: "ProductLabel",
                                localField: "product_labels",
                                foreignField: "uid",
                                as: "product_labels"
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: "Brand",
                    localField: "brands",
                    foreignField: "uid",
                    as: "brands"
                }
            },
            {
                $lookup: {
                    from: "Collection",
                    localField: "collections",
                    foreignField: "uid",
                    as: "collections"
                }
            },
            {
                $lookup: {
                    from: "ProductGroup",
                    localField: "product_groups",
                    foreignField: "uid",
                    as: "product_groups"
                }
            },
            {
                $lookup: {
                    from: "SpecialSale",
                    localField: "special_sales",
                    foreignField: "uid",
                    as: "special_sales"
                }
            },
            
        ]

        return agg
    },
}