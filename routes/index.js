var express = require('express');
var router = express.Router();

const path = require('path')
const os = require('os')
const { deleteAllFilesInDir } = require('../utils/commonMethodology')
const config = require('../config')

const ffmpeg = require('fluent-ffmpeg');

router.post('/convert-url', async (req, res) => {
  const { url, type } = req.body;

  deleteAllFilesInDir(path.resolve(__dirname, '../tmp'))

  if (!url && !type) {
    res.send({ code: 400, data: { url: `` }, msg: 'url and type is required' })
    return
  }

  const match = url.match(/\/(\d+)$/);
  let valueFile = ''

  if (match) {
    valueFile = match[1]
  } else {
    valueFile = '1000000'
  }
  const inputFile = url
  const outputFile = path.join(__dirname, '../tmp', `${valueFile}.${type}`)

  ffmpeg(inputFile)
    .output(outputFile)
    .audioCodec('libmp3lame')
    .audioBitrate('192k')
    .on('end', () => {
      res.send({
        code: 200,
        data: {
          url: `${config.https}${valueFile}.${type}`
        },
        msg: 'Conversion Ok'
      })
    })
    .on('error', (err) => {
      res.send({
        code: 500,
        data: {
          url: ``
        },
        msg: 'Conversion Error'
      })
    })
    .run();
})

module.exports = router;
