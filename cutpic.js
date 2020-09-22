var fs = require('fs');
gm = require('gm');
console.log('111')
// resize and remove EXIF profile data
gm('/Users/wangbing/Desktop/node/public/image/1img.jpg')
    .resize(240, 240)
    .noProfile()
    .write('/Users/wangbing/Desktop/node/public/image/1.jpeg', function (err) {
        if (!err) console.log('done');
    });
