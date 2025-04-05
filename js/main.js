// imports
import { Network } from "./network.js";
import { Display } from "./display.js";
// paths
const base = `/${location.pathname.split('/')[1]}`;
const fittings_path = `${base}/data/Fittings.json`;
// elements
// data
const data = await Network.jsonRequest(fittings_path);
const display = new Display(document, data);