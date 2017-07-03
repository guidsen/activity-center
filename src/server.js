const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();

const emitter = require('./emitter');

router.post('/activities', async (ctx, next) => {
  emitter.fire(ctx.request.body);
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
console.log('Listening on port 3000');