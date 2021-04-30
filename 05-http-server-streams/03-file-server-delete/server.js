const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  if(pathname.includes(`/`))
  {
    res.statusCode = 400;
    return res.end(`error path 400`)
  }


  switch (req.method) {
    case 'DELETE':
      fs.access(filepath,fs.constants.R_OK,(err)=>{
        if (err){
          res.statusCode = 404;
          return res.end('No file');
        } else {
          fs.unlinkSync(filepath);
          res.statusCode = 200;
          return res.end(`All ok`);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
