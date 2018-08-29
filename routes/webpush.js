/**
 * Created by zfx on 8/29/2017
 * webpush
 */
const Router = require('koa-router');
const webpush = require('web-push')
const router = new Router({
	prefix: '/api/webpush'
});

// webpush.setGCMAPIKey('<Your GCM API Key Here>');

webpush.setVapidDetails(
  'localhost:3000',
  'BLrm5bUO9K-jOl01pv8vjSPQHLoR8H2aSjl1Kt0-xNTtw74Xx1DuXdKseosKeKH61zu7oOyRrbS80NL7-ctqoC0',
  '_7R2cE6H31nGnLiGps94t6i2nfu-p0Fk2dLbPahZV6s'
)

router
  .post('/register', async ctx => {
    console.log(ctx.request.body)
    const endpoint = ctx.request.body.endpoint
    const key = ctx.request.body.key
    const authSecret = ctx.request.body.authSecret

    const pushSubscription = {
      endpoint,
      keys: {
        auth: authSecret,
        p256dh: key
      }
    }
  
    const res = await webpush.sendNotification(pushSubscription, JSON.stringify({
      msg: 'thanks for registering',
      url: 'http://localhost:3000',
      icon: 'http://localhost:3000/5/images/homescreen.png'
    }))

    console.log(res)

    ctx.status = 201

    // can not test for no vpn
    // ctx.body = 'what ?'
  })

module.exports = router