// imports
import { Network } from "./network.js";
import { Display } from "./display.js";
// paths
const fittings_path = "../data/Fittings.json";
// elements
// data
let display = new Display(document,await Network.jsonRequest(fittings_path));