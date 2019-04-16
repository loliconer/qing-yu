const { Tag } = require('./models')

module.exports = {
  async getAll(req, res, next) {
    const tags = await Tag.findAll({ limit: 20, raw: true }).catch(next)
    if (tags !== undefined) res.json({ code: 0, data: tags })
  },
  getOne(req, res, next) {
  },
  async post(req, res, next) {
  },
  put(req, res, next) {
  },
  async del(req, res, next) {
    const result = await Tag.destroy({ id: +req.params.id }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  }
}
