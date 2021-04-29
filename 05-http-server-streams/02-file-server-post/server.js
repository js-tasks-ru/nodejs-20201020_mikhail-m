const url = require('url');
const http = require('http');
const path = require('path');
const { stat} = require(`fs`);
const {rm} = require('fs/promises');
const { pipeline } = require('stream');
const fs = require(`fs`);
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();
server.on('request', async (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    req.on(`close`, ()=>{
      if (req.aborted) {
        console.error('REQ aborted');
        fs.unlinkSync(filepath);
      }
    });
    if(pathname.includes(`/`))
    {
      res.statusCode = 400;
      return res.end('статус код ответа 400');
    }
    if(fs.existsSync(filepath))
    {
      res.statusCode = 409;
      return  res.end('возвращается ошибка 409 при создании файла, который есть');
    }
    switch (req.method) {
      case 'POST':
        let writeFileStream = new fs.createWriteStream(filepath,{flags: 'wx'});
        let limitSizeStream = new  LimitSizeStream({limit: 1048576});
        req.pipe(limitSizeStream).pipe(writeFileStream);
        limitSizeStream.on(`error`,(error)=>{ console.error('Pipeline failed.');
          if(error instanceof(LimitExceededError)) {
            fs.unlinkSync(filepath);
            res.statusCode = 413;
            return res.end('file is too big');
          }} );


            writeFileStream.on(`close`,()=>{console.log('Pipeline succeeded.');
              res.statusCode = 201;
              return  res.end('статус код ответа сервера 200');});


        break;


      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
});

module.exports = server;
