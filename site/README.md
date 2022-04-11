# 网站

## 常用中间件
express的官方文档也包含一个中间件列表
- basicauth-middleware
  提供basic访问授权。
- body-parser
  提供对http请求body的解析。
- multiparty、multer
  提供解析multipart/form-data的请求body。（建议 multer）
- compression
  使用gzip或deflate压缩响应数据。（一般压缩由Nginx代理实现）
- cookie-parser
  提供Cookie支持。
- cookie-session
  提供cookie存储的session支持。（不推荐）
- express-session
  提供session id的session支持。
- csurf
  提供针对跨站请求伪造（CSRF）攻击的保护。
- serve-index
  为静态文件提供目录列表支持。
- errorhandler
  为客户端提供栈跟踪和错误信息。（不建议生产使用）
- serve-favicon
  提供favicon文件服务（显示在浏览器标题栏上的图标）
- morgan
  提供自动化的日志支持。
- method-override
  提供x-http-method-override请求头的支持，这个请求头允许浏览器‘伪装’成使用get和post以外的http方法。（写api用到）
- response-time
  把x-response-time头加到响应里，提供以毫秒级的响应时间。（性能优化用到）
- static
  提供静态文件服务的支持。
- vhost
  虚拟主机（vhost），使子域名管理更加容易。
- cross-env
  跨平台运行设置和使用环境变量

## 生产环境问题
### 进程管理
1. forever：直接易用
2. pm2：支持更多特性

### 网站扩展
- 垂直扩展
- 水平扩展：持久化、应用集群
### 集群
1. 不太理解
2. 压力测试

### 异常处理
1. 捕获异常处理
2. 未捕获异常处理：优雅关闭、故障转移（集群）、sentry

### 代理服务器
1. 开发环境 轻量级代理 node-http-proxy
2. 生产环境 Nginx

### 网站监控
- uptimerobot 第三方在线监控

### 压力测试
- artillery

## 持久化
### 文件系统持久化
- 适用：图片、音频、视频
- 伸缩性不好

### 云持久化

### 数据库持久化

## 路由
### 参数
1. params:动态
2. query:get
3. body:post

### 组织
1. 自动化路由处理函数（静态或固定）

## rest api
### 规划
### JOSN:API标准
### 跨域资源共享
1. cors npm包
### 自动化测试
1. postman
2. node-fetch:等价浏览器上的fetch api

## 静态内容
### 服务器端渲染网站
1. /static/* :静态文件存储
2. /*（除上面以外的任何路径）: express服务器、代理、负载均衡
### 单页应用
1. /api/*: express服务器、代理、负载均衡
2. /* 除上面以外的任何路径）: 静态文件存储
### 缓存破坏
1. 版本号：？version=2
2. 散列：mian.323rsdfv34Srf34.css