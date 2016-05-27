#!/usr/bin/env node

var fs = require('fs-extra');
var del = require('del');
path = require('path');

var rootDir = process.cwd();
del.sync(path.join(rootDir, "platforms/android/res", "/drawable*/"));
try {
    fs.copySync(rootDir + '/res/android', rootDir + '/platforms/android/res')
    console.log("success copy android res!")
} catch (err) {
    console.error(err)
}


