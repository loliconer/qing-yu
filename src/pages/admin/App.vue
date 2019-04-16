<template>
  <div id="app">
    <div class="layout-lr layout-admin" :class="{collapsed: asideCollapsed}">
      <div class="l">
        <aside class="mod-aside-admin" :class="{collapsed: asideCollapsed}">
          <div class="logo">
            <a href="/">
              <img src="/img/logo.png" alt="logo">
              <span>后台管理</span>
            </a>
          </div>
          <v-menu :class="{collapsed: asideCollapsed}" :menus="menus" mode="spa" vertical></v-menu>
        </aside>
      </div>
      <div class="r">
        <nav class="nav-admin">
          <div class="toggle-aside" @click="asideCollapsed = !asideCollapsed"><v-icon :icon="`menu-${asideCollapsed?'fold':'unfold'}`"></v-icon></div>
          <div class="nav-items">
            <!--<div class="ni-search">
              <v-icon icon="search"></v-icon>
            </div>
            <div class="ni-notify">
              <v-icon icon="bell"></v-icon>
            </div>-->
            <div class="v-dropdown-wrap ni-user">
              <div class="d-trigger user-name"><v-icon icon="user"></v-icon>{{user.username}}</div>
              <div class="v-dropdown">
                <div class="d-item"><a href="/home.html"><v-icon icon="home"></v-icon>个人中心</a></div>
                <div class="d-divider"></div>
                <div class="d-item" @click="logout"><a><v-icon icon="logout"></v-icon>退出登录</a></div>
              </div>
            </div>
          </div>
        </nav>
        <div class="content">
          <n-progress parent=".content"></n-progress>
          <transition name="router" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import NProgress from './components/NProgress.vue'

  export default {
    data() {
      return {
        menus: [
          {
            name: '用户', icon: 'dashboard',
            children: [
              { name: '用户管理', url: '/admin/users.html' },
              { name: '用户组管理', url: '/admin/groups.html' },
              // { name: '角色管理', url: '/admin/roles.html' },
              { name: '权限管理', url: '/admin/permissions.html' },
              { name: '版块管理', url: '/admin/categories.html' },
              { name: '文章管理', url: '/admin/blogs.html' }
            ]
          }
        ],
        asideCollapsed: false
      }
    },
    props: {
      user: Object
    },
    components: { NProgress },
    watch: {
      asideCollapsed(val) {
        sessionStorage.asideCollapsed = val
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('token')
        sessionStorage.clear()
        sessionStorage.logoutPage = location.href
        location.reload()
      }
    },
    created() {
      this.asideCollapsed = sessionStorage.asideCollapsed ? JSON.parse(sessionStorage.asideCollapsed) : false
    }
  }
</script>
