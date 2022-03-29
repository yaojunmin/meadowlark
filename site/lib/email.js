const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')

module.exports = credentials => {
  const mailTransport = nodemailer.createTransport({
    service: 'QQ',
    auth: {
      // 发件人邮箱账号
      user: credentials.sendgrid.user,
      //发件人邮箱的授权码
      pass: credentials.sendgrid.password,
    },
    /**下面不传不影响 */
    // secure:true for port 465, secure:false for port 587
    // port: 465, // SMTP 端口
    // secure: true, // 使用了 SSL
    // host: 'smtp.qq.com',
  })

  // 发件人 邮箱  '昵称<发件人邮箱>'
  const from = `"yjm"<562126964@qq.com>`

  return {
    send: (to, subject, html, path) => {
      return mailTransport.sendMail({
        from,
        to,
        subject,
        html,
        text: htmlToFormattedText(html),
        // 附件
        attachments: [
          {
            filename: 'email',
            path: path,
            cid: '00002'  // should be as unique as possible 尽可能唯一
          }
        ]
      })
    }
  }
}