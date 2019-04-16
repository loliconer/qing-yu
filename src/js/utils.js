export default {
  handleInitPageError(error) {
    if (error.code === 105) location.href = '/login.html'
  },
  makeCategoryTree(rows) {
    const result = []

    rows.forEach(row => {
      row.icon = 'folder-flat'
      row.children = []
      if (!row.parentId) {
        result.push(row)
      } else {
        const pathArr = row.path.split('-').map(id => Number(id))
        let index = 0, matched
        matched = result.find(row => row.id === pathArr[index])
        while (pathArr[index + 1]) {
          matched = matched.children.find(row => row.id === pathArr[index + 1])
          index++
        }
        matched.children.push(row)
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
