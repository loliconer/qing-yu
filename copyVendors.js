const fs = require('fs')

fs.copyFileSync('node_modules/lovue/dist/lovue.min.js', 'public/js/vendors/lovue.min.js')
fs.copyFileSync('node_modules/lovue/dist/lovue.extension.min.js', 'public/js/vendors/lovue.extension.min.js')
fs.copyFileSync('node_modules/vue/dist/vue.runtime.js', 'public/js/vendors/vue.runtime.js')
fs.copyFileSync('node_modules/vue/dist/vue.runtime.min.js', 'public/js/vendors/vue.runtime.min.js')
// fs.copyFileSync('node_modules/vue/dist/vue.js', 'public/js/vendor/vue.js')
// fs.copyFileSync('node_modules/vue/dist/vue.min.js', 'public/js/vendor/vue.min.js')

fs.copyFileSync('node_modules/lovue/dist/normalize.min.css', 'public/css/vendors/normalize.min.css')
fs.copyFileSync('node_modules/lovue/dist/lovue.min.css', 'public/css/vendors/lovue.min.css')
fs.copyFileSync('node_modules/lovue/dist/lovue.extension.min.css', 'public/css/vendors/lovue.extension.min.css')
