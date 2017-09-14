/**
 * Parse the video microcode labels header file.
 */
"use strict";

import { ucodeLabels } from "./components/ucode-labels.js";

interface symbolEntry {
    symbol:     string;
    address:    number;
};

const readline  = require('readline');
const fs        = require('fs');
const commander = require('commander');

let headerFile : string = "";

commander
    .version('1.0.0')
    .option('-i, --header <file>', 'Header file')
    .option('-o, --output <file>', 'Output file')
    .parse(process.argv);

headerFile = commander.header;


function testStream(str : any) : void {
    str.write("This is a test!\n");
}

/**
 * 
 */

let outStream = process.stdout;

try {
    let headerParser = new ucodeLabels();

    headerParser.parseHeader(headerFile).then(() => {
        console.log("Found " + headerParser.size + " symbols!");
        headerParser.dump( outStream );
    });
} catch (e) {
    console.log("Caught an exception : " + e);
}
