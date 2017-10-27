/**
 * sourceloader.ts
 */

import * as fs from 'fs'
import * as path from 'path'
const { exec }  = require('child_process')

const useMaxBuffer = 2048 * 1024

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

                resolve(lines);
            }
        })
    }
}
