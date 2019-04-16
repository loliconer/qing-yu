const { Group } = require('./models')

module.exports = {
  async getAll(req, res, next) {
    const body = await Group.findAll({ raw: true }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async post(req, res, next) {
    const body = await Group.create({ name: req.body.name }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async put(req, res, next) {
    const body = await Group.update({ name: req.body.name }, { where: { id: +req.params.id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: 1 })
  },
  async del(req, res, next) {
    const id = +req.params.id

    if (id === 1) return res.json({ code: 1000, msg: 'ID为1的用户组无法删除' })

    const body = await Group.destroy({ where: { id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  }
}
