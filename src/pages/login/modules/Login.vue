<template>
  <form class="layout-sign" @submit.prevent="login">
    <input type="hidden" name="type" v-model="type">
    <template v-if="type === 'pwd'">
      <div class="row">
        <label class="label" v-if="icons">
          <v-icon icon="user"></v-icon>
        </label>
        <v-input name="username" placeholder="手机号/邮箱" effect required></v-input>
      </div>
      <div class="row">
        <label class="label" v-if="icons">
          <v-icon icon="guard"></v-icon>
        </label>
        <v-input type="password" name="password" placeholder="密码" effect required></v-input>
      </div>
    </template>

    <template v-if="type === 'sms'">
      <div class="row">
        <label class="label" v-if="icons"></label>
        <v-input name="mobile" v-model="mobile" placeholder="手机号" effect required></v-input>
      </div>

      <div class="row verify-code">
        <label class="label" v-if="icons"></label>
        <div class="controls">
          <v-input name="smsCode" placeholder="验证码" effect required></v-input>
          <v-button-send :target="mobile" action="login" url="verifyCode"></v-button-send>
        </div>
      </div>
    </template>

    <div class="row submit">
      <v-button :loading="loadingLogin" submit>登录</v-button>
    </div>
    <div class="row bottom">
      <template v-if="enableMobilePhone">
        <div class="l" v-if="type === 'pwd'"><a class="link" @click="type = 'sms'">短信验证码登录</a></div>
        <div class="l" v-if="type === 'sms'"><a class="link" @click="type = 'pwd'">密码登录</a></div>
      </template>
      <div class="r">
        <a class="link" @click="$emit('to-reset')">无法登录</a>
        <a class="link" @click="$emit('to-register')">注册账号</a>
      </div>
    </div>
  </form>
</template>
<script>
import { getSearchParam } from '@lovue/utils'

export default {
  name: 'c-login',
  data() {
    return {
      type: 'pwd',
      mobile: '',
      loginCount: 0,
      loadingLogin: false
    }
  },
  props: {
    enableMobilePhone: Boolean,
    icons: Boolean
  },
  methods: {
    async login(ev) {
      if (this.loadingLogin) return

      this.loadingLogin = true
      const body = await $fetch.form('session', new FormData(ev.target)).catch(this.error)
      this.loadingLogin = false
      if (body === undefined) return

      localStorage.setItem('token', body)

      const next = getSearchParam('next')
      if (next) return location.href = next

      if (sessionStorage.logoutPage && !sessionStorage.logoutPage.includes('login.html')) {
        location.href = sessionStorage.logoutPage
      } else {
        location.href = '/index.html'
      }
    }
  }
}
</script>
