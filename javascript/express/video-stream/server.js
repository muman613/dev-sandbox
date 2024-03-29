const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const hashMap = {
  123 : 'assets/sample.mp4',
  234 : 'assets/sample.mp4'
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

function serveVideoFromPath(path, req, res) {
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }

}

app.get('/video/:hashId', function(req, res) {
  //const path = 'assets/sample.mp4'
  const hashId = req.params.hashId
  //console.log("hash id = " + hashId)
  const path = hashMap[hashId];

  serveVideoFromPath(path, req, res)
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})