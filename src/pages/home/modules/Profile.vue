<template>
  <div class="child-profile">
    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">头像</div>
        <div class="i-tip"><v-icon icon="user" size="30"></v-icon></div>
        <div class="i-op"></div>
      </div>
    </div>

    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">用户名</div>
        <div class="i-tip">{{user.username}}</div>
        <div class="i-op"></div>
      </div>
    </div>

    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">邮箱</div>
        <div class="i-tip">{{user.email}}</div>
        <div class="i-op"></div>
      </div>
    </div>

    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">手机号</div>
        <div class="i-tip">{{user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</div>
        <div class="i-op"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import './profile.less'

  export default {
    data() {
      return {}
    },
    props: {
      user: Object
    }
  }
</script>
