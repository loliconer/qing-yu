<template>
  <form class="layout-sign" @submit.prevent="reset">
    <input type="hidden" name="type" v-model="type">
    <!--手机号/邮箱-->
    <div class="row">
      <label class="label" v-if="icons">
        <v-icon icon="user"></v-icon>
      </label>
      <v-input :type="dict.targetType" :name="type" v-model="target" :placeholder="dict.targetPlaceholder" effect required></v-input>
    </div>

    <!--验证码-->
    <div class="row verify-code">
      <div class="controls">
        <v-input :name="dict.verifyCodeInputName" placeholder="验证码" effect required></v-input>
        <v-button-send :method="dict.sendMethod" :target="target" action="reset" url="verifyCode"></v-button-send>
      </div>
    </div>

    <!--密码-->
    <div class="row pwd">
      <v-input type="password" name="password" v-model="password" placeholder="新密码" effect required></v-input>
      <v-pwd-validity :password="password" @validity="val => pwdValid = val"></v-pwd-validity>
    </div>

    <div class="row submit">
      <v-button :loading="loading" submit>重置密码</v-button>
    </div>
    <div class="row bottom">
      <template v-if="enableMobilePhone">
        <a class="link" @click="type = type === 'email' ? 'mobile' : 'email'">{{dict.resetVia}}</a>
      </template>
      <div class="r">
        <a class="link" @click="$emit('to-login')">返回登录</a>
      </div>
    </div>
  </form>
</template>
<script>
  export default {
    name: 'c-reset',
    data() {
      return {
        type: 'email',
        target: '',
        password: '',
        loading: false,
        pwdValid: false
      }
    },
    props: {
      enableMobilePhone: Boolean,
      icons: Boolean
    },
    computed: {
      dict() {
        if (this.type === 'email') {
          return {
            targetPlaceholder: '邮箱',
            targetType: 'email',
            verifyCodeInputName: 'emailCode',
            sendMethod: 'email',
            resetVia: '手机号找回'
          }
        }

        if (this.type === 'mobile') {
          return {
            targetPlaceholder: '手机号',
            targetType: 'text',
            verifyCodeInputName: 'smsCode',
            sendMethod: 'sms',
            resetVia: '邮箱找回'
          }
        }
      }
    },
    methods: {
      async reset(ev) {
        if (this.loading) return

        this.loading = true
        const body = await $fetch.form('password', new FormData(ev.target)).catch(this.error)
        this.loading = false

        if (body === undefined) return

        this.success('重置成功')
        this.resetReset()
      },
      resetReset() {
        this.email = ''
        this.mobile = ''
        this.password = ''
        this.$emit('to-login')
      }
    }
  }
</script>
