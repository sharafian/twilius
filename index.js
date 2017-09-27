const Koa = require('koa')
const Router = require('koa-router')
const Parser = require('koa-bodyparser')
const debug = require('debug')('twilius')

const Ilp = require('koa-ilp')
const ilpCredentials = JSON.parse(process.env.TWILIO_ILP_CREDENTIALS)
const Plugin = require(process.env.TWILIO_ILP_PLUGIN || 'ilp-plugin-xrp-escrow')
const plugin = new Plugin(ilpCredentials)
const price = 100000 // 0.1 xrp, or ~2 cents

const agent = require('superagent')
const { TWILIO_ACCOUNT, TWILIO_TOKEN, TWILIO_NUMBER } = process.env
const TWILIO_ENDPOINT = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT}/Messages.json`

const port = process.env.PORT || 7000
const app = new Koa()
const router = Router()
const parser = Parser()
const ilp = new Ilp({ plugin })

router.options('/', ilp.options({ price }))
router.post('/', ilp.paid({ price }), async (ctx) => {
  const { text, to } = ctx.request.body
  debug(`sending "${text}" to "${to}"`)

  await agent
    .post(TWILIO_ENDPOINT)
    .auth(TWILIO_ACCOUNT, TWILIO_TOKEN)
    .type('form')
    .send({
      From: TWILIO_NUMBER,
      To: to,
      Body: text
    })
  debug('sent!')

  ctx.status = 200
  ctx.body = { sent: true }
})

app
  .use(parser)
  .use(router.allowedMethods())
  .use(router.routes())
  .listen(port)

debug(`listening on ${port}...`)
