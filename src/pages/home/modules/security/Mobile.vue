<template>
  <div class="child-mobile">
    <form class="layout-form" @submit.prevent="submit">
      <!--手机号-->
      <div class="row">
        <label class="label">手机号</label>
        <v-input v-model="mobile" name="mobile" effect></v-input>
      </div>

      <!--验证码-->
      <div class="row">
        <label class="label">短信验证码</label>
        <div class="controls">
          <v-input name="smsCode" effect></v-input>
          <v-button-send :target="mobile" action="bind" url="verifyCode"></v-button-send>
        </div>
      </div>

      <!--提交-->
      <div class="row">
        <label class="label"></label>
        <v-button :loading="loading" submit>确认</v-button>
      </div>
    </form>
  </div>
</template>
<script>
  import './mobile.less'

  export default {
    data() {
      return {
        mobile: '',
        loading: false
      }
    },
    methods: {
      async submit(ev) {
        if (this.loading) return
        this.loading = true

        const body = await $fetch.form('mobile', new FormData(ev.target)).catch(this.error)
        this.loading = false
        if (body === undefined) return

        this.success('绑定成功')
        setTimeout(() => location.reload(), 2400)
      }
    }
  }
</script>
