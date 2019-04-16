<template>
  <nav class="nav">
    <div class="container">
      <div class="l">
        <div class="logo">
          <a href="/"><img src="/img/logo.png"></a>
        </div>
        <!--<v-search placeholder="暂不支持搜索"></v-search>-->
      </div>
      <div class="r">
        <div class="item" v-if="user.id === undefined">
          <a class="link" href="/login.html">登录</a>
        </div>
        <div class="v-dropdown-wrap user" v-else>
          <div class="d-trigger user-avatar">
            <v-icon icon="user"></v-icon>
            <div class="user-name">{{ user.username }}</div>
          </div>
          <div class="v-dropdown">
            <div class="d-item"><a href="/home.html"><v-icon icon="home"></v-icon>个人中心</a></div>
            <div class="d-item" v-if="isAdmin"><a href="/admin.html"><v-icon icon="dashboard"></v-icon>后台管理</a></div>
            <div class="d-divider"></div>
            <div class="d-item" @click="logout"><a><v-icon icon="logout"></v-icon>退出登录</a></div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    name: 'v-navbar',
    data() {
      return {
        isAdmin: this.user.roles.split(',').includes('99'),
        isShowCreateCollaboration: false,
        permissions: {}
      }
    },
    props: {
      user: Object
    },
    methods: {
      async logout() {
        localStorage.removeItem('token')
        sessionStorage.clear()
        sessionStorage.logoutPage = location.href
        location.href = '/login.html'
      }
    }
  }
</script>
