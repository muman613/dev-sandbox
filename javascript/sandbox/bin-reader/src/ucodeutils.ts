/**
 * Microcode Utilities module
 */

import * as fs from 'fs';
import { segmentHash, segmentType, symbolHash, ucodeFile, ucodeObject } from './binloader';
import { segtypeToString, stringToSegtype } from './binloader';

const sprintf = require('sprintf-js').sprintf

/**
 * Dump all symbols in the ucode object
 *
 * @param obj
 * @param type
 */
export function dumpSymbols(of: any, obj: ucodeObject, type: segmentType): void {
    let segTable: segmentHash

    switch (type) {
        case segmentType.code:
            segTable = obj.symbols.pm
            break
        case segmentType.data:
            segTable = obj.symbols.dm
            break
        case segmentType.dmacode:
            segTable = obj.symbols.dram
            break
        default:
            segTable = {}
            break
    }

    Object.keys(segTable).forEach((seg) => {
        const symTable = segTable[seg]
        const hline    = "-".repeat(80)

        of.write(hline + '\n')
        of.write('SEGMENT : ' + seg + '\n')
        of.write(hline + '\n')

        Object.keys(symTable).forEach((sym) => {
          of.write("\tSymbol " + sym + " = " + symTable[sym].toString(16) + "\n")
        })
    })

    return
}

export function scanSourceFile(sourceObj: ucodeFile): boolean {
    console.log('scanSourceFile(%s)', sourceObj.ucPath)

    const outstream = fs.createWriteStream('/tmp/scan.log')
    /** Run through all the lines in the source object */

    for (const line of sourceObj.lines) {
        if ((line.segType === segmentType.code) ||
            (line.segType === segmentType.dmacode)) {
            const cregex = /^(.*)\/\/(.*)/

            const matches = line.source.match(cregex)
            // if (matches) {
            //     debugger
            // }
            const msg = sprintf('%03d : %-8s : %s',
                                line.lineNo,
                                segtypeToString(line.segType),
                                line.source)
            console.log(msg)
        }
    }

    outstream.end()

    return true
}

export interface fileSegStats {
    code: number
    data: number
    dmacode: number
    dmadata: number
}

/**
 *  Return an object of fileSegStats for a file.
 *
 * @export
 * @param {ucodeFile} obj
 * @returns {fileSegStats}
 */
export function getFileSegStats(obj: ucodeFile): fileSegStats {
    const stats: fileSegStats = {
        code: 0,
        data: 0,
        dmacode: 0,
        dmadata: 0,
    }
    const segmentArray = obj.getSegmentArray()

    for (const seg of segmentArray) {
        switch (seg.type) {
            case segmentType.code:
                stats.code += 1
                break
            case segmentType.data:
                stats.data += 1
                break
            case segmentType.dmacode:
                stats.dmacode += 1
                break
            case segmentType.dmadata:
                stats.dmadata += 1
                break
        }
    }

    return stats
}