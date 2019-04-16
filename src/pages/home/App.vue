<template>
  <div id="app" class="app-home">
    <v-navbar :user="user"></v-navbar>
    <div class="container main">
      <aside class="l">
        <div class="mod-avatar">
          <div class="img-wrap"><v-icon icon="user" size="40"></v-icon></div>
          <span class="username">{{user.username}}</span>
        </div>
        <div class="mod-aside-nav">
          <div class="an-item" :class="menu.css" @click="clickMenu(menu)" v-for="menu of menus">
            <v-icon :icon="menu.icon"></v-icon>{{menu.name}}
          </div>
        </div>
      </aside>
      <div class="content r">
        <child-profile :user="user" v-if="currentMenu === 1"></child-profile>
        <child-security :user="user" v-if="currentMenu === 2"></child-security>
        <child-notify :user="user" v-if="currentMenu === 3"></child-notify>
        <child-history :user="user" v-if="currentMenu === 4"></child-history>
        <child-repo :user="user" v-if="currentMenu === 5"></child-repo>
      </div>
    </div>
  </div>
</template>
<script>
  import ChildSecurity from './modules/security/index.vue'
  import ChildProfile from './modules/Profile.vue'
  import ChildNotify from './modules/Notify.vue'
  import ChildHistory from './modules/History.vue'
  import ChildRepo from './modules/Repo.vue'

  export default {
    data() {
      return {
        menus: [
          { id: 1, name: '个人资料', icon: 'form', css: 'focus' },
          { id: 2, name: '安全中心', icon: 'guard' },
          { id: 3, name: '消息通知', icon: 'bells' },
          { id: 4, name: '文档', icon: 'history' },
          { id: 5, name: '知识库[正在开发中]', icon: 'repo' }
        ],
        currentMenu: 1
      }
    },
    props: {
      user: Object
    },
    components: {
      ChildSecurity,
      ChildProfile,
      ChildNotify,
      ChildHistory,
      ChildRepo
    },
    methods: {
      clickMenu(menu) {
        this.currentMenu = menu.id
        this.menus.forEach(menu => menu.css = '')
        menu.css = 'focus'
      }
    }
  }
</script>
