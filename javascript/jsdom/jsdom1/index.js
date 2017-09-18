/**
 * Sample JSDOM application in nodeJS
 */


const jsdom    = require('jsdom');
const beautify = require('js-beautify').html_beautify;

/** Create a new DOM from jsDOM */
let domParser = new jsdom.JSDOM();

//console.log(domParser);

/** Get the JSDOM window and document objects */
let window   = domParser.window;
let document = window.document;

//console.log(domParser.serialize());

//let head = document.getElementsByTagName("head")[0];
//let body = document.getElementsByTagName("body")[0];
let head = document.head;
let body = document.body;

/** Set the HTML title */
let title = document.createElement("title");
title.innerHTML = "JSDOM Sample";
head.appendChild(title);

let heading = document.createElement("h1");
heading.innerHTML = "This is the heading";

body.appendChild(heading);

let div = document.createElement("div");

div.innerHTML = "And this text is in the div element";

let table = document.createElement("table");

table.setAttribute("id", "data-table");
table.setAttribute("border", "1");

table.innerHTML = "<tr><td>Column 1</td><td>Column 2</td></tr>";

div.appendChild(table);
body.appendChild(div);

console.log(beautify(domParser.serialize(),
    {
        "indent_size": 4,
    }));
