/**
 *
 */

// const { exec }  = require('child_process')

import * as fs from 'fs'
import { sourceLoader } from './sourceloader'

// const cwdPath = '/mnt/muman-fw-gitroot/'
const mruaPath = '/mnt/muman-fw-gitroot/mrua/mrua-171024/ucode_video/video_t5/src/'

const rmcflags: string = process.env.RMCFLAGS as string

const sourceFile = "hd.asm"

const loader = new sourceLoader(rmcflags, mruaPath)

loader.load(sourceFile).then((sourceLines: string[]) => {
    console.log(sourceLines)
    fs.writeFileSync('/tmp/output.src', sourceLines.join('\n'))
}).catch((err) => {
    console.log(err)
})

// cpp $RMCFLAGS -D__ASSEMBLY__=1  -I ../../../base/ -I ../../../hwdep_hwlib  main.asm
