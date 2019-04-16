const { Reply } = require('./models')

module.exports = {
  // get (req, res, next) {},
  // getOne(req, res, next) {},
  async post(req, res, next) {
    const { commentId, toUserId, toUsername, content } = req.body
    const { id: userId, username }  = req.user

    const result = await Reply.create({ commentId, userId, username, toUserId, toUsername, content }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  },
  // put(req, res, next) {},
  async del(req, res, next) {}
}
