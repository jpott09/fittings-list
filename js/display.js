import { Fittings } from "js/fittings.js";
import { Storage } from "js/storage.js";

export class Display{
    body = null;
    constructor(document,fittings_json){
        this.selected_fitting = null;
        this.body = document.body;
        this.document = document;
        this.fittings = new Fittings(fittings_json);
        this.storage = new Storage();
        this.list_key = "list";
        // try to load existing list from localStorage
        let data = this.storage.readStorage(this.list_key);
        this.fittings_list = data || {};
        // enter display loop
        this.viewList();
    }
    // UTILITY METHODS
    clearBody(){
        this.body.innerHTML = "";
    }
    createBackButton(callback, arg){
        // create back button
        const back_button = this.document.createElement('button');
        back_button.textContent = "<- Back";
        back_button.classList.add("nav-button");
        back_button.onclick = () => callback.call(this,arg);
        this.body.appendChild(back_button);
    }
    getFittingText(fitting,newline = true){
        let text = "";
        let size_string = String(fitting.size).replace(".5","-1/2")
        if(fitting.sizes.length === 1){
            text = `${fitting.type} (${size_string}")`;
        }else{
            const sizes = fitting.sizes;
            if(newline){
                text = `${fitting.type}<br>(${sizes[0]}"`;
            }else{
                text = `${fitting.type} (${sizes[0]}`;
            }
            for(let i = 1; i < sizes.length; i++){
                text += ` x ${String(sizes[i]).replace(".5","-1/2")}`;
            }
            text = `${text}")`;
        }
        return text;
    }
    getKeyCount(json){
        return Object.keys(json).length;
    }
    // DISPLAY METHODS
    viewList(){
        // display items in list
        this.clearBody();
        // get key count of json
        const count = this.getKeyCount(this.fittings_list);
        // if list is empty
        if(count === 0){
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
            button.textContent = "Add to List ->";
            button.classList.add("add-button");
            button.onclick = () => this.sizeSelect();
            this.body.appendChild(button);
            // we have list items; Display them
            for (const [key,value] of Object.entries(this.fittings_list)){
                const label = this.document.createElement('label');
                label.textContent = `[${value}] ${key}`;
                label.classList.add("unpicked");
                label.onclick = () => {
                    if(label.classList.contains("unpicked")){
                        label.classList.remove("unpicked");
                        label.classList.add("picked");
                    }else{
                        label.classList.remove("picked");
                        label.classList.add("unpicked");
                    }
                }
                this.body.appendChild(label);
            }
            // add a button to clear the list
            const clrbutton = this.document.createElement('button');
            clrbutton.textContent = "Clear List";
            clrbutton.classList.add("clear-button");
            clrbutton.onclick = () => {
                if(confirm("Clear this list?")){
                    this.fittings_list = {};
                    this.storage.writeStorage(this.list_key,this.fittings_list);
                    this.viewList();
                }
            }
            this.body.appendChild(clrbutton);
        }
    }
    sizeSelect(){
        // display size options
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
            const int_size = size;
            size = String(size).replace('.5','-1/2');
            button.textContent = `${size}"`;
            button.onclick = () => this.fittingSelect(int_size);
            this.body.appendChild(button);
        });
    }
    fittingSelect(size){
        // clear display
        this.clearBody();
        // create back button
        this.createBackButton(this.sizeSelect);
        // get all fittings of the size selected
        const matching_sizes = this.fittings.getFittingsBySize(size);
        matching_sizes.forEach(fitting => {
            const button = this.document.createElement('button');
            const text = this.getFittingText(fitting);
            button.innerHTML = text;
            // color the background based on text
            if(text.includes("22")){ button.classList.add("twentytwo"); }
            if(text.includes("45")){ button.classList.add("fortyfive"); }
            if(text.includes("90")){ button.classList.add("ninety"); }
            if(text.includes("tee")){ button.classList.add("tee"); }
            button.onclick = () => this.addFitting(fitting,1);
            this.body.appendChild(button);
        });
        // back button at end of list
        this.createBackButton(this.sizeSelect);
    }
    addFitting(fitting,quantity){
        // clear body
        this.clearBody();
        // show back button
        this.createBackButton(this.fittingSelect,fitting.size);
        // show fitting name
        const label = this.document.createElement('label');
        const fitting_text = this.getFittingText(fitting,false);
        label.textContent = fitting_text;
        this.body.appendChild(label);
        // show quantity
        const label_quantity = this.document.createElement('label');
        label_quantity.textContent = `Quantity: ${quantity}`;
        this.body.appendChild(label_quantity);
        // show plus symbol
        const button = this.document.createElement('button');
        button.textContent = "+";
        button.onclick = () => {
            this.addFitting(fitting,quantity+1);
        };
        this.body.appendChild(button);
        // show minus symbol
        const button2 = this.document.createElement('button');
        button2.textContent = "-";
        button2.onclick = () => {
            if(quantity > 1){
                this.addFitting(fitting,quantity-1);
            }
        }
        if(quantity === 1){
            button2.disabled = true;
        };
        this.body.appendChild(button2);
        // show add button
        const button3 = this.document.createElement('button');
        button3.classList.add("add-button");
        button3.textContent = "Add";
        button3.onclick = () => {
            // add or update the fitting list with quantity
            if (!this.fittings_list[fitting_text]) {
                this.fittings_list[fitting_text] = quantity;
            } else {
                this.fittings_list[fitting_text] += quantity;
            }
            // save the updated fittings list to local storage
            this.storage.writeStorageObject(this.list_key,this.fittings_list);
            // return to fitting select
            this.sizeSelect();
        }
        this.body.appendChild(button3);
    }

}