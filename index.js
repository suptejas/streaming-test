const http = require("http");
const stream = require("stream");

function getRandomString() {
  return (Math.random() * 16).toString(16);
}

function getStream(time) {
  class TimeStream extends stream.Readable {
    constructor(time) {
      super();
      this.setMaxListeners(100);
      this.streamEnds = Date.now() + time;
    }
    _read(size) {
      setTimeout(() => {
        if (Date.now() < this.streamEnds) {
          this.push(getRandomString() + "\n\n");
        } else {
          this.push(null);
        }
      }, 10);
    }
  }
  return new TimeStream(time);
}

//create a server object:
http
  .createServer(function (req, res) {
    res.setHeader("x-amazing-header", "yolo am i rite");
    res.setHeader("Content-Disposition", 'attachment; filename="test.txt"');
    const stream = getStream(20000);

    stream.pipe(res);
  })
  .listen(8070);
