const Sequelize = require('sequelize')
const { Repo } = require('./models')
const { localizeDateField } = require('../lib/util')

module.exports = {
  async get(req, res, next) {
    const { limit, offset, user } = req.query

    const conditions = { limit, offset, raw: true }
    if (user) conditions.where = { creatorId: user }

    const exclude = ['createTime', 'updateTime']
    conditions.attributes = {
      exclude, include: exclude.map(row => localizeDateField(row, Sequelize.literal))
    }

    const repos = await Repo.findAll(conditions).catch(next)
    if (repos !== undefined) res.json({ code: 0, data: repos })
  },
  async getOne(req, res, next) {
    const { slug } = req.params

    const repo = await Repo.findOne({ where: { slug } }).catch(next)
    if (repo === undefined) return
    if (repo === null) return res.json({ code: 204, msg: 1 })

    res.json({ code: 0, data: repo })
  },
  async post(req, res, next) {
    const { name, type, description, isPrivate = 0, belong, slug, toc } = req.body

    if (name === '' || slug === '') return res.json({ code: 207, msg: 1 })

    const result = await Repo.create({
      name, type, description, isPrivate, belong, slug, toc,
      creatorId: req.user.id, creator: req.user.username
    }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result.id })
  },
  async put(req, res, next) {
    const { querySlug } = req.params

    if (querySlug === undefined || querySlug === '') return res.json({ code: 204, msg: 1 })

    const dbRepo = await Repo.findOne({ where: { slug: querySlug } }).catch(next)
    if (dbRepo === undefined) return
    if (dbRepo === null) return res.json({ code: 204, msg: 1 })
    if (dbRepo.creatorId !== req.user.id) return res.json({ code: 114, msg: 1 })

    const possibleFields = ['name', 'type', 'description', 'isPrivate', 'belong', 'slug', 'toc']
    const updateContents = {}
    possibleFields.forEach(item => {
      if (req.body.hasOwnProperty(item)) updateContents[item] = req.body[item]
    })
    updateContents.updateTime = Sequelize.literal('Datetime("now")')

    const result = await dbRepo.update(updateContents).catch(next)
    if (result !== undefined) res.json({ code: 0, data: 1 })
  },
  async del(req, res, next) {
    const { slug } = req.params

    const dbRepo = await Repo.findOne({ where: { slug } }).catch(next)
    if (dbRepo === undefined) return
    if (dbRepo === null) return res.json({ code: 204, msg: 1 })
    if (dbRepo.creatorId !== req.user.id) return res.json({ code: 114, msg: 1 })

    const result = await dbRepo.destroy().catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  }
}
