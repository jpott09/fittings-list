// imports
import { Network } from "./js/network.js";
import { Display } from "./js/display.js";
// paths
const base = `/${location.pathname.split('/')[1]}`;
const fittings_path = `${base}/data/Fittings.json`;
// elements
// data
(async () => {
    const data = await Network.jsonRequest(fittings_path);
    const display = new Display(document, data);
})();