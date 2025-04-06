import { Fittings } from "./fittings.js";
import { Storage } from "./storage.js";

export class Display{
    body = null;
    constructor(document,data_list,wipe_storage=false){
        this.body = document.body;
        this.document = document;
        this.fittings = new Fittings(data_list);
        this.storage = new Storage();
        this.list_key = "list";
        // wipe storage if set
        if(wipe_storage){this.storage.writeStorageObject(this.list_key,null)};
        // try to load existing list from localStorage
        let data = this.storage.readStorage(this.list_key);
        this.fittings_list = data || [];
        // enter display loop
        this.viewList();
    }
    // UTILITY METHODS
    clearBody(){
        this.body.innerHTML = "";
    }
    createBackButton(callback, ...args){
        // create back button
        const back_button = this.document.createElement('button');
        back_button.textContent = "<- Back";
        back_button.classList.add("nav-button");
        back_button.onclick = () => callback.call(this,args);
        this.body.appendChild(back_button);
    }
    // DISPLAY METHODS
    viewList(){
        // display items in list
        this.clearBody();
        // if list is empty
        if(this.fittings_list.length === 0){
            const label = this.document.createElement("label");
            label.textContent = "No list items";
            this.body.appendChild(label);
            // create a button to go to size Select
            const button = this.document.createElement('button');
            button.textContent = "Start List ->";
            button.classList.add("add-button");
            button.onclick = () => this.sizeSelect();
            this.body.appendChild(button);
        }else{
            // button to add to this list
            const button = this.document.createElement('button');
            button.textContent = "Add Fittings ->";
            button.classList.add("add-button");
            button.onclick = () => this.sizeSelect();
            this.body.appendChild(button);
            /*
            format:
            {
                "name": fitting["name"],
                "short name": fitting["short name"],
                "quantity": quantity
            }
            */
            this.fittings_list.forEach(entry => {
                const label = this.document.createElement('label');
                label.classList.add("unpicked");
                label.textContent = entry["short name"];
                label.onclick = () => {
                    label.classList.toggle("unpicked");
                    label.classList.toggle("picked");
                };
                this.body.appendChild(label);
            })
            // add a button to clear the list
            const clrbutton = this.document.createElement('button');
            clrbutton.textContent = "Clear List";
            clrbutton.classList.add("clear-button");
            clrbutton.onclick = () => {
                if(confirm("Clear this list?")){
                    this.fittings_list = [];
                    this.storage.writeStorageObject(this.list_key,this.fittings_list);
                    this.viewList();
                }
            }
            this.body.appendChild(clrbutton);
        }
    }
    sizeSelect(){
        this.clearBody();
        // show button to view list
        const list_button = this.document.createElement('button');
        list_button.classList.add('add-button');
        list_button.textContent = "<- View List";
        list_button.onclick = () => this.viewList();
        this.body.appendChild(list_button);
        this.fittings.getAvailableSizes().forEach(size => {
            // create the size buttons
            const button = this.document.createElement('button');
            const float_size = size;
            size = String(size).replace('.5','-1/2');
            button.textContent = `${size}"`;
            button.onclick = () => this.fittingSelect(float_size);
            this.body.appendChild(button);
        });
    }
    fittingSelect(size){
        this.clearBody();
        // create back button
        this.createBackButton(this.sizeSelect);
        // get all group names (22,45,90,tee,etc)
        let group_names = this.fittings.getGroupNamesBySize(size);
        if(group_names.length === 0){console.error(`display.fittingSelect(${size}) received no group names from fittings.GetGroupNamesBySize(${size})`)}
        group_names.forEach(group_name => {
            const group_button = this.document.createElement('button');
            group_button.classList.add("group-name");
            group_button.textContent = group_name;
            group_button.onclick = () => this.showGroupFittings(size,group_name);
            this.body.appendChild(group_button);
        });
        // get all unique fittings
        let unique_fittings = this.fittings.getUniqueFittingsBySize(size);
        unique_fittings.forEach(unique_fitting => {
            const fitting_button = this.document.createElement('button');
            fitting_button.classList.add("fitting-name");
            fitting_button.textContent = unique_fitting.name;
            fitting_button.onclick = () => this.addFitting(size,unique_fitting,1);
            this.body.appendChild(fitting_button);
        });
        // back button at end of list
        this.createBackButton(this.sizeSelect);
    }
    showGroupFittings(size,group_name){
        this.clearBody();
        // show back button
        this.createBackButton(this.sizeSelect,size);
        // get group fittings
        let group_fittings = this.fittings.getGroupFittings(size,group_name);
        if(group_fittings.length === 0){console.error(`Display.showGroupFittings(${size},${group_name}) received an empty list from Fittings.getGroupFittings(${size},${group_name})`)};
        group_fittings.forEach(fitting => {
            const button = this.document.createElement('button');
            button.classList.add("fitting-name");
            button.textContent = fitting.name;
            button.onclick = () => this.addFitting(size,fitting,1,group_name);
            this.body.appendChild(button);
        });
    }
    addFitting(size,fitting,quantity,group_name=null){
        this.clearBody();
        // show back button (return to group or size depending on passed group argument)
        if(group_name){
            this.createBackButton(this.showGroupFittings,size,group_name);
        }else{
            this.createBackButton(this.fittingSelect,size);
        }
        // show fitting name
        const label = this.document.createElement('label');
        label.textContent = fitting["name"];
        this.body.appendChild(label);
        // show quantity
        const label_quantity = this.document.createElement('label');
        label_quantity.textContent = `Quantity: ${quantity}`;
        this.body.appendChild(label_quantity);
        // show plus symbol
        const button = this.document.createElement('button');
        button.textContent = "+";
        button.onclick = () => {
            this.addFitting(size,fitting,quantity+1,group_name);
        };
        this.body.appendChild(button);
        // show minus symbol
        const button2 = this.document.createElement('button');
        button2.textContent = "-";
        button2.onclick = () => {
            if(quantity > 1){
                this.addFitting(size,fitting,quantity-1,group_name);
            }
        }
        if(quantity === 1){
            button2.disabled = true;
        }else{
            button2.disabled = false;
        };
        this.body.appendChild(button2);
        // show add button
        const button3 = this.document.createElement('button');
        button3.classList.add("add-button");
        button3.textContent = "Add";
        button3.onclick = () => {
            // add or update the fitting list with quantity
            let fitting_data = {
                "name": fitting["name"],
                "short name": fitting["short name"],
                "quantity": quantity
            }
            let existing = this.fittings_list.find(entry => entry.name === fitting_data.name && fitting_data["short name"] === entry["short name"]);
            if(existing){
                existing.quantity += fitting_data.quantity;
            }else{
                this.fittings_list.push(fitting_data);
            }
            // save the updated fittings list to local storage
            this.storage.writeStorageObject(this.list_key,this.fittings_list);
            // return to fitting select
            this.sizeSelect();
        }
        this.body.appendChild(button3);
    }

}