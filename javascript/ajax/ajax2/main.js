/**
 * Example AJAX load of JSON data from config-server
 */

const tableify = require('tableify');

let divElement = document.getElementById('output');

console.log("OK");
divElement.innerHTML = "This is a test";

function getJSONData(onJsonLoad) {
    let req = new XMLHttpRequest();


    req.onreadystatechange = function() {
        if ((req.readyState == 4) && (req.status == 200)) {
            console.log("received AJAX data!");
            let jsonData = JSON.parse(req.responseText);
            onJsonLoad(jsonData);
        }
        //console.log("state change");
    }

    req.open("GET", "http://localhost:3000/config/files", true);
    req.send();
}

/** Request JSON data from the config-server */
getJSONData((configJson) => {
    let htmlTable = tableify(configJson, [ 'fileName', "description" ]);
    console.log("loaded");
    //console.log(configJson);

    divElement.innerHTML = htmlTable;

    //console.log(tableify(configJson));
});