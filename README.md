# 轻语

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![](https://img.shields.io/github/stars/loliconer/qing-yu.svg)

供团队内部使用的共享文档库。内网部署，使用sqlite数据库，npm install 之后即可使用。

技术栈：Vue.js + Restify + SQlite3 + JWT

Markdown编辑器：[vue-stackedit](https://github.com/loliconer/vue-stackedit)

## 开发
> npm run serve

## 部署
> npm run build  
> sh deploy.sh

配置nginx或Apache访问dist目录

## 生产环境安装

初始化数据库，自动生成管理员用户(admin/123456)，设置基本权限
> sh install.sh

## 启动后台服务
> cd server  
> forever start app.js

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
