const { Permission } = require('./models')

module.exports = {
  async get(req, res, next) {
    const body = await Permission.findAll().catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async post(req, res, next) {
    const { code, name, type } = req.body

    const body = await Permission.create({ code, name, type }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body.id })
  },
  async put(req, res, next) {
    const body = await Permission.update({ name: req.body.name }, { where: { id: +req.params.id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body[0] })
  },
  async del(req, res, next) {
    const body = await Permission.destroy({ where: { id: +req.params.id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  }
}
