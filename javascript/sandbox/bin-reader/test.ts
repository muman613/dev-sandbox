import { binLoader } from './src/binloader'

const loader = new binLoader()

loader.loadBinFile('archive/video_microcode_UN1.bin').then((obj) => {
    console.log(obj)
})