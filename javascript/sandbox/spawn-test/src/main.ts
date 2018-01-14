/**
 *
 */

// const { exec }  = require('child_process')

import * as fs from 'fs'
import { sourceLoader, ucodeObject } from './sourceloader'
import { dumpSourceToFile } from './utilitybox'

const program = require('commander')

/** Parse options */

program
    .version('1.0.0')
    .option('-p, --path <ucodePath>')
    .option('-f, --file <fileName>')
    .option('-o, --out <outFile>')
    .option('-t, --type [source|preproc|listing]')
    .parse(process.argv)

/** Check if user specified both path and file.. */
if ((!program.path) || (!program.file)) {
    console.log('no options specified')
    process.exit(-10)
}

const rmcflags: string = process.env.RMCFLAGS as string

const mruaPath: string      = program.path
const sourceFile: string    = program.file
const outFile: string       = program.out
const outType: string       = program.type

const loader = new sourceLoader(rmcflags, mruaPath)

if (outType === 'source') {
        loader.loadSourcecode(sourceFile).then((sourceLines: string[]) => {
            console.log(sourceLines)
            if (outFile) {
                console.log('writing to output file ' + outFile)
                fs.writeFileSync(outFile, sourceLines.join('\n'))
            }
        }).catch((err) => {
            console.log(err)
        })

} else if (outType === 'preproc') {
    loader.loadPreprocessedFile(sourceFile).then((sourceLines: string[]) => {
            console.log(sourceLines)
            if (outFile) {
                console.log('writing to output file ' + outFile)
                fs.writeFileSync(outFile, sourceLines.join('\n'))
            }
        }).catch((err) => {
            console.log(err)
        })
} else if (outType === 'listing') {
    loader.loadListingFile(sourceFile).then((obj: ucodeObject) => {
//        console.log(obj)
        loader.parseListingFile(obj).then((obj2: ucodeObject) => {
            console.log("Done")
        })
    }).catch((err) => {
        console.log(err);
    })
} else {
    console.log("Unknown type " + outType)
}

// cpp $RMCFLAGS -D__ASSEMBLY__=1  -I ../../../base/ -I ../../../hwdep_hwlib  main.asm
// cpp $RMCFLAGS -D__ASSEMBLY__=1 -DSX_INTERFACE=1 -DVDEC_VERSION=19
//     -DRMBUILD_USE_HWLIB_V2=1 -I ../../../base/ -I ../../../hwdep_hwlib  -fdirectives-only hd.asm
