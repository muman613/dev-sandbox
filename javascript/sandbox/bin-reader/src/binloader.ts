/**
 *
 */

import * as fs from 'fs'
import * as path from 'path'
import * as stream from 'stream'
const Readable = require('fs-readstream-seek')

enum segmentType {
    code,
    data,
    dma,
}

declare type  segmentHandler = (offset: number, type: number, data: Buffer, size: number) => boolean

interface segMapType {
    [key: number] : { name: string, cb: segmentHandler }
}

/**
 *  This class encapsulates a line of sourcecode from the binary file.
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
    public offset: number
    public opCodes: string

    constructor(ln: number, segName: string,
                segType: segmentType, fn: string,
                ofs: number, code: string,
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
/**
 *
 *
 * @export
 * @class ucodeFile
 */
export class ucodeFile {
    public ucPath: string
    public lines: ucodeLine[] = []

    constructor(file: string) {
        this.ucPath = file
    }
}

export interface fileHash {
    [key: string]: ucodeFile
}

export class ucodeObject {
    public files: fileHash = {}

    constructor() {
        console.log("ok")
    }
}
/**
 *
 *
 * @export
 * @class binLoader
 */
export class binLoader {
    public rootPath: string = ''
    private deepDebug: boolean = false

    /**
     * Lookup table for SPASM segments
     */
    private segmentMap : segMapType = {
        0x00000001 : { name: "DESC_MEM_PM", cb: this.defaultCB.bind(this) },
        0x00000002 : { name: "DESC_MEM_DM", cb: this.defaultCB.bind(this) },
        0x00000004 : { name: "DESC_MEM_DRAM", cb: this.defaultCB.bind(this) },
        0x00000201 : { name: "DESC_SYM_PM", cb: this.defaultCB.bind(this) },
        0x00000202 : { name: "DESC_SYM_DM", cb: this.defaultCB.bind(this) },
        0x00000204 : { name: "DESC_SYM_DRAM", cb: this.defaultCB.bind(this) },
        0x00000400 : { name: "DESC_BUS_WIDTH", cb: this.defaultCB.bind(this) },
        0x00000800 : { name: "DESC_DEBUG", cb: this.defaultCB.bind(this) },
        0x00000801 : { name: "DESC_DEBUG_SYM_PM", cb: this.defaultCB.bind(this) },
        0x00000802 : { name: "DESC_DEBUG_SYM_DM", cb: this.defaultCB.bind(this) },
        0x00000804 : { name: "DESC_DEBUG_SYM_DRAM", cb: this.defaultCB.bind(this) },
        0x0000080c : { name: "DESC_SPASM_VERSION", cb: this.defaultCB.bind(this) },
        0x00000810 : { name: "DESC_BUILD_DATE", cb: this.defaultCB.bind(this) },
        0x00000811 : { name: "DESC_PROGRAM_NAME", cb: this.defaultCB.bind(this) },
        0x00000812 : { name: "DESC_PROGRAM_OPTS", cb: this.defaultCB.bind(this) },
        0x00000813 : { name: "DESC_PERL_INCLUDES", cb: this.defaultCB.bind(this) },
        0x00000814 : { name: "DESC_BUILD_ENV", cb: this.defaultCB.bind(this) },
        0x00000815 : { name: "DESC_MAP", cb: this.defaultCB.bind(this) },
        0x00000816 : { name: "DESC_PROFILE", cb: this.defaultCB.bind(this) },
        0x00000817 : { name: "DESC_SOURCE", cb: this.defaultCB.bind(this) },
    }

    constructor() {
        console.log("new binloader()")
    }

    /**
     *
     *
     * @param {string} fileName
     * @returns {Promise<ucodeObject>}
     * @memberof binLoader
     */
    public loadBinFile(fileName: string) : Promise<ucodeObject> {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(fileName)) {
                const obj = new ucodeObject()

                this.rootPath = path.dirname(fileName)

                // obj.files['test'] = new ucodeFile('/tmp/file')
                // obj.files['test'].lines.push(new ucodeLine(1, 'name',
                //                              segmentType.code, '/tmp/fn',
                //                              0x200, '0202', 'asdasdad'))

                const binStream = new Readable(fileName,
                                                {
                                                    highWaterMark: (128 * 1024 * 1024)
                                                })

                binStream.on('readable', () => {
                    let done: boolean = false
                    let offset = 0

                    while (!done) {
                        const sectionSize: Buffer = binStream.read(4)
                        const sectionTag: Buffer = binStream.read(4)

                        if (sectionSize && sectionTag) {
                            if (this.deepDebug) {
                                console.log(sectionTag)
                                console.log(sectionSize)
                            }

                            const tagValue = sectionTag.readInt32BE(0)
                            const secSize = sectionSize.readInt32BE(0)

                            if ((tagValue !== 0) && (secSize !== 0)) {
                                const dataSize = secSize - 4

                                const dataBuffer: Buffer = binStream.read(dataSize)

                                if (dataBuffer.length !== dataSize) {
                                    throw new Error("Read error")
                                }

                                if (this.segmentMap[tagValue]) {
                                    this.segmentMap[tagValue].cb(offset, tagValue, dataBuffer, dataSize)
                                }

                                offset += (secSize + 4)
                //              binStream.seek(offset)
                            } else {
                                console.log("looks like we hit end-of-file!")
                            }
                        } else {
                            console.log('CHUNK BOUNDARY!')
                            done = true
                        }
                    }
                })

                binStream.on('close', () => {
                    console.log("closed!")
                    resolve(obj)
                })

            } else {
                reject( new Error('File Not Found') )
            }
        })
    }

    /** Default segment handler */
    private defaultCB(offset: number, type: number, data: Buffer, size: number): boolean {
        console.log("Offset : 0x" + offset.toString(16) + " Chunk Type : " +
                    this.segmentMap[type].name + " Chunk size = " + size)
        console.log(data)
        if (type === 0x800) {
            const lines : string[] = data.toString().split('\n')

            console.log(lines)
        } else {
            console.log(data.toString())
        }
        return true
    }

 }