<template>
  <div class="child-security">
    <div class="last-login">上次登录时间：{{user.lastLoginTime}}</div>
    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">登录密码</div>
        <div class="i-tip">修改登录系统的密码</div>
        <div class="i-op">
          <v-button @click="isShowPassword = true" v-if="!isShowPassword" :key="1">修改</v-button>
          <v-button type="text" @click="isShowPassword = false" v-else :key="2">取消</v-button>
        </div>
      </div>
      <div class="i-body" v-if="isShowPassword">
        <child-password></child-password>
      </div>
    </div>

    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">手机绑定</div>
        <div class="i-tip">{{user.mobile ? user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '用于手机号登录及收取验证码'}}</div>
        <div class="i-op">
          <template v-if="!isShowMobile">
            <v-button @click="isShowMobile = true" v-if="!user.mobile" :key="3">添加</v-button>
            <v-button @click="isShowMobile = true" v-else :key="3">修改</v-button>
          </template>
          <v-button type="text" @click="isShowMobile = false" v-else :key="4">取消</v-button>
        </div>
      </div>
      <div class="i-body" v-if="isShowMobile">
        <child-mobile></child-mobile>
      </div>
    </div>
  </div>
</template>
<script>
  import './index.less'
  import ChildPassword from './Password.vue'
  import ChildMobile from './Mobile.vue'

  export default {
    data() {
      return {
        isShowPassword: false,
        isShowMobile: false
      }
    },
    props: {
      user: Object
    },
    components: { ChildPassword, ChildMobile }
  }
</script>
