const user = require('./user')
const blog = require('./blog')
const system = require('./system')
const category = require('./category')
const comment = require('./comment')
const reply = require('./reply')
const tag = require('./tag')
const group = require('./group')
const permission = require('./permission')
const groupPermission = require('./groupPermission')
const view = require('./view')
const userGroup = require('./userGroup')
const repo = require('./repo')

module.exports = {
  user,
  blog,
  system,
  category,
  comment,
  reply,
  tag,
  group,
  permission,
  groupPermission,
  view,
  userGroup,
  repo
}
