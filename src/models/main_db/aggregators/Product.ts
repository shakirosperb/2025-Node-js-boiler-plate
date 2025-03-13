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
                    localField: "categories",
                    foreignField: "uid",
                    as: "categories",
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
                            logo:1
                          }
                        }
                      ]
                }
            },
            {
                $lookup: {
                    from: "ProductLabel",
                    localField: "product_labels",
                    foreignField: "uid",
                    as: "product_labels",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                            logo:1,
                            layout:1
                          }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "TaxCategory",
                    localField: "tax_categories",
                    foreignField: "uid",
                    as: "tax_categories",
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
                    from: "Page",
                    localField: "page",
                    foreignField: "uid",
                    as: "page",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$page",
                  preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "main_product",
                    foreignField: "uid",
                    as: "main_product",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                name: 1,
                                images:1,
                                variation_list:1,
                                description:1,
                                specifications:1,
                                categories:1,
                                brands:1,
                                product_labels:1,
                                //TODO: add other needed fields later
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$main_product",
                    preserveNullAndEmptyArrays: true
                }
            }, 

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_1",
                    foreignField: "uid",
                    as: "product_variation_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_1",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_2",
                    foreignField: "uid",
                    as: "product_variation_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_2",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_3",
                    foreignField: "uid",
                    as: "product_variation_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_1",
                    foreignField: "uid",
                    as: "product_variation_value_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_1",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_2",
                    foreignField: "uid",
                    as: "product_variation_value_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_2",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_3",
                    foreignField: "uid",
                    as: "product_variation_value_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            { 
                $unwind: { 
                    path: "$variation_list", 
                    preserveNullAndEmptyArrays: true // This ensures that an empty cart_items array won't stop further processing
                } 
            },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "variation_list.product_variation",
                    foreignField: "uid",
                    as: "variation_list.product_variation_details",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                title:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "variation_list.product_variation_values",
                    foreignField: "uid",
                    as: "variation_list.product_variation_values",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                value:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "variation_list.product_variation": {
                        $arrayElemAt: ["$variation_list.product_variation_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "variation_list.product_variation_details": 0
                }
            },

            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    sap_id: { $first: "$sap_id" },
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    specifications: { $first: "$specifications" },
                    images: { $first: "$images" },
                    video_id: { $first: "$video_id" },
                
                    search_keywords: { $first: "$search_keywords" },
                    product_labels: { $first: "$product_labels" },
                    categories: { $first: "$categories" },
                    brands: { $first: "$brands" },
                    type: { $first: "$type" },
                    order_type: { $first: "$order_type" },
                    is_preorder_advance_needed: { $first: "$is_preorder_advance_needed" },
                    preorder_advance_amount: { $first: "$preorder_advance_amount" },
                
                    has_variants: { $first: "$has_variants" },
                    is_variant: { $first: "$is_variant" },
                    product_variation_1: { $first: "$product_variation_1" },
                    product_variation_value_1: { $first: "$product_variation_value_1" },
                    product_variation_2: { $first: "$product_variation_2" },
                    product_variation_value_2: { $first: "$product_variation_value_2" },
                    product_variation_3: { $first: "$product_variation_3" },
                    product_variation_value_3: { $first: "$product_variation_value_3" },
                    main_product: { $first: "$main_product" },
                    variation_list: {
                        $push: {
                            $cond: [
                                { $eq: ["$variation_list", {}] }, // Check if variation_list is an empty object
                                null, // If true, return null
                                "$variation_list" // Otherwise, push the variation_list
                            ]
                        }
                    }, // Reassemble cart_items as an array
                
                    cost: { $first: "$cost" },
                    price_without_tax: { $first: "$price_without_tax" },
                    price: { $first: "$price" },
                    offer_price_without_tax: { $first: "$offer_price_without_tax" },
                    offer_price: { $first: "$offer_price" },
                    offer_start_date: { $first: "$offer_start_date" },
                    offer_end_date: { $first: "$offer_end_date" },
                    tax_categories: { $first: "$tax_categories" },
                
                    stock: { $first: "$stock" },
                    min_order_quantity: { $first: "$min_order_quantity" },
                    max_order_quantity: { $first: "$max_order_quantity" },
                    weight: { $first: "$weight" },
                    weight_category: { $first: "$weight_category" },
                    dimension: { $first: "$dimension" },
                
                    is_return_viable: { $first: "$is_return_viable" },
                    is_free_delivery_product: { $first: "$is_free_delivery_product" },
                    warranty_note: { $first: "$warranty_note" },
                    exchange_policy_note: { $first: "$exchange_policy_note" },
                
                    is_page_attached: { $first: "$is_page_attached" },
                    page: { $first: "$page" },
                    product_groups: { $first: "$product_groups" },
                
                    average_rating: { $first: "$average_rating" },
                    review_count: { $first: "$review_count" },
                    url: { $first: "$url" },
                
                    is_active: { $first: "$is_active" },
                    is_deleted: { $first: "$is_deleted" },
                    created_by: { $first: "$created_by" },
                    updated_by: { $first: "$updated_by" },
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
                                logo:1
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
                                logo:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "ProductLabel",
                    localField: "product_labels",
                    foreignField: "uid",
                    as: "product_labels",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                logo:1,
                                layout:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "ProductGroup",
                    localField: "product_groups",
                    foreignField: "uid",
                    as: "product_groups",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "TaxCategory",
                    localField: "tax_categories",
                    foreignField: "uid",
                    as: "tax_categories",
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
                    from: "Page",
                    localField: "page",
                    foreignField: "uid",
                    as: "page",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$page",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "main_product",
                    foreignField: "uid",
                    as: "main_product",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                name: 1,
                                images:1,
                                variation_list:1,
                                description:1,
                                specifications:1,
                                categories:1,
                                brands:1,
                                product_labels:1,
                                //TODO: add other needed fields later
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$main_product",
                    preserveNullAndEmptyArrays: true
                }
            }, 

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_1",
                    foreignField: "uid",
                    as: "product_variation_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_1",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_2",
                    foreignField: "uid",
                    as: "product_variation_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_2",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_3",
                    foreignField: "uid",
                    as: "product_variation_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_1",
                    foreignField: "uid",
                    as: "product_variation_value_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_1",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_2",
                    foreignField: "uid",
                    as: "product_variation_value_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_2",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_3",
                    foreignField: "uid",
                    as: "product_variation_value_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            { 
                $unwind: { 
                    path: "$variation_list", 
                    preserveNullAndEmptyArrays: true // This ensures that an empty cart_items array won't stop further processing
                } 
            },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "variation_list.product_variation",
                    foreignField: "uid",
                    as: "variation_list.product_variation_details",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                title:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "variation_list.product_variation_values",
                    foreignField: "uid",
                    as: "variation_list.product_variation_values",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                value:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "variation_list.product_variation": {
                        $arrayElemAt: ["$variation_list.product_variation_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "variation_list.product_variation_details": 0
                }
            },

            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    sap_id: { $first: "$sap_id" },
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    specifications: { $first: "$specifications" },
                    images: { $first: "$images" },
                    video_id: { $first: "$video_id" },
                
                    search_keywords: { $first: "$search_keywords" },
                    product_labels: { $first: "$product_labels" },
                    categories: { $first: "$categories" },
                    brands: { $first: "$brands" },
                    type: { $first: "$type" },
                    order_type: { $first: "$order_type" },
                    is_preorder_advance_needed: { $first: "$is_preorder_advance_needed" },
                    preorder_advance_amount: { $first: "$preorder_advance_amount" },
                
                    has_variants: { $first: "$has_variants" },
                    is_variant: { $first: "$is_variant" },
                    product_variation_1: { $first: "$product_variation_1" },
                    product_variation_value_1: { $first: "$product_variation_value_1" },
                    product_variation_2: { $first: "$product_variation_2" },
                    product_variation_value_2: { $first: "$product_variation_value_2" },
                    product_variation_3: { $first: "$product_variation_3" },
                    product_variation_value_3: { $first: "$product_variation_value_3" },
                    main_product: { $first: "$main_product" },
                    variation_list: {
                        $push: {
                            $cond: [
                                { $eq: ["$is_variant", true] }, // Check if variation_list is an empty object
                                [], // If true, return null
                                {
                                    $cond: [
                                        { $eq: ["$variation_list", []] }, // Check if variation_list is an empty object
                                        null, // If true, return null
                                        "$variation_list" // Otherwise, push the variation_list
                                    ]
                                }
                            ]
                            
                        }
                    }, // Reassemble cart_items as an array
                
                    cost: { $first: "$cost" },
                    price_without_tax: { $first: "$price_without_tax" },
                    price: { $first: "$price" },
                    offer_price_without_tax: { $first: "$offer_price_without_tax" },
                    offer_price: { $first: "$offer_price" },
                    offer_start_date: { $first: "$offer_start_date" },
                    offer_end_date: { $first: "$offer_end_date" },
                    tax_categories: { $first: "$tax_categories" },
                
                    stock: { $first: "$stock" },
                    min_order_quantity: { $first: "$min_order_quantity" },
                    max_order_quantity: { $first: "$max_order_quantity" },
                    weight: { $first: "$weight" },
                    weight_category: { $first: "$weight_category" },
                    dimension: { $first: "$dimension" },
                
                    is_return_viable: { $first: "$is_return_viable" },
                    is_free_delivery_product: { $first: "$is_free_delivery_product" },
                    warranty_note: { $first: "$warranty_note" },
                    exchange_policy_note: { $first: "$exchange_policy_note" },
                
                    is_page_attached: { $first: "$is_page_attached" },
                    page: { $first: "$page" },
                    product_groups: { $first: "$product_groups" },
                
                    average_rating: { $first: "$average_rating" },
                    review_count: { $first: "$review_count" },
                    url: { $first: "$url" },
                
                    is_active: { $first: "$is_active" },
                    is_deleted: { $first: "$is_deleted" },
                    created_by: { $first: "$created_by" },
                    updated_by: { $first: "$updated_by" },
                    createdAt: { $first: "$createdAt" },
                }
            }
        ]

        return agg
    },

    variant: (f: Obj, _o: Obj, _p: Obj) => {
        let agg: Obj[] = [
            {
                $match:f
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
                            logo:1
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
                            logo:1
                          }
                        }
                      ]
                }
            },
            {
                $lookup: {
                    from: "ProductLabel",
                    localField: "product_labels",
                    foreignField: "uid",
                    as: "product_labels",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                            logo:1,
                            layout:1
                          }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "TaxCategory",
                    localField: "tax_categories",
                    foreignField: "uid",
                    as: "tax_categories",
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
                    from: "Page",
                    localField: "page",
                    foreignField: "uid",
                    as: "page",
                    pipeline: [
                        {
                          $project: {
                            uid: 1,
                            title: 1,
                          }
                        }
                    ]
                }
            },
            {
                $unwind: {
                  path: "$page",
                  preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "main_product",
                    foreignField: "uid",
                    as: "main_product",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                name: 1,
                                images:1,
                                variation_list:1,
                                description:1,
                                specifications:1,
                                categories:1,
                                brands:1,
                                product_labels:1,
                                //TODO: add other needed fields later
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$main_product",
                    preserveNullAndEmptyArrays: true
                }
            }, 

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_1",
                    foreignField: "uid",
                    as: "product_variation_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_1",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_2",
                    foreignField: "uid",
                    as: "product_variation_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_2",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "product_variation_3",
                    foreignField: "uid",
                    as: "product_variation_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                title: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_1",
                    foreignField: "uid",
                    as: "product_variation_value_1",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_1",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_2",
                    foreignField: "uid",
                    as: "product_variation_value_2",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_2",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "product_variation_value_3",
                    foreignField: "uid",
                    as: "product_variation_value_3",
                    pipeline: [
                        {
                            $project: {
                                uid: 1,
                                value: 1,
                                _id:0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$product_variation_value_3",
                    preserveNullAndEmptyArrays: true
                }
            },

            { 
                $unwind: { 
                    path: "$variation_list", 
                    preserveNullAndEmptyArrays: true // This ensures that an empty cart_items array won't stop further processing
                } 
            },

            // Lookup to enrich each cart item with product data from the Product collection
            {
                $lookup: {
                    from: "ProductVariation",
                    localField: "variation_list.product_variation",
                    foreignField: "uid",
                    as: "variation_list.product_variation_details",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                title:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },

            {
                $lookup: {
                    from: "ProductVariationValue",
                    localField: "variation_list.product_variation_values",
                    foreignField: "uid",
                    as: "variation_list.product_variation_values",
                    pipeline:[
                        {
                            $project: {
                                uid:1,
                                value:1,
                                _id:0,
                            }
                        }
                    ]
                }
            },
        
            // Replace the 'cart_items.product' array with its first element
            {
                $addFields: {
                    "variation_list.product_variation": {
                        $arrayElemAt: ["$variation_list.product_variation_details", 0]
                    }
                }
            },
        
            // Remove the now unnecessary 'product_details' field
            {
                $project: {
                    "variation_list.product_variation_details": 0
                }
            },

            // Group the documents back together
            {
                $group: {
                    _id: "$_id", // Use the original cart ID as the grouping key
                    uid: { $first: "$uid" }, // Since uid is constant per cart, use $first to keep its value
                    sap_id: { $first: "$sap_id" },
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    specifications: { $first: "$specifications" },
                    images: { $first: "$images" },
                    video_id: { $first: "$video_id" },
                
                    search_keywords: { $first: "$search_keywords" },
                    product_labels: { $first: "$product_labels" },
                    categories: { $first: "$categories" },
                    brands: { $first: "$brands" },
                    type: { $first: "$type" },
                    order_type: { $first: "$order_type" },
                    is_preorder_advance_needed: { $first: "$is_preorder_advance_needed" },
                    preorder_advance_amount: { $first: "$preorder_advance_amount" },
                
                    has_variants: { $first: "$has_variants" },
                    is_variant: { $first: "$is_variant" },
                    product_variation_1: { $first: "$product_variation_1" },
                    product_variation_value_1: { $first: "$product_variation_value_1" },
                    product_variation_2: { $first: "$product_variation_2" },
                    product_variation_value_2: { $first: "$product_variation_value_2" },
                    product_variation_3: { $first: "$product_variation_3" },
                    product_variation_value_3: { $first: "$product_variation_value_3" },
                    main_product: { $first: "$main_product" },
                    variation_list: {
                        $push: {
                            $cond: [
                                { $eq: ["$variation_list", {}] }, // Check if variation_list is an empty object
                                null, // If true, return null
                                "$variation_list" // Otherwise, push the variation_list
                            ]
                        }
                    }, // Reassemble cart_items as an array
                
                    cost: { $first: "$cost" },
                    price_without_tax: { $first: "$price_without_tax" },
                    price: { $first: "$price" },
                    offer_price_without_tax: { $first: "$offer_price_without_tax" },
                    offer_price: { $first: "$offer_price" },
                    offer_start_date: { $first: "$offer_start_date" },
                    offer_end_date: { $first: "$offer_end_date" },
                    tax_categories: { $first: "$tax_categories" },
                
                    stock: { $first: "$stock" },
                    min_order_quantity: { $first: "$min_order_quantity" },
                    max_order_quantity: { $first: "$max_order_quantity" },
                    weight: { $first: "$weight" },
                    weight_category: { $first: "$weight_category" },
                    dimension: { $first: "$dimension" },
                
                    is_return_viable: { $first: "$is_return_viable" },
                    is_free_delivery_product: { $first: "$is_free_delivery_product" },
                    warranty_note: { $first: "$warranty_note" },
                    exchange_policy_note: { $first: "$exchange_policy_note" },
                
                    is_page_attached: { $first: "$is_page_attached" },
                    page: { $first: "$page" },
                    product_groups: { $first: "$product_groups" },
                
                    average_rating: { $first: "$average_rating" },
                    review_count: { $first: "$review_count" },
                    url: { $first: "$url" },
                
                    is_active: { $first: "$is_active" },
                    is_deleted: { $first: "$is_deleted" },
                    created_by: { $first: "$created_by" },
                    updated_by: { $first: "$updated_by" },
                    createdAt: { $first: "$createdAt" },
                }
            }, 
            // {
            //     $sort: p.sort
            // },
        ]
        return agg
    },
}