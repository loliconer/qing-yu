const config = require('../lib/config')
const util = require('../lib/util')
const caches = require('../lib/caches')
const nodemailer = require('nodemailer')

module.exports = {
  upload(req, res, next) {
    res.json({ code: 0, data: req.files.files.path.replace('\\', '/') })
  },
  sendVerifyCode(req, res, next) {
    const { method = 'sms', target, action = 'login' } = req.body

    if (method === 'sms') {
      const cachedCode = caches.smsCodes[target]
      if (cachedCode && (new Date().getTime() - cachedCode.timestamp < 60 * 1000))
        return res.json({ code: 205, data: 1 })

      const accessKeyId = config.aliyunAccessKeyId
      const secretAccessKey = config.aliyunAccessKeySecret
      const smsClient = new SMSClient({ accessKeyId, secretAccessKey })
      const code = util.generateVerifyCode()

      smsClient.sendSMS({
        PhoneNumbers: target,
        SignName: config.aliyunSMSSign,
        TemplateCode: config.aliyunSMSTemplates[action],
        TemplateParam: `{"code":"${code}"}`
      }).then(response => {
        const { Code, Message } = response
        if (Code === 'OK') {
          caches.smsCodes[target] = {
            code,
            count: 0,
            timestamp: new Date().getTime()
          }
          res.json({ code: 0, data: 1 })
        } else {
          res.json({ code: 1101, msg: Message })
        }
      }, err => {
        if (err.data) {
          res.json({ code: 1100, msg: err.data.Message })
        } else if (err.name) {
          res.json({ code: 1100, msg: err.name })
        }
      })
    } else if (method === 'email') {
      const cachedCode = caches.emailCodes[target]
      if (cachedCode && (new Date().getTime() - cachedCode.timestamp < 60 * 1000))
        return res.json({ code: 205, data: 1 })

      const code = util.generateVerifyCode()

      const transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: 465,
        secure: true,
        auth: {
          user: config.emailUser,
          pass: config.emailPass
        }
      })

      const mailOptions = {
        from: config.emailUser,
        to: target,
        subject: '邮箱验证',
        html: `您的验证码为：<span style="font-weight: bold; color: #ffbf00">${code}</span>，5分钟内有效！`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.json({ code: 201, msg: 1 })
          return console.error(error)
        }

        caches.emailCodes[target] = {
          code,
          count: 0,
          timestamp: new Date().getTime()
        }
        res.json({ code: 0, data: 1 })
      })
    }
  }
}
