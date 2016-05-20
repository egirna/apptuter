#!/usr/bin/env node

var exec = require('child_process').execSync,
    child;

child = exec('cordova build android',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

    });
