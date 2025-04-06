// imports
import { Network } from "./network.js";
import { Display } from "./display.js";
// paths
const base = `/${location.pathname.split('/')[1]}`;
const fittings_path = `${base}/data/`;
const fittings_1 = `${fittings_path}inch_half_fittings.json`;
console.log(`Fittings path 1: ${fittings_1}`);
const fittings_2 = `${fittings_path}two_inch_fittings.json`;
console.log(`Fittings path 2: ${fittings_2}`);
const fittings_3 = `${fittings_path}three_inch_fittings.json`;
console.log(`Fittings path 3: ${fittings_3}`);
// data
const data_1 = await Network.jsonRequest(fittings_1);
const data_2 = await Network.jsonRequest(fittings_2);
const data_3 = await Network.jsonRequest(fittings_3);
const data = [data_1,data_2,data_3]
// flags
const WIPE_STORAGE = false
const display = new Display(document, data,WIPE_STORAGE);