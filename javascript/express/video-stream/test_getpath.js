'use strict';

const getPathHash = require('./getpathhash');


let pathHashPromise = getPathHash("C:\\Users\\muman\\OneDrive\\Pictures\\");

pathHashPromise.then((pathHash) => {
    console.log("promise filled!")
    //console.log(pathHash);

    Object.keys(pathHash).forEach((hash) =>{
        console.log("Hash " + hash + " -> " + pathHash[hash].fullPath);
    })

})