/**
 * Utilities Module
 */

import * as fs from 'fs'
import * as path from 'path'
import * as stream from 'stream'

export function dumpSourceToFile(outStream: fs.WriteStream,
                                 fileName: string,
                                 lines: string[]): boolean {
    console.log('dumpSourceToFile()')

    outStream.write('File : ' + fileName + '\n')

    return true
}

export function getFullPath(wd: string, file: string): string {
    const fullPath: string = path.normalize(
            path.format(
                {
                    base: file,
                    dir: wd,
                    ext: '',
                    name: '',
                    root: ''
                }))
    return fullPath
}

