import { Obj } from "@/interface/common"

export default {
    basic: (f: Obj, p: Obj, _o: Obj) => {
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
    single: (f: Obj, _p: Obj, _o: Obj) => {
        let agg: Obj[] = [
            {
                $match:f
            },
            {
                $limit: 1
            }, 
        ]
        return agg
    },
    thrust: (_f: Obj, p: Obj, _o: Obj) => {
        let agg: Obj[] = [p]
        return agg
    },
}