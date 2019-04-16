<template>
  <div class="child-pwd">
    <form class="layout-form" @submit.prevent="submit">
      <!--当前密码-->
      <div class="row">
        <label class="label">当前密码</label>
        <v-input type="password" name="oldPassword" effect></v-input>
      </div>

      <!--新密码-->
      <div class="row">
        <label class="label">新密码</label>
        <v-input type="password" name="newPassword" effect></v-input>
      </div>

      <!--确认密码-->
      <div class="row">
        <label class="label">确认密码</label>
        <v-input type="password" effect></v-input>
      </div>

      <!--提交-->
      <div class="row submit">
        <label class="label"></label>
        <v-button :loading="loading" submit>确认</v-button>
      </div>
    </form>
  </div>
</template>
<script>
  import './password.less'

  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      async submit(ev) {
        if (this.loading) return
        this.loading = true

        const form = ev.target
        const body = await $fetch.put('password', {
          oldPassword: form.oldPassword.value,
          newPassword: form.newPassword.value
        }).catch(this.error)
        this.loading = false
        if (body === undefined) return

        this.success('修改成功，请重新登录')
        sessionStorage.clear()
        setTimeout(() => location.href = '/login.html', 2400)
      }
    }
  }
</script>
