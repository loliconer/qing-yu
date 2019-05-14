<template>
  <div class="v-share">
    <div class="s-wechat" title="分享至微信" @click.stop="showWechatQrcode">
      <v-icon icon="wechat-o"></v-icon>
      <div class="qrcode-wrap" v-if="isShowWechatQrcode" @click.stop>
        <vue-qrcode :value="url" :size="120" level="H"></vue-qrcode>
        <p class="tip-text">用微信扫码二维码，分享至好友和朋友圈</p>
      </div>
    </div>
    <div title="分享至微博" @click="shareToSina"><v-icon icon="sina-o"></v-icon></div>
    <div title="分享至QQ" @click="shareToQQ"><v-icon icon="qq-o"></v-icon></div>
  </div>
</template>
<script>
  const script = document.createElement('script')
  script.src = '/js/vendors/qrcode.vue.min.js'
  document.body.appendChild(script)

  export default {
    name: 'v-share',
    data() {
      return {
        isShowWechatQrcode: false
      }
    },
    props: {
      url: String,
      title: String
    },
    methods: {
      shareToSina() {
        const url = encodeURIComponent(this.url)
        const shareUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${this.title}`
        window.open(shareUrl)
      },
      shareToQQ() {
        const url = encodeURIComponent(this.url)
        const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.title}`
        window.open(shareUrl)
      },
      showWechatQrcode() {
        if (typeof QrcodeVue === 'undefined') return this.warn('请稍后重试')

        Vue.component('vue-qrcode', QrcodeVue)
        this.isShowWechatQrcode = true
      }
    },
    mounted() {
      window.addEventListener('click', () => this.isShowWechatQrcode = false)
    }
  }
</script>
