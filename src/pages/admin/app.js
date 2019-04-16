import 'src/js/base'
import init from 'src/js/init'
import App from './App.vue'
import './app.less'
import router from './router'

init().then(user => {
  const isAdmin = user.roles.split(',').includes('99')
  if (!isAdmin) return location.href = '/'

  new Vue({
    router,
    render: h => h(App, {
      props: { user }
    })
  }).$mount('app')
})
