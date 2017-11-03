/**
 *
 */

import { binLoader } from './src/binloader'
const program = require('commander')

program
    .version('1.0.0')
    .option('-i, --input <ucode_file>')
    .parse(process.argv)

const binFilename = program.input

const loader = new binLoader()

//loader.debug = true

console.log("Opening bin file @ " + binFilename)
loader.loadBinFile(binFilename).then((obj) => {
    console.log(JSON.stringify(obj, null, 2))
}).catch((err) => {
    console.log("Caught exception : " + err)
})
