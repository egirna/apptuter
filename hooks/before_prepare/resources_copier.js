#!/usr/bin/env node

var exec = require('child_process').execSync,
    child;

child = exec('npm install fs-extra',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

        var fs = require('fs-extra');

        var rootDir = process.cwd();
        console.log(fs.toString())
        try {
            fs.copySync(rootDir + '/res/android', rootDir + '/platforms/android/res')
            console.log("success copy android res!")
        } catch (err) {
            console.error(err)
        }
    });
