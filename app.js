const {exec} = require("child_process")
const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
app.use(koaBody());

// crossOrigin
// const cors = require('koa2-cors')
// app.use(cors())

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

serve = require("koa-static")
app.use(serve("./public"))

// error
app.on('error', async (err, ctx) => {
  if (ctx.url == '/favicon.ico') {
    console.info('get favicon.ico');
    return
  }
  err.expose = true;
  err.status = err.status || 500;
  // delelopment
  err.message = err.status > 500 ? 'Internal Server Error' : err.message
  // production
  // err.message = err.status >= 500 ? 'Internal Server Error' : err.message
  // err.message = err.status < 500 ? err.message : 'Internal Server Error'
});

process.on("uncaughtException", function (err) {
  console.error(err.stack ? err.stack : err);
});

process.on("unhandledRejection", function (err, r) {
  console.error(err.stack ? err.stack : err, r);
});

const port = 3000;
app.listen(port, () => {
  console.info(`listening on localhost: ${port}`)
  const url = `http://localhost:${port}`
  switch (process.platform) {
    //mac系统使用 一下命令打开url在浏览器
    case "darwin":
      exec(`open ${url}`);
    //win系统使用 一下命令打开url在浏览器
    case "win32":
      exec(`start ${url}`);
    // 默认mac系统
    default:
      exec(`open ${url}`);
  }
})