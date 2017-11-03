/**
 *
 */
import { SIGBREAK } from 'constants';

import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
const Readable = require('fs-readstream-seek')

enum segmentType {
    code,
    data,
    dmacode,
}

interface hashType {
    [key: string]: any
}

declare type segmentHandler = (obj: ucodeObject,
                               offset: number,
                               type: number,
                               data: Buffer,
                               size: number) => boolean

interface segMapType {
    [key: number]: { name: string, cb: segmentHandler }
}

interface segmentWidths {
    pm: number
    dm: number
    dram: number
}

/**
 * Return the size of an associative hash.
 *
 * @param {hashType} hash
 * @returns {number}
 */
function hashSize(hash: hashType): number {
    return Object.keys(hash).length
}

function stringToSegtype(str: string): segmentType {
    let segType = segmentType.code

    switch (str) {
        case 'code':
            segType = segmentType.code
            break;
        case 'data':
            segType = segmentType.data
            break;
        case 'dmacode':
            segType = segmentType.dmacode
            break;
    }

    return segType
}

function segtypeToString(type: segmentType): string {
    let segType = ''

    switch (type) {
        case segmentType.code:
            segType = 'code'
            break
        case segmentType.data:
            segType = 'data'
            break
        case segmentType.dmacode:
            segType = 'dmacode'
            break
    }

    return segType
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
        this.lineNo = ln
        this.segName = segName
        this.segType = segType
        this.file = fn
        this.offset = ofs
        this.opCodes = code
        this.source = src
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

export interface envHash {
    [key: string]: string
}

export interface segmentEntry {
    [key: string]: number
}
export interface segmentHash {
    [key: string]: segmentEntry
}

export interface symbolHash {
    pm: segmentHash
    dm: segmentHash
    dram: segmentHash
}

export class ucodeObject {
    public files: fileHash = {}
    public buildEnv: envHash = {}
    public segSizes: segmentWidths = {
        dm: 0,
        dram: 0,
        pm: 0,
    }
    public buildDate: string = "N/A"
    public spasmVers: string = "N/A"
    public spasmExe: string = "N/A"
    public perlInc: string = "N/A"
    public memoryMap: string[] = []
    public profile: string[] = []
    public symbols: symbolHash = {
        dm: {},
        dram: {},
        pm: {},
    }
    public dbgSymbols: symbolHash = {
        dm: {},
        dram: {},
        pm: {},
    }

    constructor() {
//      console.log("ok")
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
    private segmentMap: segMapType = {
        0x00000001: { name: "DESC_MEM_PM", cb: this.defaultCB.bind(this) },
        0x00000002: { name: "DESC_MEM_DM", cb: this.defaultCB.bind(this) },
        0x00000004: { name: "DESC_MEM_DRAM", cb: this.defaultCB.bind(this) },
        0x00000201: { name: "DESC_SYM_PM", cb: this.symbolCB.bind(this) },
        0x00000202: { name: "DESC_SYM_DM", cb: this.symbolCB.bind(this) },
        0x00000204: { name: "DESC_SYM_DRAM", cb: this.symbolCB.bind(this) },
        0x00000400: { name: "DESC_BUS_WIDTH", cb: this.busWidthCB.bind(this) },
        0x00000800: { name: "DESC_DEBUG", cb: this.debugCB.bind(this) },
        0x00000801: { name: "DESC_DEBUG_SYM_PM", cb: this.dbgSymbolCB.bind(this) },
        0x00000802: { name: "DESC_DEBUG_SYM_DM", cb: this.dbgSymbolCB.bind(this) },
        0x00000804: { name: "DESC_DEBUG_SYM_DRAM", cb: this.dbgSymbolCB.bind(this) },
        0x0000080c: { name: "DESC_SPASM_VERSION", cb: this.spasmVersCB.bind(this) },
        0x00000810: { name: "DESC_BUILD_DATE", cb: this.buildDateCB.bind(this) },
        0x00000811: { name: "DESC_PROGRAM_NAME", cb: this.spasmExeCB.bind(this) },
        0x00000812: { name: "DESC_PROGRAM_OPTS", cb: this.defaultCB.bind(this) },
        0x00000813: { name: "DESC_PERL_INCLUDES", cb: this.perlIncCB.bind(this) },
        0x00000814: { name: "DESC_BUILD_ENV", cb: this.buildEnvCB.bind(this) },
        0x00000815: { name: "DESC_MAP", cb: this.memMapCB.bind(this) },
        0x00000816: { name: "DESC_PROFILE", cb: this.profileCB.bind(this) },
        0x00000817: { name: "DESC_SOURCE", cb: this.defaultCB.bind(this) },
    }

    constructor() {
//      console.log("new binloader()")
    }

    /**
     *
     *
     * @param {string} fileName
     * @returns {Promise<ucodeObject>}
     * @memberof binLoader
     */
    public loadBinFile(fileName: string): Promise<ucodeObject> {
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
                        highWaterMark: (128 * 1024 * 1024),
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
                                if (this.deepDebug) {
                                    console.log("Offset : 0x" + offset.toString(16) + " Chunk Type : " +
                                        this.segmentMap[tagValue].name + " Chunk size = " + dataSize)
                                }
                                if (this.segmentMap[tagValue]) {
                                    this.segmentMap[tagValue].cb(obj,
                                        offset, tagValue, dataBuffer, dataSize)
                                }

                                offset += (secSize + 4)
                                //              binStream.seek(offset)
                            } else {
//                              console.log("looks like we hit end-of-file!")
                            }
                        } else {
//                          console.log('CHUNK BOUNDARY!')
                            done = true
                        }
                    }
                })

                binStream.on('close', () => {
//                  console.log("closed!")
                    resolve(obj)
                })

            } else {
                reject(new Error('File Not Found'))
            }
        })
    }

    /**
     *  Build Environment Handler
     *
     * @private
     * @param {ucodeObject} obj
     * @param {number} offset
     * @param {number} type
     * @param {Buffer} data
     * @param {number} size
     * @returns {boolean}
     * @memberof binLoader
     */
    // "(\w+)=([a-zA-Z0-9_/\-\.]+)"

    private buildEnvCB(obj: ucodeObject,
                       offset: number,
                       type: number,
                       data: Buffer,
                       size: number): boolean {
//      console.log('buildEnvCB()')
        const envArray = data.toString().split('\n')

        for (const envPair of envArray) {
            const [variable, value] = [
                envPair.substring(0, envPair.indexOf('=')),
                envPair.substring(envPair.indexOf('=') + 1),
            ]

            /** If the variable was found store in the hash */
            if (variable.length > 0) {
                obj.buildEnv[variable] = value
            } else {
//              console.log('found a blank variable')
            }
        }

        if (this.deepDebug) {
            console.log("Added " + hashSize(obj.buildEnv) + " environment variables...")
        }

        return true
    }

    /**
     *
     * @param obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */
    private busWidthCB(obj: ucodeObject,
                       offset: number,
                       type: number,
                       data: Buffer,
                       size: number): boolean {
//      console.log('busWidthCB()')

        obj.segSizes = {
            dm: data.readInt32BE(4),
            dram: data.readInt32BE(8),
            pm: data.readInt32BE(0),
        }

        return true
    }

    /**
     *
     * @param obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */
    private spasmVersCB(obj: ucodeObject,
                        offset: number,
                        type: number,
                        data: Buffer,
                        size: number): boolean {
        obj.spasmVers = data.toString().split(' ')[1]
        return true
    }

    /**
     *
     * @param obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */
    private buildDateCB(obj: ucodeObject,
                        offset: number,
                        type: number,
                        data: Buffer,
                        size: number): boolean {
        obj.buildDate = data.toString()
        return true
    }
    /**
     *
     * @param obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */
    private perlIncCB(obj: ucodeObject,
                      offset: number,
                      type: number,
                      data: Buffer,
                      size: number): boolean {
        obj.perlInc = data.toString()
        return true
    }
    /**
     *
     * @param obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */

    private memMapCB(obj: ucodeObject,
                     offset: number,
                     type: number,
                     data: Buffer,
                     size: number): boolean {
        obj.memoryMap = data.toString().split('\n')
        return true
    }

    /**
     * Handle the profile chunk
     * @param {ucodeObject} obj
     * @param offset
     * @param type
     * @param data
     * @param size
     */
    private profileCB(obj: ucodeObject,
                      offset: number,
                      type: number,
                      data: Buffer,
                      size: number): boolean {
        obj.profile = data.toString().split('\n')
        return true
    }

    private dbgSymbolCB(obj: ucodeObject,
                        offset: number,
                        type: number,
                        data: Buffer,
                        size: number): boolean {
        const address = data.readUInt32BE(0)
        const symString = data.slice(4).toString()
        const [ segname, symname ] = symString.split(' ')

        if (this.deepDebug) {
            console.log("Segment : " + segname + " Symbol : " + symname + " @ " + address.toString(16))
        }

        switch (type) {
            case 0x00000801:
                {
//                  console.log('pm')
                    if (!obj.dbgSymbols.pm[segname]) {
                        obj.dbgSymbols.pm[segname] = {}
                    }

                    obj.dbgSymbols.pm[segname][symname] = (address * obj.segSizes.pm)
                }
                break
            case 0x00000802:
                {
//                  console.log('dm')
                    if (!obj.dbgSymbols.dm[segname]) {
                        obj.dbgSymbols.dm[segname] = {}
                    }

                    obj.dbgSymbols.dm[segname][symname] = (address * obj.segSizes.dm)
                }
                break
            case 0x00000804:
                {
//                  console.log('dram')
                    if (!obj.dbgSymbols.dram[segname]) {
                        obj.dbgSymbols.dram[segname] = {}
                    }

                    obj.dbgSymbols.dram[segname][symname] = (address * obj.segSizes.dram)
                }
                break
        }

        return true
    }

    private symbolCB(obj: ucodeObject,
                     offset: number,
                     type: number,
                     data: Buffer,
                     size: number): boolean {
        const address = data.readUInt32BE(0)
        const symBuffer = data.slice(4)

        for (let i = 0 ; i < symBuffer.length ; i++) {
            // tslint:disable-next-line:no-bitwise
            symBuffer[i] = ~symBuffer[i]
        }
        const [segname, symname] = symBuffer.toString().split(' ')

        if (this.deepDebug) {
            console.log("Segment : " + segname + " Symbol : " + symname + " @ " + address.toString(16))
        }

        switch (type) {
            case 0x00000201:
                {
//                  console.log('pm')
                    if (!obj.symbols.pm[segname]) {
                        obj.symbols.pm[segname] = {}
                    }

                    obj.symbols.pm[segname][symname] = (address * obj.segSizes.pm)
                }
                break
            case 0x00000202:
                {
//                  console.log('dm')
                    if (!obj.symbols.dm[segname]) {
                        obj.symbols.dm[segname] = {}
                    }

                    obj.symbols.dm[segname][symname] = (address * obj.segSizes.dm)
                }
                break
            case 0x00000204:
                {
//                  console.log('dram')
                    if (!obj.symbols.dram[segname]) {
                        obj.symbols.dram[segname] = {}
                    }

                    obj.symbols.dram[segname][symname] = (address * obj.segSizes.dram)
                }
                break
            default:
                if (this.deepDebug) {
                    console.log('invalid type encountered!')
                }
                break
        }

        return true
    }

    private spasmExeCB(obj: ucodeObject,
                       offset: number,
                       type: number,
                       data: Buffer,
                       size: number): boolean {
        obj.spasmExe = data.toString()
        return true
    }

    private parseLine(line: string) : ucodeLine {
        const lineSplit     = line.split('|')
        const lineDeco      = lineSplit[0].split(':')
        const thisSource    = lineSplit[1]
        const thisFile      = lineDeco[0].trim()
        const thisLine      = lineDeco[1].trim()
        const thisSegment   = lineDeco[2].trim()
        const thisSegType   = lineDeco[3].trim()
        const thisOffset    = lineDeco[4].trim()
        const thisOpcodes   = lineDeco[5].trim()

        const newLine = new ucodeLine(parseInt(thisLine, 10), thisSegment,
                                    stringToSegtype(thisSegType), thisFile,
                                    parseInt(thisOffset, 16), thisOpcodes,
                                    thisSource)

        return newLine
    }

    private debugCB(obj: ucodeObject,
                    offset: number,
                    type: number,
                    data: Buffer,
                    size: number): boolean {
        const lines: string[] = data.toString().split('\n')

        for (const line of lines) {
            if (line.length > 0) {
                const newLine = this.parseLine( line )
                const fileName = newLine.file

                if (!obj.files[fileName]) {
                    obj.files[fileName] = new ucodeFile( fileName )
                    obj.files[fileName].lines.push(newLine)
                } else {
                    obj.files[fileName].lines.push(newLine)
                }

//              console.log(newLine.file)
            }
        }

        return true
    }

    /**
     *
     *
     * @private
     * @param {ucodeObject} obj
     * @param {number} offset
     * @param {number} type
     * @param {Buffer} data
     * @param {number} size
     * @returns {boolean}
     * @memberof binLoader
     */
    private defaultCB(obj: ucodeObject,
                      offset: number,
                      type: number,
                      data: Buffer,
                      size: number): boolean {
        // if (type === 0x800) {
        //     const lines: string[] = data.toString().split('\n')

        //     console.log(lines)
        // } else {
        //     console.log(data.toString())
        // }

        return true
    }

    set debug(val: boolean) {
        this.deepDebug = val
    }
}
