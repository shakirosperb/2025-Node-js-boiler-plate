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
                    as: "countryDetails",
                }
            },
            {
                $lookup: {
                    from: "State",
                    localField: "state",
                    foreignField: "uid",
                    as: "stateDetails"
                }
            },
            {
                $lookup: {
                    from: "District",
                    localField: "district",
                    foreignField: "uid",
                    as: "districtDetails"
                }
            },    
            {
                $project: {
                    uid: 1,
                    name: 1,
                    first_name: 1,
                    middle_name: 1,
                    last_name: 1,
                    email: 1,
                    phone: 1,
                    country_code: 1,
                    address: 1, 
                    address_line_1: 1,
                    address_line_2: 1,
                    street: 1,
                    landmark: 1,
                    area: 1,
                    city: 1,
                    pincode: 1,
                    whatsapp_number: 1,
                    whatsapp_number_country_code: 1,
                    is_whatsapp_messaging_agreed: 1,
                    tag: 1,
                    is_default: 1,
                    is_last_used: 1,
                    createdAt: 1,
                    country: {
                        $cond: {
                            if: { $eq: ["$countryDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$countryDetails.uid"},
                                title: { $first:"$countryDetails.title"},
                            },
                        }
                    },
                    state: {
                        $cond: {
                            if: { $eq: ["$stateDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$stateDetails.uid"},
                                title: { $first:"$stateDetails.title"},
                                country: { $first:"$stateDetails.country"},
                                // shipping_charge: { $first:"$stateDetails.shipping_charge"},
                            },
                        }
                    },
                    district: {
                        $cond: {
                            if: { $eq: ["$districtDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$districtDetails.uid"},
                                title: { $first:"$districtDetails.title"},
                                state: { $first:"$districtDetails.state"},
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
                    from: "Country",
                    localField: "country",
                    foreignField: "uid",
                    as: "countryDetails",
                }
            },
            {
                $lookup: {
                    from: "State",
                    localField: "state",
                    foreignField: "uid",
                    as: "stateDetails"
                }
            },
            {
                $lookup: {
                    from: "District",
                    localField: "district",
                    foreignField: "uid",
                    as: "districtDetails"
                }
            },    
            {
                $project: {
                    uid: 1,
                    name: 1,
                    first_name: 1,
                    middle_name: 1,
                    last_name: 1,
                    email: 1,
                    phone: 1,
                    country_code: 1,
                    address: 1, 
                    address_line_1: 1,
                    address_line_2: 1,
                    street: 1,
                    landmark: 1,
                    area: 1,
                    city: 1,
                    pincode: 1,
                    whatsapp_number: 1,
                    whatsapp_number_country_code: 1,
                    is_whatsapp_messaging_agreed: 1,
                    tag: 1,
                    is_default: 1,
                    is_last_used: 1,
                    createdAt: 1,
                    country: {
                        $cond: {
                            if: { $eq: ["$countryDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$countryDetails.uid"},
                                title: { $first:"$countryDetails.title"},
                            },
                        }
                    },
                    state: {
                        $cond: {
                            if: { $eq: ["$stateDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$stateDetails.uid"},
                                title: { $first:"$stateDetails.title"},
                                country: { $first:"$stateDetails.country"},
                                // shipping_charge: { $first:"$stateDetails.shipping_charge"},
                            },
                        }
                    },
                    district: {
                        $cond: {
                            if: { $eq: ["$districtDetails", []] },
                            then: null,
                            else: {
                                uid: { $first:"$districtDetails.uid"},
                                title: { $first:"$districtDetails.title"},
                                state: { $first:"$districtDetails.state"},
                            },
                        }
                    },
                }
            } 
        ]

        return agg
    },
}