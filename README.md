<p align="center"><img width="150" src="./public/img/logo.svg"></p>

<p align="center">
  <a href="https://996.icu">
    <img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu">
  </a>
  <a href="https://github.com/996icu/996.ICU/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-Anti%20996-blue.svg" alt="LICENSE">
  </a>
  <img src="https://img.shields.io/github/stars/loliconer/qing-yu.svg">
</p>

<h1 align="center">轻语</h1>

供团队内部使用的共享文档库。内网部署，使用sqlite数据库，npm install 之后即可使用。

技术栈：Vue.js + Restify + SQlite3

身份验证：JWT  
UI组件库：[lovue](https://github.com/loliconer/lovue)  
Markdown编辑器：[vue-stackedit](https://github.com/loliconer/vue-stackedit)

## 完整模式，适合想二次开发并自定义部署的用户
- 启动开发环境
  > npm run serve
  > cd server
  > node app.js
- 编译并部署到生产环境，需要配置nginx或Apache，配置文件参考 `nginx.conf`
  > npm run build  
  > sh deploy.sh
- 生产环境安装运行，初始化数据库，自动生成管理员用户(admin/123456)，设置基本权限
  > sh install.sh
- 配置发送邮件的邮箱：`server/lib/config.js`
- 启动后台服务
  > sh run.sh

## 简易模式，适合不想自己开发，直接运行访问的用户
先配置发送邮件的邮箱：`server/lib/config.js`

默认访问端口：8101，可在`server/lib/config.js`修改
> sh oneKey.sh  
> sh run.sh

## 更新
> sh update.sh

## 已开发功能
- 注册
- 登录
- 新建文章
- 编辑文章
- 删除博客
- 查看单篇文章
- 文章评论
- 邮箱验证
- 修改密码
- 手机绑定
- 个人中心
- 个人资料
- 重置密码
- 用户权限
- 后台管理
- 多级目录
- 是否限制本公司员工注册
- 是否开启手机号登录注册(开启需要配置第三方短信服务)

## 待开发功能
- 第三方登录
- 标签管理
- 搜索
