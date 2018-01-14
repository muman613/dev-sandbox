/**
 *  sourceFile object
 */

import * as fs from 'fs';
import * as path from 'path';

export enum sourceType { header, asm }

/**
 * sourceFile object
 *
 * @export
 * @class sourceFile
 */

export class sourceFile {
    private filePath: string
    private lines: string[]
    private type: sourceType

    constructor(sourcePath: string) {
        console.log('sourceFile constructor')
        if (fs.existsSync(sourcePath)) {
            this.filePath = sourcePath
            if (path.extname(sourcePath) === '.asm') {
                this.type = sourceType.asm
            } else {
                this.type = sourceType.header
            }
        } else {
            throw new Error('Invalid path')
        }
    }

    /**
     * Read the file into the array.
     *
     * @returns {boolean}
     * @memberof sourceFile
     */
    public readFile(): boolean {
        console.log('readFile()')

        const sourceBuffer = fs.readFileSync(this.filePath, { encoding: 'utf-8' } )
        this.lines = sourceBuffer.split('\n')

//      console.log(sourceBuffer);

        return (this.lines.length > 0 )
    }

    /**
     * Return full path name.
     *
     * @returns {string}
     * @memberof sourceFile
     */
    public pathName(): string {
        return this.filePath
    }

    /**
     * Return filename part of path.
     *
     * @returns {string}
     * @memberof sourceFile
     */
    public fileName(): string {
        return path.basename( this.filePath )
    }

    /**
     * Return total # of lines.
     *
     * @returns {number}
     * @memberof sourceFile
     */
    public lineCount(): number {
        return this.lines.length;
    }
}
