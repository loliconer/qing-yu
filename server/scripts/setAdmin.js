const { User } = require('../routes/models')
const { makeSequelizeError } = require('../lib/util')

async function f(username) {
  const user = await User.findOne({ where: { username } }).catch(error => {
    console.error(makeSequelizeError(error).msg)
  })
  if (user === undefined) return
  if (user === null) console.error('没有此用户')

  const result = await user.update({
    roles: `${user.roles},99`
  }).catch(error => {
    console.error(makeSequelizeError(error).msg)
  })
  if (result === undefined) return

  console.log('设置成功')
}

f('vuedev2019@gmail.com')
