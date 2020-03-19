const {QINGYU_EMAIL_USER, QINGYU_EMAIL_PASS} = process.env

module.exports = {
  salt: 'L0hHEr57ciLczsiWtd5n0Q==',
  secret: 'ciLczsiW',
  aliyunAccessKeyId: '',
  aliyunAccessKeySecret: '',
  aliyunSMSSign: '',
  aliyunSMSTemplates: {
    login: '',
    register: '',
    bind: '',
    reset: ''
  },
  aliyunSMSDuration: 300,
  enableMobilePhone: false,
  limitCompany: false,
  companyDomain: 'gmail.com',
  serverPort: 8101,
  emailHost: 'smtp.163.com',
  emailUser: QINGYU_EMAIL_USER,
  emailPass: QINGYU_EMAIL_PASS
}
