const fs = require('fs')
const path = require('path')
const dir = `src/pages/${process.argv[2]}`

function mkdir(dir) {
  if (!fs.existsSync(path.dirname(dir))) mkdir(path.dirname(dir))
  fs.mkdirSync(dir)
}

mkdir(dir)

const jsContent = `import 'src/js/base'
import init from 'src/js/init'
import App from './App.vue'
import './app.less'

init().then(user => {
  new Vue({
    render: h => h(App, {
      props: { user }
    })
  }).$mount('app')
}).catch(error => console.error(error))
`
const lessContent = `@import (reference) "~src/less/Mixins";`
const vueContent = `<template>
  <div id="app">
    <nav-bar :user="user"></nav-bar>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data() {
      return {}
    },
    props: {
      user: Object
    },
    methods: {},
    created() {}
  }
</script>`

fs.writeFile(`${dir}/app.js`, jsContent, err => {
  if (err) throw err
})
fs.writeFile(`${dir}/app.less`, lessContent, err => {
  if (err) throw err
})
fs.writeFile(`${dir}/App.vue`, vueContent, err => {
  if (err) throw err
})
