<template>
  <div class="child-notify">
    <div class="mod-item-bar">
      <div class="i-head">
        <div class="i-name">新闻</div>
        <div class="i-tip">以电子邮件向你发送</div>
        <div class="i-op">
          <v-switch v-model="news"></v-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './notify.less'

  export default {
    name: 'Notify',
    data() {
      return {
        news: true
      }
    }
  }
</script>
