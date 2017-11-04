/**
 *
 */
import { scanSourceFile } from './src/ucodeutils';
import * as fs from 'fs';
import { binLoader, segmentType } from './src/binloader'
import './src/ucodeutils';

const sprintf = require('sprintf-js').sprintf
const program = require('commander')

const stdout = process.stdout

program
    .version('1.0.0')
    .option('-i, --input <ucode_file>')
    .option('-o, --output <output_file>')
    .option('-f, --file <source_file>')
    .parse(process.argv)

const binFilename = program.input
const outFilename = program.output
const sourceFile  = program.file

const loader = new binLoader()

//loader.debug = true

console.log("Opening bin file @ " + binFilename)

loader.loadBinFile(binFilename).then((obj) => {
    // let stream : any = null

    // if (outFilename) {
    //     stream = fs.createWriteStream(outFilename)
    // } else {
    //     stream = process.stdout
    // }

    console.log('microcode loaded!')
//    dumpSymbols(stream, obj, segmentType.code)

//  console.log(obj.getFileArray())

    if (sourceFile) {
        const sourceObj = obj.getFileByName(sourceFile)

        // for (const line of sourceObj.lines) {
        //     const sLine = sprintf('%03d : %s', line.lineNo, line.source)
        //     console.log(sLine)
        // }

        scanSourceFile(sourceObj)
    } else {
        const fileArray = obj.getFileArray()

        for (const fileName of fileArray) {
            console.log(" " + fileName)
        }
    }

    //console.log(loaderSrc)
}).catch((err) => {
    console.log("Caught exception : " + err)
})
