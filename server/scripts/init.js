const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../doc.db')
const fs = require('fs')

fs.readFile('init.sql', 'utf8', (err, data) => {
  if (err) throw err

  db.exec(data, function (err) {
    if (err !== null) {
      console.error(err)
    } else {
      console.log('Succeed!')
    }
  })
})
