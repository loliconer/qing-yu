export default {
  handleInitPageError(error) {
    if (error.code === 105) location.href = '/login.html'
  },
  makeCategoryTree(rows) {
    const result = []
    const indexes = {}

    rows.forEach((row, i) => {
      row.icon = 'folder-flat'
      row.expand_ = false
      row.children = []
      indexes[row.id] = i
    })

    rows.forEach(row => {
      if (!row.parentId) {
        result.push(row)
      } else {
        rows[indexes[row.parentId]] && rows[indexes[row.parentId]].children.push(row)
      }
    })

    return result
  },
  findChild(rows, id) {
    return rows.find(row => row.id === id)
  }
}

export function genSlug(length = 6) {
  const str = '123456789abcdefghijklmnopqrstuvwxyz'
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map(num => str[num % str.length]).join('')
}
