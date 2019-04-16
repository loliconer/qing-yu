<template>
  <div id="app" class="app-index">
    <v-navbar :user="user"></v-navbar>
    <div class="container main">
      <!--left-->
      <aside class="left">
        <div class="mod-tree">
          <v-tree :source="categories" :default-focus="defaultOpenFile" @click="clickItem"></v-tree>
        </div>
      </aside>

      <!--content-->
      <div class="content">
        <template v-if="blog.id !== undefined">
          <av-article :blog="blog"></av-article>
          <av-comment :blog-id="blog.id" :username="user.username"></av-comment>
        </template>
      </div>

      <!--right-->
      <div class="right">
        <div class="mod-tools">
          <div class="tool" title="写文章" v-if="canPostNewBlog"><a href="/post.html"><v-icon icon="plus"></v-icon></a></div>
          <template v-if="blog.author === user.username">
            <div class="tool" title="编辑" @click="edit"><v-icon icon="edit"></v-icon></div>
            <div class="tool" title="删除" @click="del"><v-icon icon="delete"></v-icon></div>
          </template>
          <div class="tool" title="新窗口打开" v-if="blog.id"><a :href="`/blog.html?id=${blog.id}`" target="_blank"><v-icon icon="window"></v-icon></a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import userCategories from 'src/js/mixins/userCategories'

  export default {
    name: 'App',
    mixins: [userCategories],
    data() {
      return {
        blog: {},
        defaultOpenFile: ''
      }
    },
    props: {
      user: Object
    },
    computed: {
      canPostNewBlog() {
        return this.permissions.PostNewBlog === true || this.permissions.PostNewBlog === undefined
      }
    },
    methods: {
      async getInitData() {
        await this.getPermissions()
        this.categories = this.makeStandardCategoryTree(await this.getCategories())
        this.renderFirstBlog()
      },
      makeStandardCategoryTree(categories) {
        const categoryIndexes = {}, result = []

        categories.forEach(item => {
          categoryIndexes[item.id] = {
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            key: 'folder' + item.id,
            isDir: true,
            icon: 'folder-flat',
            count: item.blogsCount,
            expand_: false,
            loading_: false,
            children: []
          }
        })

        categories.forEach(item => {
          if (!item.parentId) {
            result.push(categoryIndexes[item.id])
          } else {
            categoryIndexes[item.parentId].children.push(categoryIndexes[item.id])
          }
        })
        return result
      },
      async renderFirstBlog() {
        if (!this.categories.length) return

        await this.getSimpleBlogs(this.categories[0])

        let firstBlogId
        for (let child of this.categories[0].children) {
          if (!child.isDir) {
            firstBlogId = child.id
            break
          }
        }
        if (firstBlogId) {
          this.defaultOpenFile = `file${firstBlogId}`
          this.getBlog(firstBlogId)
        }
      },
      async getSimpleBlogs(category) {
        category.loading_ = true
        const body = await $fetch.get(`blogs?categories=${category.id}&fields=id,title,categoryId,type,slug`).catch(this.error)
        category.loading_ = false
        if (body === undefined) return
        if (body.length === 0) return this.warn('暂无文章')

        category.children = category.children.filter(child => child.isDir)
        body.forEach(blog => {
          category.children.push({
            id: blog.id,
            name: blog.title,
            key: 'file' + blog.id,
            isDir: false,
            icon: 'file',
            focus_: false
          })
        })
        category.expand_ = true
        return true
      },
      clickItem(item) {
        if (item.isDir) {
          item.expand_ ? (item.expand_ = false) : this.getSimpleBlogs(item)
        } else {
          this.getBlog(item.id)
        }
      },
      async getBlog(id) {
        const body = await $fetch.get(`blogs/${id}`).catch(this.error)
        if (body === undefined) return

        body.attachments = JSON.parse(body.attachments)
        this.blog = body
        this.blog.content = marked(body.content)
        setTimeout(() => Prism.highlightAll(), 0)
        this.$nextTick(() => renderMathInElement(document.querySelector('article.blog .a-content'), {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ]
        }))
      },
      edit() {
        location.href = `/post.html?id=${this.blog.id}`
      },
      del() {
        const blogId = this.blog.id
        this.modal({
          content: '确定删除吗？',
          fixed: true,
          async: true,
          async confirm() {
            const body = await $fetch.delete(`blogs/${blogId}`).catch(this.error)
            if (body === undefined) return

            this.success('删除成功')
            setTimeout(() => location.reload(), 2400)
            return true
          }
        })
      }
    },
    created() {
      this.getInitData()
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
