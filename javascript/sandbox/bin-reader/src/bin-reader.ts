/**
 *
 */
import * as fs from 'fs';
import { binLoader, segmentType, segtypeToString } from './binloader';
import { fileSegStats, getFileSegStats, scanSourceFile } from './ucodeutils';
import './ucodeutils';

const sprintf = require('sprintf-js').sprintf
const program = require('commander')

const stdout = process.stdout

program
    .version('1.0.0')
    .option('-i, --input <ucode_file>',   'specify input file')
    .option('-o, --output <output_file>', 'specify output file')
    .option('-f, --file <source_file>',   'specify microcode module')
    .parse(process.argv)

const binFilename = program.input
const outFilename = program.output
const sourceFile  = program.file

// let ofs : any

// if (outFilename) {
//     ofs = fs.createWriteStream(outFilename)
// } else {
//     ofs = stdout
// }

const loader = new binLoader()

// loader.debug = true
let stream: any = null

if (outFilename) {
    stream = fs.createWriteStream(outFilename)
} else {
    stream = process.stdout
}

console.log("Opening bin file @ " + binFilename)

loader.loadBinFile(binFilename).then((obj) => {

    console.log('microcode loaded!')

    if (sourceFile) {
        const sourceObj = obj.getFileByName(sourceFile)
        if (sourceObj) {
            scanSourceFile(sourceObj)
        } else {
            console.log('Unable to find ' + sourceFile)
        }
    } else {
        const fileArray = obj.getFileArray()

        for (const fileName of fileArray) {
            const lineCount = obj.files[fileName].lineCount()
            const segArray = obj.files[fileName].getSegmentArray()

            const segStats : fileSegStats = getFileSegStats(obj.files[fileName])

            const output = sprintf("%-60s : %d", fileName, lineCount)
            stream.write(output + '\n')
            for (const seg of segArray) {
                const segDesc = sprintf("    %-50s - %s", seg.name, segtypeToString(seg.type))
                stream.write(segDesc + '\n')
            }
        }
    }
}).catch((err) => {
    console.log("Caught exception : " + err)
})

/**
 * Handle the exit condition by closing the output file stream..
 */
process.on('exit', () => {
//  console.log('exit')
    if (outFilename) {
        stream.end()
    }
})
