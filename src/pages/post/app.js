import 'src/js/base'
import init from 'src/js/init'
import App from './App.vue'
import './app.less'

Vue.component(vueStackedit.name, vueStackedit)

init().then(user => {
  new Vue({
    render: h => h(App, {
      props: { user }
    })
  }).$mount('app')
})
