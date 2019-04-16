const localizeDateField = function (field, literal, table) {
  const fullField = table ? `${table}.${field}` : field
  return [literal(`Datetime(${fullField}, "+8 hours")`), field]
}

module.exports = {
  generateSid(sidLength) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const length = chars.length
    let sid = Number(new Date).toString(36) + '-'

    for (let i = sid.length; i < sidLength; i++) {
      sid += chars[Math.trunc(Math.random() * length)]
    }

    return sid
  },
  generateVerifyCode(codeLength = 4) {
    const chars = '0123456789'
    let code = ''

    for (let i = 0; i < codeLength; i++) {
      code += chars[Math.trunc(Math.random() * 10)]
    }

    return code
  },
  makeSequelizeError(error) {
    let msg

    // SequelizeDatabaseError, SequelizeValidationError, SequelizeTimeoutError, SequelizeUniqueConstraintError
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
      case 'SequelizeDatabaseError':
        msg = error.original.message
        break
      case 'SequelizeValidationError':
        msg = error.errors.map(item => item.message).join(', ')
        break
      default:
        msg = error.message
        break
    }

    return { code: 1000, msg }
  },
  localizeDateField,
  makeQueryFields(fields, literal) {
    let include = fields.split(',')

    if (include.includes('createTime')) {
      include = include.filter(row => row !== 'createTime')
      include.push(localizeDateField('createTime', literal))
    }

    if (include.includes('updateTime')) {
      include = include.filter(row => row !== 'updateTime')
      include.push(localizeDateField('updateTime', literal))
    }

    if (include.includes('lastLoginTime')) {
      include = include.filter(row => row !== 'lastLoginTime')
      include.push(localizeDateField('lastLoginTime', literal))
    }

    return include
  },
  mergePermissions(rows) {
    const result = {}
    rows.forEach(row => {
      row.groupPermissions.forEach(gp => {
        if (result[gp.permission.code] === undefined) {
          let value = gp.value
          if (gp.permission.type === 'boolean') {
            value = Boolean(Number(value))
          } else {
            value = value === '' ? [] : value.split(',').map(v => +v)
            value = Array.from(new Set(value))
          }
          result[gp.permission.code] = value
        } else {
          let oldValue = result[gp.permission.code]
          let newValue = gp.value
          if (gp.permission.type === 'boolean') {
            newValue = Boolean(Number(newValue))
            result[gp.permission.code] = oldValue || newValue
          } else {
            if (newValue !== '') {
              newValue = newValue.split(',').map(v => +v)
            }
            result[gp.permission.code] = Array.from(new Set(oldValue.concat(newValue)))
          }
        }
      })
    })

    return result
  }
}
