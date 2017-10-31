/**
 * sourceloader.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
const { exec }  = require('child_process')

const useMaxBuffer = 2048 * 1024

enum segType {
    code,
    data,
}

interface ucodeLine {
    lineNo: number
    segName: string
    segType: segType

}
interface ucodeFile {
    ucPath: string
    lines: string[]
}

interface ucodeObject {
    [key: string] : ucodeFile
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
                            let   stringBuffer = stdout.toString().replace(/\/\*.*[\s\S]+\*\//gm, 'XXXX')

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
            const fullPath: string = path.normalize(path.format({
                base: sourceFile,
                dir: this.cwd,
                ext: 'ignored',
                name: 'ignored',
                root: '/ignored',
            }))

            if (!fs.existsSync(fullPath)) {
                reject( new Error('File Not Found: ' + fullPath) )
            } else {
                const sourceBuffer = fs.readFileSync(fullPath, { encoding: "utf-8" })
                const lines : string[] = sourceBuffer.toString().split('\n')

                resolve(lines)
            }
        })
    }

    /** Load the microcode listing file */
    public loadListingFile(listingFile: string) : Promise<string[]> {
        return new Promise((resolve, reject) => {
            const fullPath: string = path.normalize(path.format({
                base: listingFile,
                dir: this.cwd,
                ext: 'ignored',
                name: 'ignored',
                root: '/ignored',
            }))

            if (!fs.existsSync(fullPath)) {
                reject( new Error('File Not Found: ' + fullPath) )
            } else {
                const obj : ucodeObject = {
                }
                const rl = readline.createInterface({
                    input: fs.createReadStream(fullPath),
                })
                let currentFile : string = ''

                rl.on('line', (line) => {
                    const lineSplit     = line.split('|')
                    const lineDeco      = lineSplit[0].split(':')
                    const thisSource    = lineSplit[1]
                    const thisFile      = lineDeco[0].trim()
                    const thisLine      = lineDeco[1].trim()
                    const thisSegment   = lineDeco[2].trim()
                    const thisSegType   = lineDeco[3].trim()
                    const thisOffset    = lineDeco[4].trim()
                    const thisOpcodes   = lineDeco[5].trim()

                    if (currentFile !== thisFile) {
                        obj[thisFile] = {
                            lines: [ thisSource ],
                            ucPath: fullPath,
                        }

                        console.log('start scanning file : ' + thisFile)
                        currentFile = thisFile
                    } else {
                        obj[thisFile].lines.push(thisSource)
                    }

                    console.log('> ' + line);
                })

                rl.on('close', () => {
                    resolve(obj)
                })

//                const sourceBuffer = fs.readFileSync(fullPath, { encoding: "utf-8" })
//                const lines : string[] = sourceBuffer.toString().split('\n')

                //resolve(lines)
            }
        })
    }

    public parseListingFile(lines: string[]) : Promise<ucodeObject> {
        return new Promise((resolve, reject) => {
            let obj : ucodeObject = {

            }
            console.log("parseListingFile()")

            lines.forEach((line) => {
                console.log('> ' + line);
            })

            resolve(obj)
        })
    }
}


/**

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('sample.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});

 */