const Sequelize = require('sequelize')
const { Comment, Reply } = require('./models')
const { localizeDateField } = require('../lib/util')

module.exports = {
  async getByBlog(req, res, next) {
    const { blogId } = req.query
    if (blogId === undefined) return res.json({ code: 207, msg: 1 })

    const { limit, offset } = req.query

    console.time('getComments')
    const exclude = ['createTime']
    const comments = await Comment.findAll({
      limit, offset, where: { blogId },
      attributes: { exclude, include: exclude.map(row => localizeDateField(row, Sequelize.literal)) },
      include: [{
        model: Reply,
        attributes: { exclude, include: exclude.map(row => localizeDateField(row, Sequelize.literal, 'replies')) }
      }]
    }).catch(next)
    console.timeEnd('getComments')
    if (comments !== undefined) res.json({ code: 0, data: comments })
  },
  async post(req, res, next) {
    const { blogId, content } = req.body
    const userId = req.user.id, username = req.user.username

    const result = await Comment.create({ blogId, userId, username, content }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  },
  async put(req, res, next) {},
  async del(req, res, next) {
    const result = await Comment.destroy({ where: { id: +req.params.id, userId: req.user.id } }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  }
}
