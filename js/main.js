// imports
import { Network } from "js/network.js";
import { Display } from "js/display.js";
// paths
const fittings_path = "/fittings-list/data/Fittings.json";
// elements
// data
let display = new Display(document,await Network.jsonRequest(fittings_path));