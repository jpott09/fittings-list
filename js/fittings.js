export class Fittings{
    constructor(data_list) {
        if (!Array.isArray(data_list) || data_list.length === 0) {
            console.error("The data list passed to Fittings class has no elements");
            return;
        }

        const hasEmptyItem = data_list.some(item => Object.keys(item).length === 0);
        if (hasEmptyItem) {
            console.error("One of the json objects in the data list passed to Fittings class is empty");
            return;
        }

        this.data_list = data_list;
        console.log("Fittings initialized");
    }
    getAvailableSizes(){
        // returns a list of sizes [1.5,2,3] etc
        return [...new Set(this.data_list.map(item => item.size))];
    }
    getGroupNamesBySize(size) {
        // returns a list of group names ["90","45","22"] etc
        for (const item of this.data_list) {
            if (item.size === parseFloat(size)) {
                let categories = [];
                for (const group of item.groups) {
                    for (const key of Object.keys(group)) {
                        categories.push(key);
                    }
                }
                return categories;
            }
        }
        return [];
    }
    getUniqueFittingsBySize(size) {
        // returns a list of fitting objects, {"name", "short name"}
        for (const item of this.data_list) {
            if (item.size === parseFloat(size)) {
                return item.unique;
            }
        }
        return [];
    }
    getGroupFittings(size,group_name){
        for (const item of this.data_list) {
            if(item.size === parseFloat(size)) {
                let fittings = [];
                for (const group of item.groups) {
                    for (const key of Object.keys(group)) {
                        if(key === String(group_name)){
                            fittings = group[key];
                        }
                    }
                }
                return fittings;
            }
        }
        return [];
    }
}