'use strict'

const fs            = require('fs')
const path          = require('path')
const getPathHash   = require('./components/getpathhash')
const mediaPathHash = require('./components/mediahash');
const program       = require('commander')

/** Get options from user. */
program
    .version('1.0.0')
    .option('-p --path <directory>', 'Path to scan')
    .option('-o --output <filename>', 'Output JSON file')
    .parse(process.argv)

let scanPath = program.path // "C:\\Users\\muman\\OneDrive\\Pictures\\"

if (scanPath == undefined) {
    program.help()
    process.exit(-1)
}
let pathHashPromise = getPathHash(scanPath,
                                  [ ".jpg", ".png", ".mp4" ])

pathHashPromise.then((pathHash) => {
    mediaPathHash(pathHash).then((pathHash) => {
        Object.keys(pathHash).forEach((hash) =>{
            console.log("Hash " + hash + " -> " + pathHash[hash].geometry + " " + pathHash[hash].fullPath)
        })

        if (program.output != undefined) {
            let outputFile = program.output;
            console.log("Writing output to " + outputFile);

            fs.writeFileSync(outputFile, JSON.stringify(pathHash, null, 2))
        }
    })
}).catch((err) => {
    console.log("Error encountered!")
    console.log(err)
})