const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'doc.db',
  define: {
    timestamps: false
  }
})

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database: ', err))

class user extends Sequelize.Model {}
class group extends Sequelize.Model {}
class userGroup extends Sequelize.Model {}
class permission extends Sequelize.Model {}
class groupPermission extends Sequelize.Model {}
class role extends Sequelize.Model {}
class blog extends Sequelize.Model {}
class category extends Sequelize.Model {}
class tag extends Sequelize.Model {}
class tagBlog extends Sequelize.Model {}
class comment extends Sequelize.Model {}
class reply extends Sequelize.Model {}
class repo extends Sequelize.Model {}

user.init({
  username: { type: Sequelize.TEXT, allowNull: false },
  roles: { type: Sequelize.TEXT, allowNull: false, defaultValue: 1 },
  avatar: Sequelize.TEXT,
  email: Sequelize.TEXT,
  mobile: Sequelize.TEXT,
  password: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
  lastLoginTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
}, { sequelize })

group.init({
  name: { type: Sequelize.TEXT, allowNull: false, unique: true },
  parentId: Sequelize.INTEGER,
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

userGroup.init({
  userId: Sequelize.INTEGER,
  groupId: Sequelize.INTEGER
}, { tableName: 'userGroup', sequelize })

permission.init({
  code: { type: Sequelize.TEXT, allowNull: false, unique: true },
  type: { type: Sequelize.TEXT, allowNull: false },
  name: { type: Sequelize.TEXT, allowNull: false },
  description: Sequelize.TEXT,
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

groupPermission.init({
  groupId: Sequelize.INTEGER,
  permissionId: Sequelize.INTEGER,
  value: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'groupPermission', sequelize })

role.init({
  name: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

blog.init({
  serialNo: Sequelize.INTEGER,
  title: { type: Sequelize.TEXT, allowNull: false },
  intro: Sequelize.TEXT,
  content: Sequelize.TEXT,
  authorId: Sequelize.INTEGER,
  author: Sequelize.TEXT,
  categoryId: Sequelize.INTEGER,
  category: Sequelize.TEXT,
  attachments: Sequelize.TEXT,
  likers: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  views: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
  slug: Sequelize.INTEGER,
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
  updateTime: Sequelize.INTEGER
}, { sequelize })

category.init({
  serialNo: Sequelize.INTEGER,
  name: { type: Sequelize.TEXT, allowNull: false },
  parentId: Sequelize.INTEGER,
  path: Sequelize.TEXT,
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

tag.init({
  name: { type: Sequelize.TEXT, allowNull: false },
  type: Sequelize.TEXT,
  hot: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  color: Sequelize.TEXT,
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

tagBlog.init({
  tagId: { type: Sequelize.INTEGER },
  blogId: { type: Sequelize.INTEGER }
}, { tableName: 'tagBlog', sequelize })

comment.init({
  blogId: { type: Sequelize.INTEGER, allowNull: false },
  userId: { type: Sequelize.INTEGER, allowNull: false },
  username: { type: Sequelize.TEXT, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

reply.init({
  commentId: { type: Sequelize.INTEGER, allowNull: false },
  userId: { type: Sequelize.INTEGER, allowNull: false },
  username: { type: Sequelize.TEXT, allowNull: false },
  toUserId: Sequelize.INTEGER,
  toUsername: Sequelize.TEXT,
  content: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
}, { sequelize })

repo.init({
  name: { type: Sequelize.TEXT, allowNull: false },
  type: Sequelize.TEXT,
  description: Sequelize.TEXT,
  isPrivate: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  belong: Sequelize.INTEGER,
  slug: { type: Sequelize.TEXT, allowNull: false, unique: true },
  toc: Sequelize.TEXT,
  creatorId: { type: Sequelize.INTEGER, allowNull: false },
  creator: { type: Sequelize.TEXT, allowNull: false },
  createTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
  updateTime: { type: Sequelize.INTEGER, defaultValue: 0 }
}, { sequelize })

user.userGroups = user.hasMany(userGroup, { onDelete: 'CASCADE' })
group.hasMany(userGroup, { onDelete: 'CASCADE' })

group.hasMany(groupPermission, { onDelete: 'CASCADE' })
permission.hasMany(groupPermission, { onDelete: 'CASCADE' })
groupPermission.belongsTo(permission)

userGroup.hasMany(groupPermission, { foreignKey: 'groupId', sourceKey: 'groupId' })
user.hasMany(blog, { foreignKey: 'authorId', onDelete: 'CASCADE' })
category.hasMany(blog)

blog.hasMany(tagBlog, { onDelete: 'CASCADE' })
tag.hasMany(tagBlog, { onDelete: 'CASCADE' })
tagBlog.belongsTo(tag)
blog.hasMany(comment, { onDelete: 'CASCADE' })
comment.hasMany(reply, { onDelete: 'CASCADE' })
reply.belongsTo(user, { onDelete: 'CASCADE' })
reply.belongsTo(user, { foreignKey: 'toUserId' })

user.hasMany(repo, { foreignKey: 'creatorId' })

module.exports = {
  sequelize,
  User: user,
  Group: group,
  UserGroup: userGroup,
  Permission: permission,
  GroupPermission: groupPermission,
  Blog: blog,
  Category: category,
  Tag: tag,
  TagBlog: tagBlog,
  Comment: comment,
  Reply: reply,
  Repo: repo
}
