import '../less/style.less'
import {$fetch} from '@lovue/utils'
import VPwdValidity from '../components/PwdValidity.vue'
import VNavbar from '../components/Navbar.vue'
import VUploadButton from '../components/UploadButton.vue'
import VTag from '../components/Tag.vue'
import VTree from '../components/Tree.vue'
import Article from '../components/Article.vue'
import Comment from '../components/Comment.vue'

$fetch.setHeader('x-access-token', localStorage.token)
window.$fetch = $fetch

Vue.config.productionTip = false
Vue.component(VPwdValidity.name, VPwdValidity)
Vue.component(VNavbar.name, VNavbar)
Vue.component(VUploadButton.name, VUploadButton)
Vue.component(VTag.name, VTag)
Vue.component(VTree.name, VTree)
Vue.component(Article.name, Article)
Vue.component(Comment.name, Comment)
