var express = require('express');
var router = express.Router();

const { exec } = require('child_process')
const path = require('path')
const os = require('os')
const { deleteAllFilesInDir } = require('../utils/commonMethodology')
const config = require('../config')

router.post('/convert-url', (req, res) => {
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
  const outputFilePath = path.join(__dirname, '../tmp', `${valueFile}.${type}`)

  exec(`ffmpeg -i ${url} ${outputFilePath}`, (error) => {
    if (error) {
      res.send({ code: 500, data: { url: '' }, msg: 'Conversion failed' })
      return
    }

    res.send({
      code: 200,
      data: {
        url: `${config.https}${valueFile}.${type}`
      },
      msg: 'Conversion Ok'
    })
  })
})

module.exports = router;
