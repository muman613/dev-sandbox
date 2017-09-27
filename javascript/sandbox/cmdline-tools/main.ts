/**
 *
 */

import { XMLHttpRequest } from "xmlhttprequest";

function getConfigFiles() : Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        let req  = new XMLHttpRequest();

        req.addEventListener("load", () => {
            console.log("data loaded");
            resolve(JSON.parse(req.responseText));
        });

        req.open("GET", "http://localhost:3000/config/files");
        req.send();
    });
}

getConfigFiles().then((data) => {
    console.log(data);
});
