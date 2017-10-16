'use strict'

const fs          = require('fs')
const path        = require('path')
const getPathHash = require('./getpathhash')
const program     = require('commander')

program
    .version('1.0.0')
    .option('-p --path <directory>', 'Path to scan')
    .parse(process.argv)

let scanPath = program.path; // "C:\\Users\\muman\\OneDrive\\Pictures\\"

let pathHashPromise = getPathHash(scanPath,
                                  [ ".jpg", ".mp4" ])

pathHashPromise.then((pathHash) => {
    console.log("promise filled!")
    //console.log(pathHash);

    Object.keys(pathHash).forEach((hash) =>{
        console.log("Hash " + hash + " -> " + pathHash[hash].fullPath)
    })

}).catch((err) => {
    console.log("Error encountered!")
    console.log(err)
})