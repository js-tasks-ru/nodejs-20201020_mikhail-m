const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform
  {
    constructor(options) {
    super(options);
    this.bufferString =[];
  }

  _transform(chunk, encoding, callback) {
    if(chunk.toString(`utf8`).indexOf(os.EOL)===-1) {
      this.bufferString.push(chunk.toString(`utf8`));
      callback();
    }
    else
      {
        const res =chunk.toString(`utf8`).split(os.EOL);
        for (let i=0; i<res.length; i++)
        {
          if(i>=res.length-1) //add check last
          {
            this.bufferString.push(res[i]);
            break;
          }
          else{
            this.push([...this.bufferString,...res[i]].join(``));
            this.bufferString=[];
          }


      }
      callback();
    }}



  _flush(callback)
  {
    callback(null,this.bufferString.join(``).toString(`utf8`));
  }
}

module.exports = LineSplitStream;
