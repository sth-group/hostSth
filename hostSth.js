fs = require('fs')
fs.readFile('hosts.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var data = JSON.parse(data)
  console.log(data[0]);
});
