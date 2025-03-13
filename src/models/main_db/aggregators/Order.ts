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
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "user",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                name:1,
                                phone:1,
                                country_code:1,
                                is_guest:1,
                                createdAt:1,
                                last_login_at:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" },

            // pickup location
            {
                $lookup: {
                    from: "PickupLocation",
                    localField: "pickup_location",
                    foreignField: "uid",
                    as: "pickup_location_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                                location:1,
                                address:1,
                                images:1,
                                uid:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "pickup_location": {
                        $cond: {
                            if: { $gt: [{ $size: "$pickup_location_details" }, 0] },
                            then: { $arrayElemAt: ["$pickup_location_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    "pickup_location_details": 0
                }
            },

            { $unwind: "$order_items" },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "Product",
                    localField: "order_items.product",
                    foreignField: "uid",
                    as: "order_items.product_details",
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
                        }
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "order_items.product": {
                        $arrayElemAt: ["$order_items.product_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "order_items.product_details": 0
                }
            },

            {
                $lookup: {
                    from: "Review",
                    localField: "order_items.review",
                    foreignField: "uid",
                    as: "order_items.review_details",
                    pipeline:[
                        {
                            $project: {
                                message:1,
                                rating:1,
                                images:1,
                            }
                        }
                    ]
                }
            },

            {
                $addFields: {
                    "order_items.review": {
                        $cond: {
                            if: { $gt: [{ $size: "$order_items.review_details" }, 0] },
                            then: { $arrayElemAt: ["$order_items.review_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    "order_items.review_details": 0
                }
            },

            // shipping address country, state, district populate
            {
                $lookup: {
                    from: "Country",
                    localField: "shipping_address.country",
                    foreignField: "uid",
                    as: "shipping_address.country_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "State",
                    localField: "shipping_address.state",
                    foreignField: "uid",
                    as: "shipping_address.state_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "District",
                    localField: "shipping_address.district",
                    foreignField: "uid",
                    as: "shipping_address.district_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                            }
                        }
                    ]
                }
            },
            
            {
                $addFields: {
                    "shipping_address.country": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.country_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.country_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "shipping_address.state": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.state_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.state_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "shipping_address.district": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.district_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.district_details", 0] },
                            else: null
                        }
                    }
                }
            },
        
            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    user: { $first: "$user" }, // Same for user
                    order_id: { $first: "$order_id" },
                    order_items: { $push: "$order_items" },
                    
                    order_type: { $first: "$order_type" },
                    payment_type: { $first: "$payment_type" },
                    delivery_type: { $first: "$delivery_type" },

                    shipping_address: { $first: "$shipping_address" },
                    is_billing_same_as_shipping: { $first: "$is_billing_same_as_shipping" },
                    billing_address: { $first: "$billing_address" },
                    pickup_location: { $first: "$pickup_location" },

                    is_preorder_advance_needed: { $first: "$is_preorder_advance_needed" },
                    preorder_advance_amount: { $first: "$preorder_advance_amount" },
                    is_preorder_advance_paid: { $first: "$is_preorder_advance_paid" },
                    preorder_advance_paid_at: { $first: "$preorder_advance_paid_at" },

                    preorder_balance_amount: { $first: "$preorder_balance_amount" },
                    is_preorder_balance_paid: { $first: "$is_preorder_balance_paid" },
                    preorder_balance_paid_at: { $first: "$preorder_balance_paid_at" },

                    is_coupon_redeemed: { $first: "$is_coupon_redeemed" },
                    coupon: { $first: "$coupon" },
                    coupon_code: { $first: "$coupon_code" },
                    
                    items_price: { $first: "$items_price" },
                    total_coupon_discount: { $first: "$total_coupon_discount" },
                    total_shipping_price: { $first: "$total_shipping_price" },
                    total_shipping_discount: { $first: "$total_shipping_discount" },
                    cod_charge: { $first: "$cod_charge" },
                    total_price: { $first: "$total_price" },

                    total_price_without_tax: { $first: "$total_price_without_tax" },
                    tax_value: { $first: "$tax_value" },

                    total_offer_discount: { $first: "$total_offer_discount" },
                    total_discount: { $first: "$total_discount" },

                    order_status: { $first: "$order_status" },

                    order_initiated_at: { $first: "$order_initiated_at" },
                    is_paid: { $first: "$is_paid" },
                    paid_at: { $first: "$paid_at" },
                    shipped_at: { $first: "$shipped_at" },
                    delivered_at: { $first: "$delivered_at" },
                    cancel_initiated_at: { $first: "$cancel_initiated_at" },
                    cancelled_at: { $first: "$cancelled_at" },
                    return_initiated_at: { $first: "$return_initiated_at" },
                    returned_at: { $first: "$returned_at" },
                    delivery_duration: { $first: "$delivery_duration" },
                    estimated_delivery_date: { $first: "$estimated_delivery_date" },

                    is_starred: { $first: "$is_starred" },
                    awb_number: { $first: "$awb_number" },
                    payment_transaction_id: { $first: "$payment_transaction_id" },

                    is_deleted: { $first: "$is_deleted" },
                    created_by: { $first: "$created_by" },
                    createdAt: { $first: "$createdAt" },

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
                $match: f
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "User",
                    localField: "user",
                    foreignField: "uid",
                    as: "user",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                name:1,
                                phone:1,
                                country_code:1,
                                is_guest:1,
                                createdAt:1,
                                last_login_at:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" },

            // pickup location
            {
                $lookup: {
                    from: "PickupLocation",
                    localField: "pickup_location",
                    foreignField: "uid",
                    as: "pickup_location_details",
                    pipeline:[
                        {
                            $project: {
                                title:1,
                                location:1,
                                address:1,
                                images:1,
                                uid:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "pickup_location": {
                        $cond: {
                            if: { $gt: [{ $size: "$pickup_location_details" }, 0] },
                            then: { $arrayElemAt: ["$pickup_location_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    "pickup_location_details": 0
                }
            },

            { $unwind: "$order_items" },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "Product",
                    localField: "order_items.product",
                    foreignField: "uid",
                    as: "order_items.product_details",
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
                        }
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "order_items.product": {
                        $arrayElemAt: ["$order_items.product_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "order_items.product_details": 0
                }
            },

            {
                $lookup: {
                    from: "Review",
                    localField: "order_items.review",
                    foreignField: "uid",
                    as: "order_items.review_details",
                    pipeline:[
                        {
                            $project: {
                                message:1,
                                rating:1,
                                images:1,
                            }
                        }
                    ]
                }
            },
            
            {
                $addFields: {
                    "order_items.review": {
                        $cond: {
                            if: { $gt: [{ $size: "$order_items.review_details" }, 0] },
                            then: { $arrayElemAt: ["$order_items.review_details", 0] },
                            else: null
                        }
                    }
                }
            },

            // shipping address country, state, district populate
            {
                $lookup: {
                    from: "Country",
                    localField: "shipping_address.country",
                    foreignField: "uid",
                    as: "shipping_address.country_details",
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
                    localField: "shipping_address.state",
                    foreignField: "uid",
                    as: "shipping_address.state_details",
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
                    from: "District",
                    localField: "shipping_address.district",
                    foreignField: "uid",
                    as: "shipping_address.district_details",
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
                    "shipping_address.country": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.country_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.country_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "shipping_address.state": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.state_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.state_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "shipping_address.district": {
                        $cond: {
                            if: { $gt: [{ $size: "$shipping_address.district_details" }, 0] },
                            then: { $arrayElemAt: ["$shipping_address.district_details", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    "shipping_address.country_details": 0,
                    "shipping_address.state_details": 0,
                    "shipping_address.district_details": 0,
                }
            },
        
            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    user: { $first: "$user" }, // Same for user
                    order_id: { $first: "$order_id" },
                    order_items: { $push: "$order_items" }, // Reassemble cart_items as an array
                    
                    order_type: { $first: "$order_type" },
                    payment_type: { $first: "$payment_type" },
                    delivery_type: { $first: "$delivery_type" },

                    shipping_address: { $first: "$shipping_address" },
                    is_billing_same_as_shipping: { $first: "$is_billing_same_as_shipping" },
                    billing_address: { $first: "$billing_address" },
                    pickup_location: { $first: "$pickup_location" },

                    is_preorder_advance_needed: { $first: "$is_preorder_advance_needed" },
                    preorder_advance_amount: { $first: "$preorder_advance_amount" },
                    is_preorder_advance_paid: { $first: "$is_preorder_advance_paid" },
                    preorder_advance_paid_at: { $first: "$preorder_advance_paid_at" },

                    preorder_balance_amount: { $first: "$preorder_balance_amount" },
                    is_preorder_balance_paid: { $first: "$is_preorder_balance_paid" },
                    preorder_balance_paid_at: { $first: "$preorder_balance_paid_at" },

                    is_coupon_redeemed: { $first: "$is_coupon_redeemed" },
                    coupon: { $first: "$coupon" },
                    coupon_code: { $first: "$coupon_code" },
                    
                    items_price: { $first: "$items_price" },
                    total_coupon_discount: { $first: "$total_coupon_discount" },
                    total_shipping_price: { $first: "$total_shipping_price" },
                    total_shipping_discount: { $first: "$total_shipping_discount" },
                    cod_charge: { $first: "$cod_charge" },
                    total_price: { $first: "$total_price" },

                    total_price_without_tax: { $first: "$total_price_without_tax" },
                    tax_value: { $first: "$tax_value" },

                    total_offer_discount: { $first: "$total_offer_discount" },
                    total_discount: { $first: "$total_discount" },

                    order_status: { $first: "$order_status" },

                    order_initiated_at: { $first: "$order_initiated_at" },
                    is_paid: { $first: "$is_paid" },
                    paid_at: { $first: "$paid_at" },
                    shipped_at: { $first: "$shipped_at" },
                    delivered_at: { $first: "$delivered_at" },
                    cancel_initiated_at: { $first: "$cancel_initiated_at" },
                    cancelled_at: { $first: "$cancelled_at" },
                    return_initiated_at: { $first: "$return_initiated_at" },
                    returned_at: { $first: "$returned_at" },
                    delivery_duration: { $first: "$delivery_duration" },
                    estimated_delivery_date: { $first: "$estimated_delivery_date" },

                    is_starred: { $first: "$is_starred" },
                    is_free_shipping_applied: { $first: "$is_free_shipping_applied" },
                    awb_number: { $first: "$awb_number" },
                    payment_transaction_id: { $first: "$payment_transaction_id" },

                    is_deleted: { $first: "$is_deleted" },
                    created_by: { $first: "$created_by" },
                    createdAt: { $first: "$createdAt" },
                }
            }
        ];
        return agg
    },
}