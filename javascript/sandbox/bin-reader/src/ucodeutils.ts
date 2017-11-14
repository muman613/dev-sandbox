/**
 * Microcode Utilities module
 */

import * as fs from 'fs';
import { segmentHash, segmentType, symbolHash, ucodeFile, ucodeLine, ucodeObject } from './binloader';
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

function isLineCode(line: ucodeLine): boolean {
    let result = false

    if ((line.segType === segmentType.code) ||
        (line.segType === segmentType.dmacode)) {
        result = true
    }

    return result
}

function findNextCodeLineIndex(sourceObj: ucodeFile, curLine: number): number {
    const maxLen = sourceObj.lines.length

    if (curLine >= maxLen) {
        return -1
    }

    for (let i = curLine + 1  ; i < maxLen ; i++) {
        if (isLineCode(sourceObj.lines[i])) {
            return i
        }
    }

    return -1
}

/**
 * Test if this line loads data from memory
 *
 * @param {string} sourceLine
 * @returns {(string | null)}
 */

function isLoadReg(sourceLine: string): string | undefined {
    let result: string|undefined
    const regEx = /(a\d{1,2}a?\d{0,2}?)\s*=\s*\[(.*)\]/
    const matches = sourceLine.match(regEx)

    if (matches) {
        result = matches[1].trim()
    }

    return result
}

/**
 * Test if this line saves data from memory
 *
 * @param {string} sourceLine
 * @returns {(string | null)}
 */
function isSaveReg(sourceLine: string): string | undefined {
    let result: string | undefined
    const regEx = /\[(.*)\]\s*=\s*(a\d{1,2}a?\d{0,2})/
    const matches = sourceLine.match(regEx)

    if (matches) {
        result = matches[2].trim()
    }

    return result
}

function getRegisterPairArray(reg: string): string[]|undefined {
    let pairs: string[] | undefined
    const regex = /(a\d{1,2})(a\d{1,2})?\s/

    const matches = reg.match(regex)

    if (matches) {
        pairs = matches
    }

    return pairs
}


interface scanContext {
//  curIndex: number,
    lastLineNo: number
    inMacro: boolean
    macroName: string|undefined
    curLoadReg: string|undefined
    curSaveReg: string|undefined
    lastLoadReg: string|undefined
    lastSaveReg: string|undefined
}

export function scanSourceFile(sourceObj: ucodeFile): boolean {
    console.log('scanSourceFile(%s)', sourceObj.ucPath)

    const outstream = fs.createWriteStream('/tmp/scan.log')

    const context: scanContext = {
        curLoadReg: undefined,
        curSaveReg: undefined,
        inMacro: false,
        lastLineNo: -1,
        lastLoadReg: undefined,
        lastSaveReg: undefined,
        macroName: undefined,
    }

    // let lastLineNo: number = -1
    // let inMacro: boolean = false
    // let loadedReg: string|null
    // let savedReg: string|null

    /** Run through all the lines in the source object */
//    for (const line of sourceObj.lines) {
    for (let index = 0 ; index < sourceObj.lines.length ; index++) {
        const line: ucodeLine = sourceObj.lines[index]

        if ((line.segType === segmentType.code) ||
            (line.segType === segmentType.dmacode)) {
            const cregex = /^(.*)\/\/(.*)/

            // if (matches) {
            //     debugger
            // }

            if (!context.inMacro) {
                /**
                 * Check the next line, if the line # is the same then we are
                 * in a macro.
                 */
                const nextCodeIndex = findNextCodeLineIndex(sourceObj, index)
                if (nextCodeIndex !== -1) {
                    if (sourceObj.lines[nextCodeIndex].lineNo === line.lineNo) {
                        const matches = line.source.match(cregex)
                        context.macroName = "N/A"

                        if (matches !== null) {
                            context.macroName = matches[2].trim()
                        } else {
                            /**
                             * Sometimes the macro name is obfuscated becaue of a bug
                             * in the SPADE macro expansion code. Usually the next
                             * line of the macro will have the correct name.
                             */
                            const nextLineCheck = sourceObj.lines[nextCodeIndex].source.match(cregex)
                            if (nextLineCheck) {
                                context.macroName = nextLineCheck[2].trim()
                            }
                        }

                        // console.log("looks like beginning of macro " +
                        //              macroName + " invoked @ array index " +
                        //              nextCodeIndex)
                        context.inMacro = true
                    } else {
                        context.inMacro = false
                    }
                } else {
                    // console.log("Looks like we are near end of source lines!")
                    context.inMacro = false
                }
            } else {
                if (line.lineNo !== context.lastLineNo) {
                    // console.log("Looks like end of macro @ array index " + index)
                    context.inMacro = false
                }
            }

            context.curLoadReg  = isLoadReg(line.source)
            context.curSaveReg  = isSaveReg(line.source)

            if (context.curLoadReg) {
                console.log("loaded register " + context.curLoadReg + " on line " + line.lineNo + "/" + index)

                const reg = getRegisterPairArray(context.curLoadReg)
                console.log(reg)
            }

            if (context.curSaveReg) {
                console.log("saved register " + context.curSaveReg  + " on line " + line.lineNo + "/" + index)
                const reg = getRegisterPairArray(context.curSaveReg)
                console.log(reg)
            }

            console.log(context)

            const msg = sprintf('%-24s : %03d : %-8s : %s : %s',
                                line.file,
                                line.lineNo,
                                segtypeToString(line.segType),
                                (context.inMacro === true) ? "M" : " ",
                                line.source)
            // console.log(msg)
            outstream.write(msg + '\n')

            context.lastLineNo  = line.lineNo
            context.lastLoadReg = context.curLoadReg
            context.lastSaveReg = context.curSaveReg
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
