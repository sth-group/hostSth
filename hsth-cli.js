#! /usr/bin/env node

var fs = require('fs'),
  http = require('http'),
  args = process.argv.slice(2);

function hsth(obj) {
  var structure = '';
  this.opts = {
    wrote: false
  }
  this.init();
  this.hashing = ['### hostSth \n', '### hostSth'];
}

hsth.prototype = {
  init: function() {
    var self = this;
    fs.readFile('hosts', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      if (data.indexOf(self.hashing[0]) > -1) {
        self.opts.wrote = true;
        self.removeCurrent();

      } else {
        self.opts.wrote = false;
        self.getJSON();
      }
      console.log(self.opts.wrote)
    });
  },
  manipulate: function(obj) {
    var self = this,
      dom, ip, hosts = '';


    for (var i = 0, len = obj.length; i < len; i++) {
      dom = Object.keys(obj[i]);
      ip = obj[i][dom];
      hosts += ip + ' ' + dom + '\n';
    }
    self.writeHosts(hosts);

  },
  writeHosts: function(lines) {
    var self = this;
    fs.appendFile("hosts", self.hashing[0] + lines + self.hashing[1], function(fd) {

    });
  },
  removeCurrent: function() {
    // var fs = require('fs');
    var self = this;
    fs.readFile('hosts', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/\#\#\#\ hostSth(.|\n)*?\#\#\# hostSth\s?/gmi, '');

      fs.writeFile('hosts', result, 'utf8', function(err) {
        if (err) return console.log(err);
        self.getJSON();
      });
    });
  },
  getJSON: function(){
    var type = args[0].indexOf('://'),
      self = this;
    switch (type) {
      case -1:
        fs.readFile(args[0], 'utf8', function(err, obj) {
          if (err) {
            return console.log(err);
          }
          var obj = JSON.parse(obj)
          self.manipulate(obj);
        });
        break;
      default:
        http.get(args[0], function(res) {
          var body = '';

          res.on('data', function(chunk) {
            body += chunk;
          });

          res.on('end', function() {
            var obj = JSON.parse(body);
            self.manipulate(obj);
            console.log("Got a response: ", obj);
          });
        }).on('error', function(e) {
          console.log("Got an error: ", e);
        });
        break;
    }
  }

}

new hsth();
