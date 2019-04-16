// TODO: 删除版块后怎么处理已授权该版块及其子版块的用户组的版块列表
const Sequelize = require('sequelize')
const { Blog, Category, Permission, GroupPermission } = require('./models')
const { makeQueryFields, makeSequelizeError } = require('../lib/util')

module.exports = {
  async getAll(req, res, next) {
    const { ids, fields } = req.query
    let conditions = {
      include: {
        model: Blog,
        attributes: []
      },
      group: 'category.id'
    }
    if (ids) conditions.where = { id: ids.split(',').map(i => +i) }
    if (fields) {
      conditions.attributes = [
        ...makeQueryFields(fields, Sequelize.literal),
        [Sequelize.fn('count', Sequelize.literal('blogs.id')), 'blogsCount']
      ]
    } else {
      conditions.attributes = {
        include: [[Sequelize.fn('count', Sequelize.literal('blogs.id')), 'blogsCount']]
      }
    }
    const body = await Category.findAll(conditions).catch(next)
    if (body !== undefined) res.json({ code: 0, data: body })
  },
  async post(req, res, next) {
    const { name, parentId, path } = req.body
    const category = await Category.create(parentId ? { name, parentId, path } : { name }).catch(next)
    if (category !== undefined) res.json({ code: 0, data: category.id })

    //当不存在 GetAvailableCategories 权限时，结束
    const dbPermission = await Permission.findOne({ where: { code: 'GetAvailableCategories' } }).catch(error => {
      console.error(makeSequelizeError(error))
    })
    if (dbPermission === undefined) return
    if (dbPermission === null) return

    // 创建新版块时，ID为1的用户组自动拥有该版块的权限
    const groupPermission = await GroupPermission.findOne({ where: { groupId: 1, permissionId: dbPermission.id } }).catch(error => {
      console.error(makeSequelizeError(error))
    })
    if (groupPermission === undefined) return
    if (groupPermission === null) return

    const oldValue = groupPermission.value
    let newValue
    if (oldValue === '') {
      newValue = category.id
    } else {
      if (!oldValue.split(',').map(v => +v).includes(category.id)) newValue = `${oldValue},${category.id}`
    }

    await groupPermission.update({ value: newValue }).catch(error => {console.error(makeSequelizeError(error))})
  },
  async put(req, res, next) {
    const result = await Category.update({ name: req.body.name }, { where: { id: +req.params.id } }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result[0] })
  },
  async del(req, res, next) {
    const result = await Category.destroy({ where: { id: +req.params.id } }).catch(next)
    if (result !== undefined) res.json({ code: 0, data: result })
  }
}
