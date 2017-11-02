/**
 * sourceloader.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { getFullPath }  from './utilitybox'
const { exec }  = require('child_process')

const useMaxBuffer = 2048 * 1024

enum segmentType {
    code,
    data,
}

// interface ucodeLine {
//     lineNo: number
//     segName: string
//     segType: segType

// }

/**
 *
 *
 * @export
 * @class ucodeLine
 */
export class ucodeLine {
    public lineNo: number
    public segName: string
    public segType: segmentType
    public source: string
    public file: string
    public offset: string
    public opCodes: string

    constructor(ln: number, segName: string,
                segType: segmentType, fn: string,
                ofs: string, code: string,
                src: string) {
        this.lineNo     = ln
        this.segName    = segName
        this.segType    = segType
        this.file       = fn
        this.offset     = ofs
        this.opCodes    = code
        this.source     = src
    }
}

export interface ucodeFile {
    ucPath: string
    lines: ucodeLine[]
}

export interface ucodeObject {
    [key: string]: ucodeFile
}

/**
 * Class used to loadPreprocessedFile pre-processed microcode
 *
 * @export
 * @class sourceLoader
 */
export class sourceLoader {
    private rmcflags: string
    private cwd: string
    private extraFlags: string = '-D__ASSEMBLY__=1 -DSX_INTERFACE=1 ' +
                                 '-DVDEC_VERSION=19 -DRMBUILD_USE_HWLIB_V2=1 ' +
                                 '-I ../../../base/ -I ../../../hwdep_hwlib ' +
                                 '-fdirectives-only'

    constructor(flags: string, cwd: string) {
        this.rmcflags = flags
        this.cwd      = cwd;
    }

    /**
     * Load source file passing source through C preprocessor.
     *
     * @param {string} sourceFile
     * @returns {Promise<string[]>}
     * @memberof sourceLoader
     */
    public loadPreprocessedFile(sourceFile: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const fullPath: string = path.normalize(path.format({
                base: sourceFile,
                dir: this.cwd,
                ext: 'ignored',
                name: 'ignored',
                root: '/ignored',
            }))

            const command = 'cpp ' + this.rmcflags + ' ' + this.extraFlags + ' ' + sourceFile

            if (!fs.existsSync(fullPath)) {
                reject( new Error('File Not Found: ' + fullPath) )
            } else {

                exec(command,
                    { cwd: this.cwd, maxBuffer: useMaxBuffer }, /* options */
                    (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
                        if (error) {
    //                      console.log(error)
                            reject(error)
                        } else {
                            const   stringBuffer = stdout.toString().replace(/\/\*.*[\s\S]+\*\//gm, 'XXXX')

                            fs.writeFileSync('/tmp/xxx', stringBuffer)
//                            stringBuffer.replace(/\/\*.*[\s\S]+\*\//gm, '')
                            const lines: string[] = stdout.toString().split('\n')

                            // let ln: number = 1
                            // lines.forEach( (line) => {
                            //     console.log(ln++ + ' : ' + line)
                            // })

                            resolve(lines);
                        }
                    })
            }
        })
    }

    /**
     * Load the sourcecode from the file.
     *
     * @param {string} sourceFile
     * @returns {Promise<string[]>}
     * @memberof sourceLoader
     */
    public loadSourcecode(sourceFile: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            // const fullPath: string = path.normalize(path.format({
            //     base: sourceFile,
            //     dir: this.cwd,
            //     ext: 'ignored',
            //     name: 'ignored',
            //     root: '/ignored',
            // }))
            const fullPath: string = getFullPath(this.cwd, sourceFile)

            if (!fs.existsSync(fullPath)) {
                reject( new Error('File Not Found: ' + fullPath) )
            } else {
                const sourceBuffer = fs.readFileSync(fullPath, { encoding: "utf-8" })
                const lines: string[] = sourceBuffer.toString().split('\n')

                resolve(lines)
            }
        })
    }

    /** Load the microcode listing file */
    public loadListingFile(listingFile: string): Promise<ucodeObject> {
        return new Promise((resolve, reject) => {
            const fullPath: string = getFullPath(this.cwd, listingFile)

            if (!fs.existsSync(fullPath)) {
                reject( new Error('File Not Found: ' + fullPath) )
            } else {
                const obj: ucodeObject = {}
                const rl = readline.createInterface({
                    input: fs.createReadStream(fullPath),
                })
                let currentFile: string = ''

                rl.on('line', (line) => {
                    if (line.length > 0) {
                        const lineSplit     = line.split('|')
                        const lineDeco      = lineSplit[0].split(':')
                        const thisSource    = lineSplit[1]
                        const thisFile      = lineDeco[0].trim()
                        const thisLine      = lineDeco[1].trim()
                        const thisSegment   = lineDeco[2].trim()
                        const thisSegType   = lineDeco[3].trim()
                        const thisOffset    = lineDeco[4].trim()
                        const thisOpcodes   = lineDeco[5].trim()

                        const newLine = new ucodeLine(thisLine, thisSegment,
                                                    thisSegType, thisFile,
                                                    thisOffset, thisOpcodes,
                                                    thisSource)

                        if (currentFile !== thisFile) {
                            obj[thisFile] = {
                                lines: [ newLine ],
                                ucPath: getFullPath(this.cwd, thisFile),
                            }

                            console.log('start scanning file : ' + thisFile)
                            currentFile = thisFile
                        } else {
                            obj[thisFile].lines.push(newLine)
                        }

//                      console.log('> ' + line);
                    } else {
                        console.error("Blank line!")
                    }
                })

                rl.on('close', () => {
                    resolve(obj)
                })
            }
        })
    }

    /**
     * Parse the macros and evaluate...
     *
     * @param {ucodeObject} ucode
     * @returns {Promise<ucodeObject>}
     * @memberof sourceLoader
     */
    public parseListingFile(ucode: ucodeObject): Promise<ucodeObject> {
        return new Promise((resolve, reject) => {
            console.log("parseListingFile()")

            Object.keys(ucode).sort().forEach((key: string) => {
                console.log("key = " + key + " @ " + ucode[key].ucPath)
            })
            resolve(ucode)
        })
    }
}
