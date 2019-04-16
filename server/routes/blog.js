const Sequelize = require('sequelize')
const { sequelize, Blog, Tag, TagBlog } = require('./models')
const { makeQueryFields, localizeDateField } = require('../lib/util')

module.exports = {
  async getAll(req, res, next) {
    const { limit, offset, user, categories, fields } = req.query

    const conditions = { limit, offset, raw: true }
    let where = {}
    if (user) where.authorId = user
    if (categories) {
      const arr = categories.split(',').map(i => +i)
      where.categoryId = arr.length === 1 ? arr[0] : arr
    }
    conditions.where = where

    if (fields) {
      conditions.attributes = makeQueryFields(fields, Sequelize.literal)
    } else {
      const exclude = ['createTime', 'updateTime']
      conditions.attributes = {
        exclude,
        include: exclude.map(row => localizeDateField(row, Sequelize.literal))
      }
    }

    const blogs = await Blog.findAll(conditions).catch(next)
    if (blogs !== undefined) res.json({ code: 0, data: blogs })
  },
  async getOne(req, res, next) {
    const id = +req.params.id
    const blog = await Blog.findOne({ where: { id }, include: [{ model: TagBlog, include: [Tag] }] }).catch(next)
    if (blog === undefined) return
    if (blog === null) return res.json({ code: 204, msg: 1 })

    const plainBlog = blog.toJSON()
    plainBlog.tags = blog.tagBlogs.map(row => row.tag)
    delete plainBlog.tagBlogs
    res.json({ code: 0, data: plainBlog })
  },
  async post(req, res, next) {
    const { title, intro, category, categoryId, tags, attachments, content, type = 1, slug = '' } = req.body
    const result = await sequelize.transaction(async t => {
      const blog = await Blog.create({
        title, intro: intro || '', content, authorId: req.user.id, author: req.user.username,
        category, categoryId, attachments: JSON.stringify(attachments), type, slug
      }, { transaction: t })
      //没有标签，直接结束
      if (!tags.length) return blog.id

      const existedTags = []
      const newTags = tags.filter(tag => {
        if (tag.id) existedTags.push(tag.id)
        return !tag.id
      })

      if (newTags.length) {
        const insertedTags = await Tag.bulkCreate(newTags, { transaction: t })
        insertedTags.forEach(tag => existedTags.push(tag.id))
      }

      const tagBlogRows = existedTags.map(item => ({ tagId: item, blogId: blog.id }))
      await TagBlog.bulkCreate(tagBlogRows, { transaction: t })
      return blog.id
    }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  },
  async put(req, res, next) {
    const id = +req.params.id
    const dbBlog = await Blog.findByPk(id, { attributes: ['id', 'authorId'] }).catch(next)
    if (dbBlog === undefined) return
    if (dbBlog === null) return res.json({ code: 204, msg: 1 })
    if (dbBlog.authorId !== req.user.id) return res.json({ code: 114, msg: 1 })

    const { title, intro, category, categoryId, tags, attachments, content } = req.body

    const result = await sequelize.transaction(async t => {
      await dbBlog.update({
        title, intro: intro || '', content, category, categoryId, attachments: JSON.stringify(attachments), updateTime: Sequelize.literal('Datetime("now")')
      }, { transaction: t })

      //先删除 tagBlog 表中 blogId 对应的所有映射
      await TagBlog.destroy({ where: { blogId: id }, transaction: t })

      if (!tags.length) return id

      const existedTags = []
      const newTags = tags.filter(tag => {
        if (tag.id) existedTags.push(tag.id)
        return !tag.id
      })

      if (newTags.length) {
        const insertedTags = await Tag.bulkCreate(newTags, { transaction: t })
        insertedTags.forEach(tag => existedTags.push(tag.id))
      }

      await TagBlog.bulkCreate(existedTags.map(item => ({ tagId: null, blogId: id })), { transaction: t })
      return id
    }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  },
  async del(req, res, next) {
    const dbBlog = await Blog.findByPk(+req.params.id).catch(next)
    if (dbBlog === undefined) return
    if (dbBlog === null) return res.json({ code: 204, msg: 1 })
    if (dbBlog.authorId !== req.user.id) return res.json({ code: 114, msg: 1 })

    const result = await dbBlog.destroy().catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  }
}
