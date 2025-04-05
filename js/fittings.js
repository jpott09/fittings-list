export class Fittings{
    constructor(fittings_json){
        if(Object.keys(fittings_json).length == 0){
            console.error("The fittings json passed to Fittings Class is invalid");
            return;
        }
        this.fittings = fittings_json;
        // success
        console.log("Fittings initialized");
    }
    filter(size_1,size_2=null,size_3=null){
        let matches = this.fittings.filter(f => f.size === size_1) || [];
        if(size_2 !== null){
            matches = matches.filter(f=> f.sizes?.includes(size_2));
        }
        if(size_3 !== null){
            matches = matches.filter(f=> f.sizes?.includes(size_3));
        }
        return matches || [];
    }
    getFittingsBySize(size){
        return this.fittings.filter(f => f.size === size) || [];
    }
    filterListBySize(filtered_list,size){
        return filtered_list.filter(f => f.sizes?.includes(size));
    }
    getAvailableSizes(){
        const sizes = new Set();
        this.fittings.forEach(el => sizes.add(el.size));
        return Array.from(sizes).sort();
    }
    /*
    the goal is to have the user select a number (1.5, 2 or 3)
    send that number through getFittingsBySize(size) and they are returned the matches
    if they then select a subsequent size filter, we run the returned matches through
    filterListBySize(matches,size) and they then get a further refined list.
    if they send that refined list through filterListBySize(filtered_list,size2) again,
    we can then narrow down and find, say, a 2 by 1-1/2 by 1-1/2 inch tee, with three function calls
        {
        "type": "tee",
        "size": 2,
        "sizes": [
            2,
            1.5,
            1.5
        ]
    },
    */
}