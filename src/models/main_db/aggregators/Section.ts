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
                    from: "Product",
                    localField: "product_variants",
                    foreignField: "uid",
                    as: "product_variants"
                }
            },  
            {
                $project: {
                    uid: 1,
                    
                    page: 1,
                    priority: 1,
                    title: 1,
                    subtitle: 1,
                    description: 1,
                    images: 1,
                
                    link: 1,
                    video_id: 1,
                    short_contents: 1,
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
                    product_variants: 1,
                    faq_data: 1,
                    testimonials: 1,
                
                    grid_size: 1,
                    carousel_count: 1,
                    image_position: 1,
                    text_align: 1,
                    call_to_action: 1,
                
                    layout: 1,
                    platform: 1,
                    height: 1,
                    bg_color: 1,
                    fg_color: 1,
                
                    is_default: 1,
                    is_active: 1,
                    is_deleted: 1,
                    created_by: 1,
                    updated_by: 1,
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
                    as: "product"
                }
            },
            {
                $unwind: "$product"
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
        ]

        return agg
    },
}