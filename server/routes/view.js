const Sequelize = require('sequelize')
const { UserGroup, GroupPermission, Permission } = require('./models')
const { makeSequelizeError, mergePermissions } = require('../lib/util')
const Op = Sequelize.Op

module.exports = {
  async permissionsByGroups(groups, req, res) {
    return await GroupPermission.findAll({
      where: { groupId: groups.split(',').map(i => +i) },
      attributes: {
        exclude: ['createTime']
      },
      include: [Permission]
    }).catch(error => {
      res.json(makeSequelizeError(error))
    })
  },
  async userPermissions(arg, req, res) {
    const result = await UserGroup.findAll({
      where: { userId: req.user.id },
      include: [
        { model: GroupPermission, include: [Permission] }
      ]
    }).catch(error => {
      res.json(makeSequelizeError(error))
    })
    if (result === undefined) return

    return mergePermissions(result)
  }
}
