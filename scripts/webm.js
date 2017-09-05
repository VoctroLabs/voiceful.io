'use strict';
// Pass a folder to convert all its .wav files to .webm usable on the web
// Dependency: ffmpeg

var fs = require('fs'),
    path = require('path'),
    execSync = require('child_process').execSync;

var targetDir = process.argv[2],
    source, target, cmd;

fs.readdirSync(targetDir)
    .filter(file => path.extname(file).toLowerCase() === '.wav')
    .forEach(wav => {
        source = path.join(targetDir, wav);
        target = path.join(targetDir, wav.replace('.wav', '.webm'));
        cmd = `ffmpeg -i ${source} -dash 1 -strict -2 ${target}`;
        console.log(`CMD: ${cmd}`);
        execSync(cmd);
    });
