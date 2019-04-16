import 'src/js/base'
import App from './App.vue'
import './app.less'
import $utils from 'src/js/utils'

Vue.config.productionTip = false

$fetch.get('user').then(user => {
  new Vue({
    render: h => h(App, {
      props: { user }
    })
  }).$mount('app')
}).catch($utils.handleInitPageError)
