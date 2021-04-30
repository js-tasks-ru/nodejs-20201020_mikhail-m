const url = require('url');
const http = require('http');
const path = require('path');
const { stat } = require(`fs`);
const fs = require(`fs`);

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  console.log(pathname );
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if( pathname.includes(`/`))
      {
        res.statusCode = 400;
        res.end('Error path  ');
        break;
      }
      checkFile(filepath).then(()=>{
        res.statusCode = 200;
        const fsStream = new fs.createReadStream(filepath,{encoding: 'utf8'});
        let stats = fs.statSync(filepath);
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': `${stats.size}`,
          'Content-Disposition': `attachment; filename=${pathname}`});
        fsStream.pipe(res);
      },null).catch((value)=>{
        res.statusCode = 404;
        res.end('Not found  ', value);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

});



let checkFile = function(pathsToCheck) {
  return new Promise((resolve, reject) => {
    stat(pathsToCheck, (err, script) => {
      if (err)
      {
        reject(false);
        console.log(err.message);
      }

      else
      {
        resolve(true);
      }
    });
  })
}
module.exports = server;
