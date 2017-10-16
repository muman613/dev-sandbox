'use strict';

const getPathHash = require('./getpathhash');


let pathHashPromise = getPathHash(".");

pathHashPromise.then((pathHash) => {
    console.log("promise filled!")
})