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
                $match: f
            },
            {
                $limit: 1 
            },
            { 
                $unwind: { 
                    path: "$cart_items", 
                    // preserveNullAndEmptyArrays: true // This ensures that an empty cart_items array won't stop further processing
                } 
            },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "Product",
                    localField: "cart_items.product",
                    foreignField: "uid",
                    as: "cart_items.product_details",
                    pipeline:[
                        {
                            $project: {
                                search_keywords:0,
                                specifications:0,
                                warranty_note:0,
                                exchange_policy_note:0,
                                description:0,
                                createdAt:0,
                                updatedAt:0,
                                __v:0,
                                _id:0,
                            }
                        },
                        {
                            $lookup: {
                                from: "Product",
                                localField: "main_product",
                                foreignField: "uid",
                                as: "main_product",
                            }
                        },
                        {
                            $unwind: {
                                path: "$main_product",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "cart_items.product": {
                        $arrayElemAt: ["$cart_items.product_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "cart_items.product_details": 0
                }
            },
        
            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    user: { $first: "$user" }, // Same for user
                    // cart_items: { $push: "$cart_items" }, // Reassemble cart_items as an array
                    cart_items: {
                        $push: {
                            $cond: [
                                { $eq: ["$cart_items", {}] }, // Check if cart_items is an empty object
                                null, // If true, return null
                                "$cart_items" // Otherwise, push the cart item
                            ]
                        }
                    }, // Reassemble cart_items as an array
                    
                    coupon: { $first: "$coupon" },
                    coupon_code: { $first: "$coupon_code" },
                    coupon_products: { $first: "$coupon_products" },

                    items_price: { $first: "$items_price" },
                    total_coupon_discount: { $first: "$total_coupon_discount" },
                    total_shipping_price: { $first: "$total_shipping_price" },
                    total_shipping_discount: { $first: "$total_shipping_discount" },
                    cod_charge: { $first: "$cod_charge" },
                    total_price: { $first: "$total_price" },

                    total_offer_discount: { $first: "$total_offer_discount" },
                    total_discount: { $first: "$total_discount" },
                    order_data: { $first: "$order_data" },
                    is_free_shipping_applied: { $first: "$is_free_shipping_applied" },
                }
            },
            // Final project to remove any null cart items
            {
                $addFields: {
                    cart_items: {
                        $filter: {
                            input: "$cart_items",
                            as: "item",
                            cond: { $ne: ["$$item", null] }
                        }
                    }
                }
            }

        ];

        return agg
    },
}