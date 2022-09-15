const fs = require('fs');
const path = require('path')
const ytdl = require('ytdl-core');
const express = require('express');
const stream = require('express-stream');
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const cron = require('node-cron');
const { exec } = require('child_process')

function clearFiles() {
  fs.readdir("./tmp", function(err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function(file) {
      fs.unlink(`./tmp/${file}`, function(err) {
        if (err) {
          throw (err);
        }
      });
    });
  });
}
clearFiles();
cron.schedule('*/30 * * * *', () => {
  clearFiles();
});

app.get('/api/ytdl/:youtubeId', async function(req, res) {
  const { youtubeId } = req.params;
  let fileType = req.query.fileType || 'mp4';
  let quality = req.query.quality || 'highest';
  let base = "npm run ytdl ";
  let ID = `-yturl='${youtubeId}'`
  exec(base+ID, (err, stdout, stderr) => {
    if (err) {
      res.send(`${stderr}`)
      return
    }
    let arr = stdout.split('npm_config_yturl');
    
    res.send(`${arr[1]}`)
  }
)
});


app.get('/', async function(req, res) {
  res.send("Youtube-Downloader")
});

app.listen(8080, function() {
  console.log('[NodeJS] Application Listening on Port 8080');
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason)
})