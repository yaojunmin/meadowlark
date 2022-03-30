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