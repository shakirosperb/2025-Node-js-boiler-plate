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
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                    pipeline: [
                        {
                            $project: {
                                uid:1,
                                name:1,
                                logo:1,
                                is_active:1,
                                is_deleted:1,
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
                                uid:1,
                                name:1,
                                logo:1,
                                is_active:1,
                                is_deleted:1,
                            }
                        }
                    ]
                }
            },    
            {
                $project: {
                    uid: 1,
                    url: 1,
                    title: 1,
                    description: 1,
                    images: 1,

                    categories: 1,
                    brands: 1,

                    is_homepage: 1,
                    is_dynamic_product: 1,

                    is_active: 1,
                    is_deleted: 1,
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
                                price: { $first:"$productDetails.price"},
                                offer_price: { $first:"$productDetails.offer_price"},
                                stock: { $first:"$productDetails.stock"},
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
                    from: "Category",
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
                    pipeline: [
                        {
                            $project: {
                                uid:1,
                                name:1,
                                logo:1,
                                is_active:1,
                                is_deleted:1,
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
                                uid:1,
                                name:1,
                                logo:1,
                                is_active:1,
                                is_deleted:1,
                            }
                        }
                    ]
                }
            },    
            {
                $project: {
                    uid: 1,
                    url: 1,
                    title: 1,
                    description: 1,
                    images: 1,

                    categories: 1,
                    brands: 1,

                    is_homepage: 1,
                    is_dynamic_product: 1,

                    is_active: 1,
                    is_deleted: 1,
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
                                price: { $first:"$productDetails.price"},
                                offer_price: { $first:"$productDetails.offer_price"},
                                offer_start_date: { $first:"$productDetails.offer_start_date"},
                                offer_end_date: { $first:"$productDetails.offer_end_date"},
                                stock: { $first:"$productDetails.stock"},
                                has_variants: { $first:"$productDetails.has_variants"},
                                is_variant: { $first:"$productDetails.is_variant"},
                                product_variation_1: { $first:"$productDetails.product_variation_1"},
                                product_variation_value_1: { $first:"$productDetails.product_variation_value_1"},
                                product_variation_2: { $first:"$productDetails.product_variation_2"},
                                product_variation_value_2: { $first:"$productDetails.product_variation_value_2"},
                                product_variation_3: { $first:"$productDetails.product_variation_3"},
                                product_variation_value_3: { $first:"$productDetails.product_variation_value_3"},
                                main_product: { $first:"$productDetails.main_product"},
                                variation_list: { $first:"$productDetails.variation_list"},
                            },
                        }
                    },
                }
            } 
        ]

        return agg
    },
}