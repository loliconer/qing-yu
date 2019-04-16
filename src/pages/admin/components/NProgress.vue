<template></template>
<script>
  export default {
    name: 'NProgress',
    props: {
      parent: String
    },
    created() {
      this.parent && NProgress.configure({
        parent: this.parent,
        showSpinner: false
      })

      this.$router.beforeEach((to, from, next) => {
        NProgress.start()
        next()
      })

      this.$router.afterEach((to, from) => {
        NProgress.done()
      })
    }
  }
</script>
