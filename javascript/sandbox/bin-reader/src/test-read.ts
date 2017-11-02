
//import * as fs from 'fs'

const Readable = require('fs-readstream-seek')
import * as fs from 'fs'

const deepDebug: boolean = false

declare type  segmentHandler = (offset: number, type: number, data: Buffer, size: number) => boolean

interface segMapType {
    [key: number] : { name: string, cb: segmentHandler }
}

/**
 * Lookup table for SPASM segments
 */
const segmentMap : segMapType = {
    0x00000001 : { name: "DESC_MEM_PM", cb: defaultCB },
    0x00000002 : { name: "DESC_MEM_DM", cb: defaultCB },
    0x00000004 : { name: "DESC_MEM_DRAM", cb: defaultCB },
    0x00000201 : { name: "DESC_SYM_PM", cb: defaultCB },
    0x00000202 : { name: "DESC_SYM_DM", cb: defaultCB },
    0x00000204 : { name: "DESC_SYM_DRAM", cb: defaultCB },
    0x00000400 : { name: "DESC_BUS_WIDTH", cb: defaultCB },
    0x00000800 : { name: "DESC_DEBUG", cb: defaultCB },
    0x00000801 : { name: "DESC_DEBUG_SYM_PM", cb: defaultCB },
    0x00000802 : { name: "DESC_DEBUG_SYM_DM", cb: defaultCB },
    0x00000804 : { name: "DESC_DEBUG_SYM_DRAM", cb: defaultCB },
    0x0000080c : { name: "DESC_SPASM_VERSION", cb: defaultCB },
    0x00000810 : { name: "DESC_BUILD_DATE", cb: defaultCB },
    0x00000811 : { name: "DESC_PROGRAM_NAME", cb: defaultCB },
    0x00000812 : { name: "DESC_PROGRAM_OPTS", cb: defaultCB },
    0x00000813 : { name: "DESC_PERL_INCLUDES", cb: defaultCB },
    0x00000814 : { name: "DESC_BUILD_ENV", cb: defaultCB },
    0x00000815 : { name: "DESC_MAP", cb: defaultCB },
    0x00000816 : { name: "DESC_PROFILE", cb: defaultCB },
    0x00000817 : { name: "DESC_SOURCE", cb: defaultCB },
}

/** Default segment handler */
function defaultCB(offset: number, type: number, data: Buffer, size: number): boolean {
    console.log("Offset : 0x" + offset.toString(16) + " Chunk Type : " +
                segmentMap[type].name + " Chunk size = " + size)
    console.log(data)
    if (type === 0x800) {
        const lines : string[] = data.toString().split('\n')

        console.log(lines)
    } else {
        console.log(data.toString())
    }
    return true
}

function readDWORD(stream: fs.ReadStream): number {
    let val: number = 0;

    return val;
}

const inStream = new Readable("archive/video_microcode_UN1.bin", { highWaterMark: 128 * 1024 * 1024} )

let offset = 0

//console.log(segmentMap)

inStream.on('readable', () => {
    let done: boolean = false

    while (!done) {
        const sectionSize: Buffer = inStream.read(4)
        const sectionTag: Buffer = inStream.read(4)

        if (sectionSize && sectionTag) {
            if (deepDebug) {
                console.log(sectionTag)
                console.log(sectionSize)
            }

            const tagValue = sectionTag.readInt32BE(0)
            const secSize = sectionSize.readInt32BE(0)

            if ((tagValue !== 0) && (secSize !== 0)) {
                const dataSize = secSize - 4

                const dataBuffer: Buffer = inStream.read(dataSize)

                if (dataBuffer.length !== dataSize) {
                    throw new Error("Read error")
                }

                if (segmentMap[tagValue]) {
                    segmentMap[tagValue].cb(offset, tagValue, dataBuffer, dataSize)
                }

                offset += (secSize + 4)
//              inStream.seek(offset)
            } else {
                console.log("looks like we hit end-of-file!")
            }
        } else {
            console.log('CHUNK BOUNDARY!')
            done = true
        }
    }
})

inStream.on('close', () => {
    console.log("closed!")
})