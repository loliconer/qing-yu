const crypto = require('crypto')
const config = require('../lib/config')
const caches = require('../lib/caches')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const { User, UserGroup } = require('./models')
const Op = Sequelize.Op

const hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, new Buffer(config.salt, 'base64'), 10000, 64, 'sha512').toString('base64')
}

const checkVerifyCode = function (res, cachedCode, code) {
  //没有发送验证码，直接提交时
  if (cachedCode === undefined) {
    res.json({ code: 102, msg: 1 })
    return false
  }

  //验证码错误超过5次时
  if (cachedCode.count >= 5) {
    res.json({ code: 115, msg: 1 })
    return false
  }

  if (code !== cachedCode.code) {
    res.json({ code: 102, msg: 1 })

    //验证失败时，失败次数+1
    cachedCode.count++
    return false
  }

  //验证时间超过验证码的有效时间
  if (new Date().getTime() - cachedCode.timestamp > 300 * 1000) {
    res.json({ code: 103, msg: 1 })
    return false
  }

  return true
}

module.exports = {
  async login(req, res, next) {
    const { type } = req.body

    if (type === 'pwd') {
      const { username, password } = req.body

      let loginAttempt = caches.loginAttempt[username]

      if (loginAttempt && loginAttempt.count > 4) {
        //登录失败次数大于4次，且距离上次登录失败时间小于1 hour
        if (new Date().getTime() - loginAttempt.timestamp < 3600 * 1000) return res.json({ code: 113, msg: 1 })
      }

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email: username }, { mobile: username }]
        },
        attributes: {
          exclude: ['lastLoginTime'],
          include: [
            [Sequelize.literal('Datetime(lastLoginTime, "+8 hours")'), 'lastLoginTime']
          ]
        }
      }).catch(next)
      if (user === undefined) return
      if (user === null) return res.json({ code: 104, msg: 1 })

      if (hashPassword(password) === user.password) {
        const plainUser = user.toJSON()
        delete plainUser.password
        res.json({ code: 0, data: jwt.sign(plainUser, config.secret, { expiresIn: 86400 }) })

        //登录成功时必须清除登录尝试记录
        delete caches.loginAttempt[username]
        user.update({ lastLoginTime: Sequelize.literal('CURRENT_TIMESTAMP') })
      } else {
        res.json({ code: 104, msg: 1 })

        //登录失败时，失败次数+1,同时记录本次登录失败时间
        if (!loginAttempt) {
          caches.loginAttempt[username] = { count: 0 }
          loginAttempt = caches.loginAttempt[username]
        }
        loginAttempt.count++
        loginAttempt.timestamp = new Date().getTime()
      }
    }

    if (type === 'sms') {
      if (!config.enableMobilePhone) return res.json({ code: 206, data: 1 })

      const { mobile, smsCode } = req.body
      const user = await User.findOne({
        where: { mobile },
        attributes: {
          exclude: ['password', 'lastLoginTime'],
          include: [
            [Sequelize.literal('Datetime(lastLoginTime, "+8 hours")'), 'lastLoginTime']
          ]
        }
      }).catch(next)
      if (user === undefined) return
      if (user === null) return res.json({ code: 112, msg: 1 })

      const cachedCode = caches.smsCodes[mobile]
      if (!checkVerifyCode(res, cachedCode, smsCode)) return

      res.json({ code: 0, data: jwt.sign(user.toJSON(), config.secret, { expiresIn: 86400 }) })

      //登录成功时必须清除验证码记录和登录尝试记录
      delete caches.smsCodes[mobile]
      user.update({ lastLoginTime: Sequelize.literal('CURRENT_TIMESTAMP') })
    }
  },
  async register(req, res, next) {
    const { type, password } = req.body
    let target, verifyCode, cachedCode
    let $email = '', $mobile = ''

    if (type === 'email') {
      const { email, emailCode } = req.body

      if (config.limitCompany && !email.endsWith(`@${config.companyDomain}`)) return res.json({ code: 108, msg: 1 })

      target = email
      $email = email
      verifyCode = emailCode
      cachedCode = caches.emailCodes[email]
    }

    if (type === 'mobile') {
      if (!config.enableMobilePhone) return res.json({ code: 206, data: 1 })

      const { mobile, smsCode } = req.body
      target = mobile
      $mobile = mobile
      verifyCode = smsCode
      cachedCode = caches.smsCodes[mobile]
    }

    if (!checkVerifyCode(res, cachedCode, verifyCode)) return

    const dbUser = await User.findAll({
      where: { [type]: target },
      attributes: ['id']
    }).catch(next)
    if (dbUser === undefined) return
    if (dbUser.length > 0) return res.json({ code: 101, msg: 1 })

    const user = await User.create({
      username: target,
      roles: '1',
      avatar: '',
      email: $email,
      mobile: $mobile,
      password: hashPassword(password),
      UserGroups: [{ groupId: 1 }]
    }, { include: [User.userGroups] }).catch(next)
    if (user === undefined) return

    if (type === 'email') delete caches.emailCodes[target]
    if (type === 'mobile') delete caches.smsCodes[target]
    res.json({ code: 0, data: 1 })
  },
  async resetPassword(req, res, next) {
    const { type, password } = req.body
    let target, verifyCode, cachedCode

    if (type === 'email') {
      const { email, emailCode } = req.body
      target = email
      verifyCode = emailCode
      cachedCode = caches.emailCodes[email]
    }

    if (type === 'mobile') {
      if (!config.enableMobilePhone) return res.json({ code: 206, data: 1 })

      const { mobile, smsCode } = req.body
      target = mobile
      verifyCode = smsCode
      cachedCode = caches.smsCodes[mobile]
    }

    if (!checkVerifyCode(res, cachedCode, verifyCode)) return

    const user = await User.findOne({
      where: { [type]: target },
      attributes: ['id', 'password']
    }).catch(next)
    if (user === undefined) return
    if (user === null) return res.json({ code: 110, msg: 1 })

    const result = await user.update({ password: hashPassword(password) }).catch(next)
    if (result === undefined) return

    if (type === 'email') delete caches.emailCodes[target]
    if (type === 'mobile') delete caches.smsCodes[target]
    res.json({ code: 0, data: 1 })
  },
  async updatePassword(req, res, next) {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'password']
    }).catch(next)
    if (user === undefined) return
    if (user === null) return res.json({ code: 110, msg: 1 })

    const { oldPassword, newPassword } = req.body
    if (hashPassword(oldPassword) !== user.password) return res.json({ code: 107, data: 1 })

    const result = await user.update({ password: hashPassword(newPassword) }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: 1 })
  },
  async bindMobile(req, res, next) {
    if (!config.enableMobilePhone) return res.json({ code: 206, data: 1 })

    const { mobile, smsCode } = req.body
    const cachedCode = caches.smsCodes[mobile]

    if (!checkVerifyCode(res, cachedCode, smsCode)) return

    // 检查手机号是否已绑定
    const dbUser = await User.findAll({ where: { mobile } }).catch(next)
    if (dbUser === undefined) return
    if (dbUser.length > 0) return res.json({ code: 117, msg: 1 })

    const result = await User.update({ mobile }, { where: { id: req.user.id } }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: 1 })
  },
  async getAll(req, res, next) {
    const { limit, offset } = req.query

    const users = await User.findAll({
      limit, offset,
      attributes: { exclude: ['password'] },
      include: [UserGroup]
    }).catch(next)
    if (users !== undefined) res.json({ code: 0, data: users })
  },
  async adminPut(req, res, next) {
    const result = await User.update({ groups: req.body.groups }, { where: { id: +req.params.id } }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: 1 })
  },
  async adminPost(req, res, next) {
    const { email = '', mobile = '' } = req.body

    if (!email && !mobile) return res.json({ code: 110, msg: 1 })
    if (config.limitCompany && email && !email.endsWith(`@${config.companyDomain}`))
      return res.json({ code: 108, msg: 1 })

    let where
    if (email && mobile) {
      where = { [Op.or]: { email, mobile } }
    } else if (email) {
      where = { email }
    } else {
      where = { mobile }
    }
    const dbUser = await User.findAll({ where, raw: true }).catch(next)
    if (dbUser === undefined) return
    if (dbUser.length > 0) return res.json({ code: 101, msg: 1 })

    const result = await User.create({
      username: email || mobile,
      roles: '1',
      avatar: '',
      email,
      mobile,
      password: hashPassword('123456'),
      userGroups: [{ groupId: 1 }]
    }, { include: [User.userGroups] }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result.id })
  }
}
