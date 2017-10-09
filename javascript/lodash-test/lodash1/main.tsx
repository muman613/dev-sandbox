/**
 * main.js
 */

import * as _ from 'lodash';


window.onload = () => {
    console.log("onload");

    let dataDivEl : HTMLElement | null = document.getElementById("data-div");

    let array = [ 
            "a",
            "b",
            "c",
            "d"
        ];
    
    _.forEach(array, (value) => {
        console.log("value = " + value);
        if (dataDivEl)
            dataDivEl.innerHTML += value + "<br>";
    });
}