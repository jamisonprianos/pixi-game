var fs = require('fs');
var app = require('express')();
var uglify = require('uglify-js');
var sass = require('node-sass');
var htmlMinifier = require('html-minifier');

var cache = {
  css: undefined,
  js: undefined
};

var cacheAssets = false;
var compressAssets = false;

var jsFiles = ['./source/js/pixi.multisprite.js', './source/js/main.js'];

function concatFiles(jsFiles) {
  if (jsFiles.length === 0) {
    return '';
  } else {
    var fileName = jsFiles.shift();
    console.log(fileName);
    return fs.readFileSync(fileName, {encoding: 'utf8'}) + '\n' + concatFiles(jsFiles);
  }
}

app.get('/app.js', function (req, res) {
  console.log('javascript request');
  if (cache.js) {
    res.writeHead(200, {'content-type': 'application/javascript'});
    res.end(cache.js);
  } else {
    if (compressAssets) {
      var uglified = uglify.minify(jsFiles);
    } else {
      var uglified = { code: concatFiles(JSON.parse(JSON.stringify(jsFiles))) };
    }
    res.writeHead(200, {'content-type': 'application/javascript'});
    res.end(uglified.code);
    if (cacheAssets) {
      cache.js = uglified.code;
    }
  }
});

app.get('/app.css', function (req, res) {
  console.log('css request');
  if (cache.css) {
    res.writeHead(200, {'content-type': 'text/css'});
    res.end(cache.css);    
  } else {
    sass.render({
      file: './source/scss/main.scss',
      outputStyle: 'compressed'
    }, function(err, result) {
      if (err) {
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('HTTP/1.1 500 Internal Server Error');
      } else {
        res.writeHead(200, {'content-type': 'text/css'});
        res.end(result.css);
        if (cacheAssets) {
          cache.css = result.css;
        }
      }
    });
  }
});

app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params[0]);
  var filename = req.params[0] === '/' ? '/index.html' : req.params[0];
  var fullFilename = __dirname + '/public' + filename;
  fs.exists(fullFilename, function (exists) {
    if (exists) {
      var ext = fullFilename.split('.').pop();
      var encoding = (ext === 'html' || ext === 'js') ? { encoding: 'utf8' } : {};
      fs.readFile(fullFilename, encoding, function (err, contents) {
        if (err) {
          res.writeHead(500, {'content-type': 'text/plain'});
          res.end('HTTP/1.1 500 Internal Server Error');
        } else {
          if (ext === 'html') {
            var output = htmlMinifier.minify(contents, {
              removeComments: true,
              collapseWhitespace: true,
              collapseBooleanAttributes: true,
              removeAttributeQuotes: true,
              removeRedundantAttributes: true,
              removeEmptyAttributes: true
            });
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(output);
          } else if (ext === 'jpg' || ext == 'jpeg') {
            res.writeHead(200, {'content-type': 'image/jpeg'});
            res.end(contents);
          } else if (ext === 'png') {
            res.writeHead(200, {'content-type': 'image/png'});
            res.end(contents);
          } else if (ext === 'js') {
            res.writeHead(200, {'content-type': 'application/javascript'});
            res.end(contents);
          }
        }
      });
    } else {
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('HTTP/1.1 404 Not Found');
    }
  });
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});