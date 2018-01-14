
'use strict'

const fs        = require('fs')
const path      = require('path')
const gm        = require('gm').subClass( { imageMagick: true } );

const debug = false

/**
 * mediaPathHash
 *
 * @param {any} pathHash
 * @returns {promise}
 */
function mediaPathHash(pathHash) {
    return new Promise((resolve, reject) => {
        let newHash = {}
        let keys = Object.keys(pathHash);
        let keyCount = keys.length;
        let keysRemaining = keyCount;

        for (let i = 0 ; i < keyCount ; i++) {
            let key      = keys[i]
            let fullPath = pathHash[key].fullPath

//            console.log("Processing key " + key + " " + fullPath)

            gm(fullPath).identify((err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    pathHash[key].geometry = data['Geometry']
                    pathHash[key].mimeType = data['Mime type']

                    if (--keysRemaining == 0) {
                        resolve(pathHash)
                    }
                }
            })
        }
    })
}

module.exports = mediaPathHash
