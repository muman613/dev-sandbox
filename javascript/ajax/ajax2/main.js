/**
 * Example AJAX load of JSON data from config-server
 */

const tableify = require('tableify');

window.onload = function (e) {
    console.log("window.onload()");

    let divElement = document.getElementById('output');

    console.log("OK");
    divElement.innerHTML = "<center><h3>Loading configuration files</h3></center>";

    document.getElementById('refreshButton').onclick = function (e) {
        console.log("Refresh Button clicked!");
        refreshList();
        return false;
    };

    function getJSONData() {
        return new Promise((res, rej) => {
            let req = new XMLHttpRequest();

            req.onerror = function(e) {
                console.log("request error!");
                rej(e);
            }

            req.onreadystatechange = function() {
                if ((req.readyState == 4) && (req.status == 200)) {
                    console.log("received AJAX data!");
                    let jsonData = JSON.parse(req.responseText);
    //                onJsonLoad(jsonData);
                    res(jsonData);
                }
                //console.log("state change");
            }

            req.open("GET", "http://localhost:3000/config/files", true);
            req.send();
        });
    }

    function refreshList() {
        /** Request JSON data from the config-server */
        getJSONData().then((configJson) => {
            let htmlTable = tableify(configJson, [ 'fileName', "description" ]);
            console.log("loaded");
            //console.log(configJson);

            divElement.innerHTML = htmlTable;

            //console.log(tableify(configJson));
        }).catch((e) => {
            console.log("Caught promise rejection!");
            divElement.innerHTML = "<center><h3>Unable to connect to config server</h3></center>";
        });
    }

    refreshList();
}