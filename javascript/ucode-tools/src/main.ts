/**
 *
 */
import { currentId } from 'async_hooks';

const program = require('commander');
const recursive = require('recursive-readdir')
const fs      = require('fs');
const path    = require('path');
const readline = require('readline');

import { sourceFile } from './sourcefile'

interface sourceTreeType  {
//    files: Array<string>
//    [key:string]: any
    sources: sourceFile[]
}

program
    .version('1.0.0')
    .option('-p, --path <pathname>', 'Path to microcode source')
    .parse(process.argv)

if (!program.path) {
    console.log("Must specify path!")
    process.exit(-10);
}

console.log("Using path [" + program.path + "]")

/**
 * Function to decide if file should be ignored or not.
 *
 * @param {string} file
 * @param {*} stats
 * @returns {boolean}
 */

function ignoreFile(file: string, stats: any): boolean {
//  console.log('>> ' + file)
    if (stats.isDirectory()) {
        return false
    }
    const extName = path.extname(file)

    /* Do not ignore .asm or .h files. */
    if ((extName === '.asm') || (extName === '.h')) {
        return false
    }

    return true
}

// function processFile(filename: string) {
//     let rd = readline.createInterface({
//         input: fs.createReadStream(filename),
//         output: process.stdout,
//         terminal: false
//     })

//     let ln = 1
//     console.log('--- processing ' + filename + ' ---')
//     rd.on('line', (line: string) => {
//         console.log("line " + ln + " : " + line)
//         ln += 1
//     })

//     rd.on('close', () => {
//         console.log('end-of-file encountered!')
//     })
// }

/**
 *  Process each file.
 *
 * @param {Array<string>} files
 * @param {sourceTreeType} sourceTree
 * @returns boolean
 */

function processSourceFiles(files: string[], sourceTree: sourceTreeType): boolean {
    let i = 1;

    console.log('processSourceFiles()')

    console.log('start');

    files.forEach((currentItem: string) => {
        console.log('processing file # ' + i++);
        const fileObject = new sourceFile(currentItem)

        fileObject.readFile();
//      sourceTree.files.push( currentItem )
        sourceTree.sources.push( fileObject )

//      sourceTree[currentItem] = { valid: 1 }
    })

    console.log('stop');
    return true
}

/**
 *  Scan directory for all .asm or .h files
 *
 * @param {string} path
 * @returns {Promise<sourceTreeType>}
 */

function scanUcode(ucodePath: string): Promise<sourceTreeType> {
    return new Promise((resolve, reject) => {
        const   sourceTree: sourceTreeType = {
            sources: [],
        }

        recursive(ucodePath, [ ignoreFile ], (err: any, files: string[]) => {
            if (err) {
                console.log('ERROR : ' + err)
                reject(err)
            } else {
                console.log('Found ' + files.length + ' source files...')
                processSourceFiles(files, sourceTree)
                resolve(sourceTree)
            }
        })
    })
}

scanUcode(program.path).then((val: sourceTreeType) => {
    console.log(val);
}).catch( (err: any) => {
    console.log('Caught error ' + err);
})

// recursive(program.path, [ ignoreFile ], processSourceFiles)

// sourceTree.files.forEach( (fileName) => {
//     console.log('>> ' + fileName);
// })
