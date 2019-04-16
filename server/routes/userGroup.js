const { User, UserGroup } = require('./models')

module.exports = {
  async get(req, res, next) {
    const body = await UserGroup.findAll({ where: { userId: req.query.userId } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async post(req, res, next) {
    const { groups } = req.body, userId = +req.body.userId

    if (!userId) return res.json({ code: 207, msg: 1 })

    const user = await User.findByPk(userId).catch(next)
    if (user === undefined) return
    if (user === null) return res.json({ code: 204, msg: 1 })

    const deleteResult = await UserGroup.destroy({ where: { userId } }).catch(next)
    if (deleteResult === undefined) return

    const newRows = groups.map(g => ({ userId, groupId: g }))
    const createResult = await UserGroup.bulkCreate(newRows).catch(next)
    if (createResult !== undefined) res.json({ code: 0, data: 1 })
  }
}
