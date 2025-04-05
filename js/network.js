export class Network{
    static async jsonRequest(url){
        try{
            const response = await fetch(url)
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch(err){
            console.error(err);
            return null;
        }
    }
}