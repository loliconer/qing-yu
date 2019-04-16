<template>
  <form class="layout-sign" name="registerForm" @submit.prevent="register">
    <!--邮箱-->
    <div class="row validity">
      <v-input type="email" name="email" v-model="email" placeholder="邮箱" effect required></v-input>
      <div class="invalid-info" v-if="email && !emailValid">{{emailInvalidInfo}}</div>
    </div>

    <!--验证码-->
    <div class="row verify-code">
      <div class="controls">
        <v-input name="emailCode" placeholder="验证码" effect required></v-input>
        <v-button-send method="email" :target="email" action="register" url="verifyCode"></v-button-send>
      </div>
    </div>

    <!--密码-->
    <div class="row pwd">
      <v-input type="password" name="password" v-model="password" placeholder="登录密码" effect required></v-input>
      <v-pwd-validity :password="password" @validity="val => pwdValid = val"></v-pwd-validity>
    </div>

    <div class="row submit">
      <v-button :loading="loading" submit>注册</v-button>
    </div>

    <div class="row bottom">
      <div class="r">
        <a class="link" @click="$emit('to-login')">已有账号登录</a>
      </div>
    </div>
  </form>
</template>
<script>
  export default {
    name: 'c-register',
    data() {
      return {
        type: 'email',
        username: '',
        email: '',
        emailInvalidInfo: '邮箱格式不正确',
        password: '',
        password2: '',
        pwdValid: false,
        loading: false,
        noCaptchaVerified: false
      }
    },
    props: {
      configs: Object,
    },
    computed: {
      emailValid() {
        return /.+@.+/.test(this.email)
      }
    },
    methods: {
      async register(ev) {
        if (!this.pwdValid) return
        if (this.configs.limitCompany && !this.email.endsWith(`@${this.configs.companyDomain}`))
          return this.warn('仅限本公司员工注册')

        if (this.loading) return

        this.loading = true
        const data = new FormData(ev.target)
        data.append('type', this.type)
        const body = await $fetch.form('users', data).catch(this.error)
        this.loading = false
        if (body === undefined) return

        this.success('注册成功')
        this.resetRegister()
      },
      resetRegister() {
        this.password = ''
        this.pwdValid = false
        this.username = ''
        this.email = ''
        this.$emit('to-login')
      }
    }
  }
</script>
