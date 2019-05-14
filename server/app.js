const restify = require('restify')
const routes = require('./routes')
const guard = require('./lib/guard')
const config = require('./lib/config')
const { makeSequelizeError } = require('./lib/util')

console.log(process.argv)

const server = restify.createServer({
  name: 'Server',
  version: '1.0.0'
})

server.pre([
  (req, res, next) => {
    res.charSet('utf-8')
    console.log(req.method, req.url)
    return next()
  }
])
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser({
  multiples: true,
  keepExtensions: true,
  uploadDir: './upload',
  hash: 'sha1'
}))

server.get('/api/configs', function (req, res) {
  res.json({
    code: 0,
    data: {
      enableMobilePhone: config.enableMobilePhone,
      limitCompany: config.limitCompany,
      companyDomain: config.companyDomain
    }
  })
})

server.get('/api/user', guard.jwtVerify, function (req, res) {
  res.json({ code: 0, data: req.user })
})
server.get('/api/users', guard.jwtVerify, guard.adminRequired, routes.user.getAll)
server.post('/api/users', routes.user.register)
server.post('/api/admin/users', routes.user.adminPost)
server.put('/api/users/:id', guard.jwtVerify, guard.adminRequired, routes.user.adminPut)

server.post('/api/session', routes.user.login)
// server.del('/api/session', guard.jwtVerify, routes.user.logout)

server.get('/api/userGroup', routes.userGroup.get)
server.post('/api/userGroup', routes.userGroup.post)

server.post('/api/password', routes.user.resetPassword)
server.put('/api/password', guard.jwtVerify, routes.user.updatePassword)
server.post('/api/mobile', guard.jwtVerify, routes.user.bindMobile)

server.get('/api/categories', routes.category.getAll)
server.post('/api/categories', guard.jwtVerify, routes.category.post)
server.put('/api/categories/:id', guard.jwtVerify, guard.adminRequired, routes.category.put)
server.del('/api/categories/:id', guard.jwtVerify, guard.adminRequired, routes.category.del)

server.get('/api/comments', routes.comment.getByBlog)
server.post('/api/comments', guard.jwtVerify, routes.comment.post)
// server.get('/api/comments/:id', routes.comment.getOne)
// server.put('/api/comments/:id', guard.jwtVerify, routes.comment.put)
server.del('/api/comments/:id', guard.jwtVerify, routes.comment.del)

// server.get('/api/replies', routes.reply.get)
server.post('/api/replies', guard.jwtVerify, routes.reply.post)
// server.get('/api/replies/:id', routes.reply.getOne)
// server.put('/api/replies/:id', guard.jwtVerify, routes.reply.put)
// server.del('/api/replies/:id', guard.jwtVerify, routes.reply.del)

server.get('/api/blogs', routes.blog.getAll)
server.post('/api/blogs', guard.jwtVerify, routes.blog.post)
server.get('/api/blogs/:id', routes.blog.getOne)
server.put('/api/blogs/:id', guard.jwtVerify, routes.blog.put)
server.del('/api/blogs/:id', guard.jwtVerify, routes.blog.del)

server.get('/api/tags', routes.tag.getAll)
// server.post('/api/tags', guard.jwtVerify, routes.tag.post)
// server.get('/api/tags/:id', routes.tag.getOne)
// server.put('/api/tags/:id', guard.jwtVerify, routes.tag.put)
server.del('/api/tags/:id', guard.jwtVerify, routes.tag.del)

server.get('/api/groups', routes.group.getAll)
server.post('/api/groups', guard.jwtVerify, guard.adminRequired, routes.group.post)
server.put('/api/groups/:id', guard.jwtVerify, guard.adminRequired, routes.group.put)
server.del('/api/groups/:id', guard.jwtVerify, guard.adminRequired, routes.group.del)

server.get('/api/permissions', guard.jwtVerify, guard.adminRequired, routes.permission.get)
server.post('/api/permissions', guard.jwtVerify, guard.adminRequired, routes.permission.post)
server.put('/api/permissions/:id', guard.jwtVerify, guard.adminRequired, routes.permission.put)
server.del('/api/permissions/:id', guard.jwtVerify, guard.adminRequired, routes.permission.del)

server.get('/api/groupPermission', guard.jwtVerify, routes.groupPermission.get)
server.put('/api/groupPermission', guard.jwtVerify, guard.adminRequired, routes.groupPermission.batchPut)
server.post('/api/groupPermission', guard.jwtVerify, guard.adminRequired, routes.groupPermission.post)
server.put('/api/groupPermission/:id', guard.jwtVerify, guard.adminRequired, routes.groupPermission.put)
server.del('/api/groupPermission/:id', guard.jwtVerify, guard.adminRequired, routes.groupPermission.del)

server.get('/api/repos', routes.repo.get)
server.post('/api/repos', guard.jwtVerify, routes.repo.post)
server.get('/api/repos/:slug', routes.repo.getOne)
server.put('/api/repos/:slug', guard.jwtVerify, routes.repo.put)
server.del('/api/repos/:slug', guard.jwtVerify, routes.repo.del)

server.get('/api/views/:view', guard.jwtVerify, async function (req, res) {
  const { view } = req.params, { arg } = req.query
  const result = await routes.view[view](arg, req, res)
  if (result === undefined) return

  res.json({ code: 0, data: result })
})

server.post('/api/files', routes.system.upload)
server.post('/api/verifyCode', routes.system.sendVerifyCode)

server.get('/', restify.plugins.serveStatic({
  directory: '../dist',
  default: 'index.html'
}))

server.get('/*/*.html', restify.plugins.serveStatic({
  directory: '../dist'
}))

server.get('/(js|css|img|fonts/*', restify.plugins.serveStatic({
  directory: '../dist'
}))

server.get('/upload/*', restify.plugins.serveStatic({
  directory: '../server'
}))

server.on('restifyError', function (req, res, err, callback) {
  res.json(makeSequelizeError(err))
})

server.listen(config.serverPort, () => console.log('%s listening at %s', server.name, server.url))
