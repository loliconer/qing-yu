<template>
  <div class="app-login">
    <section>
      <a class="logo-wrap" href="/"><img class="logo" src="/img/logo.png"> 轻语</a>
      <c-login v-if="isShowLogin" @to-register="toRegister" @to-reset="toReset" :enable-mobile-phone="configs.enableMobilePhone"></c-login>
      <c-register v-if="isShowRegister" @to-login="toLogin" :configs="configs"></c-register>
      <c-reset v-if="isShowReset" @to-login="toLogin" :enable-mobile-phone="configs.enableMobilePhone"></c-reset>
    </section>
  </div>
</template>

<script>
  import CLogin from './modules/Login'
  import CRegister from './modules/Register'
  import CReset from './modules/Reset'

  export default {
    name: 'App',
    data() {
      return {
        isShowLogin: true,
        isShowRegister: false,
        isShowReset: false,
        configs: {}
      }
    },
    components: { CLogin, CRegister, CReset },
    methods: {
      toRegister() {
        this.isShowLogin = false
        this.isShowReset = false
        this.isShowRegister = true
      },
      toLogin() {
        this.isShowLogin = true
        this.isShowRegister = false
        this.isShowReset = false
      },
      toReset() {
        this.isShowLogin = false
        this.isShowRegister = false
        this.isShowReset = true
      }
    },
    async created() {
      const body = await $fetch.get('configs').catch(this.error)
      if (body === undefined) return

      this.configs = body
    }
  }
</script>
