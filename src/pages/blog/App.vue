<template>
  <div id="app" class="app-blog">
    <v-navbar :user="user" v-if="user.id"></v-navbar>
    <div class="container main">
      <av-article :blog="blog" v-if="blog.title !== undefined"></av-article>
      <av-comment :blog-id="blog.id" :username="user.username"></av-comment>
      <div class="mod-tools">
        <template v-if="blog.author === user.username">
          <div class="tool" title="编辑" @click="edit"><v-icon icon="edit"></v-icon></div>
          <div class="tool" title="删除" @click="del"><v-icon icon="delete"></v-icon></div>
        </template>
        <v-share :url="pageUrl" :title="blog.title"></v-share>
      </div>
    </div>
  </div>
</template>
<script>
  import VShare from 'src/components/Share.vue'

  export default {
    name: 'App',
    data() {
      return {
        pageUrl: location.href.replace('localhost', '192.168.4.194'),
        user: {},
        blog: {}
      }
    },
    components: { VShare },
    methods: {
      async getUser() {
        const body = await $fetch.get('user').catch(error => {
        })
        if (body === undefined) return

        this.user = body
      },
      async getBlog(id) {
        const body = await $fetch.get(`blogs/${id}`).catch(this.error)
        if (body === undefined) return

        body.attachments = JSON.parse(body.attachments)
        document.title = body.title

        if (body.type === 1) {
          body.content = marked(body.content)
          setTimeout(() => Prism.highlightAll(), 0)
        } else {
          const content = await $fetch.get(`collaboration/${body.slug}`).catch(this.error)
          if (content === undefined) return
          body.content = marked(content)
          setTimeout(() => Prism.highlightAll(), 0)
        }
        this.blog = body
      },
      edit() {
        location.href = `/post.html?id=${this.blog.id}`
      },
      del() {
        const blogId = this.blog.id
        this.modal({
          content: '确定删除吗？',
          fixed: true,
          async confirm() {
            const body = await $fetch.delete(`blogs/${blogId}`).catch(this.error)
            if (body === undefined) return

            this.success('删除成功')
            setTimeout(() => location.href = '/', 2400)
          }
        })
      }
    },
    created() {
      this.getUser()
      this.getBlog(utils.getSearchParam('id'))
    },
    mounted() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        mangle: false
      })
    }
  }
</script>
