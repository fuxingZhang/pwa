const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
app.use(koaBody());

// crossOrigin
// const cors = require('koa2-cors')
// app.use(cors())

// console
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`);
  console.info(`${ctx.method} ${ctx.url} - ${ms}`)
});

const path = require('path')
serve = require("koa-static")
app.use(serve(path.join(__dirname, "/public")))

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
})
