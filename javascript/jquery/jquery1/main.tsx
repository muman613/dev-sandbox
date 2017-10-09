/**
 * 
 */

import * as $ from "jquery";

$(document).ready( () => {
    console.log("Document ready!");
    $("#main-div").html("Welcome back Mr Black...");
    $("#main-div").click(() => {
        console.log("Clicked text");
    });
});
