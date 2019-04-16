import Users from './modules/Users'

const Groups = () => import(/* webpackChunkName: "Groups" */'./modules/Groups')
const Permissions = () => import(/* webpackChunkName: "Permissions" */'./modules/Permissions')
const Categories = () => import(/* webpackChunkName: "Categories" */'./modules/Categories')
const Blogs = () => import(/* webpackChunkName: "Blogs" */'./modules/Blogs')

const routes = [
  { path: '/admin.html', component: Users },
  { path: '/admin/users.html', component: Users },
  { path: '/admin/groups.html', component: Groups },
  { path: '/admin/permissions.html', component: Permissions },
  { path: '/admin/categories.html', component: Categories },
  { path: '/admin/blogs.html', component: Blogs },
  {
    path: '*', component: {
      render: h => h('div', {}, 'Page not found')
    }
  }
]

export default new VueRouter({
  base: '/',
  mode: 'history',
  linkActiveClass: 'focus',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return { selector: to.hash }
    }

    return { y: 0 }
  },
  routes
})
