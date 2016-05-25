#!/usr/bin/env node

var exec = require('child_process').execSync,
    child;

child = exec('sudo cordova build android',
    function (error, stdout, stderr) {
        if (error)
            throw error
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

    });
