/**
 * Utilities Module
 */

import * as fs from 'fs'
import * as stream from 'stream'

export function dumpSourceToFile(outStream: fs.WriteStream,
                                 fileName: string,
                                 lines: string[]) : boolean
{
    console.log('dumpSourceToFile()')

    outStream.write('File : ' + fileName + '\n')

    return true
}
