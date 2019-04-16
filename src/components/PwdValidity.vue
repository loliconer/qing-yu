<template>
  <div class="vue-pwd-validity">
    <span v-if="!valid">{{invalidInfo}}</span>
    <v-pwd-strength :password="password" :minLength="minPwdLength" v-else></v-pwd-strength>
  </div>
</template>
<script>
  export default {
    name: 'v-pwd-validity',
    data() {
      return {
        minPwdLength: 3,
        valid: false,
        invalidInfo: ''
      }
    },
    props: {
      password: String
    },
    watch: {
      password(val) {
        if (val.length < this.minPwdLength) {
          this.invalidInfo = val === '' ? '' : `密码长度至少${this.minPwdLength}位`
          this.valid = false
        } else {
          this.valid = true
        }

        this.$emit('validity', this.valid)
      }
    }
  }
</script>
