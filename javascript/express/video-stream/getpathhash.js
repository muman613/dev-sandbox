
'use strict';

const fs        = require('fs');
const path      = require('path');
const crypto    = require('crypto');
const md5       = require('./md5');
const recursive = require('recursive-readdir');

const debug = false;

let selectFilePattern = new Array();

/**
 *
 * @param {string} file
 * @param {stats} stat
 */
function ignoreFile(file, stat) {
    let extName = path.extname(file)

    if (stat.isDirectory()) {
        return false
    }

    for (let i = 0 ; i < selectFilePattern.length ; i++) {
        if (selectFilePattern[i] == extName) {
            return false;
        }
    }
    // selectFilePattern.forEach((pat) => {
    //     if (pat == extName) {
    //         return false
    //     }
    // })
    // if (extName == ".jpg") {
    //     return false;
    // }

    return true
}

/**
 *
 * @param {string} path
 * @returns {promise}
 */
function getPathHash(pathToSearch, pattern) {
    selectFilePattern = pattern;

    return new Promise((resolve, reject) => {
        let absPath = path.resolve(pathToSearch)
//      pathBase = absPath;

        console.log("getPathHash(" + absPath + ")")

        recursive(absPath, [ ignoreFile ], (err, files) => {
            if (err) {
                if (debug == true) {
                    console.log(err)
                }
                reject(err)
            } else {
                let hashMap = {}
                //console.log("Got files!")
                files.forEach((fullpath) => {
                    // let fullpath = path.format( {
                    //     dir: absPath,
                    //     base: file
                    // })

                    let status   = fs.statSync(fullpath)

                    // if (status.isFile()) {
                        let pathHash = md5(fullpath)

                        if (debug == true) {
                            console.log(pathHash + " : " + fullpath)
                        }

                        hashMap[pathHash] = {
                            fullPath: fullpath,
                            fileName: path.basename(fullpath),
                            fileSize: status.size
                        };
    //                }
                })
                resolve(hashMap)
            }
        })
    })
}

module.exports = getPathHash
