'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const md5    = require('./md5');

//let pathBase = "";

/**
 * 
 * @param {string} path 
 * @returns {promise}
 */
function getPathHash(pathToSearch) {
    return new Promise((resolve, reject) => {
        let absPath = path.resolve(pathToSearch)
//      pathBase = absPath;

        console.log("getPathHash(" + absPath + ")")

        fs.readdir(absPath, (err, files) => {
            let hashMap = {}
            console.log("Got files!")
            files.forEach((file) => {
                let fullpath = path.format( {
                    dir: absPath,
                    base: file
                })

                let status   = fs.statSync(fullpath)

                if (status.isFile()) {
                    let pathHash = md5(fullpath)

                    console.log(fullpath)
                    console.log(pathHash)

                    hashMap[pathHash] = { 
                        fullPath: fullpath, 
                        fileName: file
                    };
                } else if (status.isDirectory()) {
                    console.log("-- found directory!")
                }
            })
            resolve(hashMap)
        })
    })
}

module.exports = getPathHash
