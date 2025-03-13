/**
 * Generic String Operation
 * @author Fasil Paloli
 * @data 02-10-2022
 */

 class StringOperations {

    /**
     * Extract key value from a nested object by comparing an array
     * @param obj Object from the data to be extracted
     * @param compareArr Array of keys value to compare from
     * @returns Final restructured Object
     */
    public async getObjectByKey(obj:any, compareArr:any) {
        let result:any = {}
        const deepIterator = (target:any, compare:any):any => {
            Object.keys(target).forEach(key => {
                if(compare.includes(key)){
                    result[key] = target[key]
                }
                if (typeof target[key] === 'object' && target[key] !== null) {
                    deepIterator(target[key], compare)
                }
            })
        }
        await deepIterator(this.parseStringify(obj), compareArr)
        return result
    }
    
    /**
     * Parase Promise Objest to Travisable Object
     * @param obj 
     * @returns JSON Object
     */
    private parseStringify(obj:any){
        try {
            return JSON.parse(JSON.stringify(obj))
        } catch (error) {
            console.log({type:"Json Parse Error", error:error})
        }
    }
}

export default new StringOperations