const Sequelize = require('sequelize')
const { sequelize, GroupPermission } = require('./models')
const Op = Sequelize.Op

module.exports = {
  async get(req, res, next) {
    const body = await GroupPermission.findAll().catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async batchPut(req, res, next) {
    const result = await sequelize.transaction(t => Promise.all(req.body.rows.map(({ id, value }) => GroupPermission.update({ value }, { where: { id }, transaction: t })))).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result.length })
  },
  async post(req, res, next) {
    const { groupId, permissionId, value } = req.body

    if (!groupId || !permissionId) return res.json({ code: 207, msg: 1 })

    const dbRow = await GroupPermission.findOne({ where: { [Op.and]: { groupId, permissionId } } }).catch(next)
    if (dbRow === undefined) return
    if (dbRow !== null) return res.json({ code: 217, msg: 1 })

    const result = await GroupPermission.create({ groupId, permissionId, value }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result.id })
  },
  async put(req, res, next) {
    const body = await GroupPermission.update({ value: req.body.value }, { where: { id: +req.params.id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body[0] })
  },
  async del(req, res, next) {
    const body = await GroupPermission.destroy({ where: { id: +req.params.id } }).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  }
}
