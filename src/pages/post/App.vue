<template>
  <div id="app" class="app-post">
    <header class="header">
      <div class="logo">
        <a href="/"><img src="/img/logo.png"></a>
      </div>

      <div class="h-act">
        <v-button @click="isShowSetting = true">其他设置</v-button>
        <label class="mod-label-input">
          <span @click="startSelectCategory">选择版块</span>
          <v-input v-model="blog.category" readonly resize></v-input>
        </label>
        <input class="input title-input" name="title" v-model="blog.title" placeholder="文章标题" required>
      </div>

      <div class="h-submit">
        <v-button :loading="loading" @click="publish">{{submitText}}</v-button>
      </div>
    </header>

    <div class="container">
      <v-editor></v-editor>
    </div>

    <v-popup class="popup-category-tree" title="选择版块" v-model="isShowCategorySelector" no-footer fixed>
      <v-tree :source="categories" default-focus="file1" only-click-file @click="clickTreeItem"></v-tree>
    </v-popup>

    <v-popup class="popup-other" title="文档设置" v-model="isShowSetting" fixed>
      <div class="row">
        <label class="label">标签：</label>
        <v-tag :value="blog.tags" :tags="tags"></v-tag>
      </div>

      <div class="row upload">
        <label class="label">添加附件：</label>
        <v-upload-button ref="uploadAttachments" upload @select="uploadAttachments" :required="false"></v-upload-button>
        <div class="uploaded-files">
            <span class="appendix" v-for="attachment of blog.attachments">
              <a class="link" :href="attachment.url" target="_blank">{{attachment.name}}</a>
              <span @click="deleteAttachment(attachment.name)">X</span>
            </span>
        </div>
      </div>

      <div class="row">
        <textarea class="textarea intro-textarea" name="intro" v-model="blog.intro" placeholder="文章简介，限150个字，不填则取文章的前150个字。"></textarea>
      </div>
    </v-popup>
  </div>
</template>
<script>
import { getSearchParam } from '@lovue/utils'
import $utils from 'src/js/utils'
import userCategories from 'src/js/mixins/userCategories'

/*
 * 1. 创建普通文档
 * 2. 创建协作文档
 * 3. 编辑普通文档
 * 4. 编辑协作文档
 * */
export default {
  name: 'App',
  mixins: [userCategories],
  data() {
    return {
      blogId: null,
      tags: [],
      loading: false,
      loadingUpload: false,
      blog: {
        type: 1,
        slug: '',
        title: '',
        categoryId: null,
        tags: [],
        attachments: []
      },
      isShowCategorySelector: false,
      isShowSetting: false
    }
  },
  props: {
    user: Object
  },
  computed: {
    submitText() {
      if (this.blogId) return '保存'
      return '发表'
    }
  },
  methods: {
    getInitData() {
      this.blogId = getSearchParam('id')
      if (this.blogId) this.getBlog(this.blogId)
      this.getTags()
      this.initCategories()
    },
    async initCategories() {
      await this.getPermissions()
      this.categories = $utils.makeCategoryTree(await this.getCategories())
    },
    startSelectCategory() {
      const currentId = this.blog.categoryId
      this.resetFocusCategory(this.categories, currentId)
      this.isShowCategorySelector = true
      this.$forceUpdate()
    },
    resetFocusCategory(categories, id) {
      categories.forEach(row => {
        delete row.focus_
        if (row.id === id) row.focus_ = true

        if (row.children.length) {
          this.resetFocusCategory(row.children, id)
        }
      })
    },
    clickTreeItem(item) {
      this.blog.categoryId = item.id
      this.blog.category = item.name
      this.isShowCategorySelector = false
    },
    async getTags() {
      const body = await $fetch.get('tags').catch(this.error)
      if (body === undefined) return

      this.tags = body
    },
    async uploadAttachments(file) {
      if (this.loadingUpload) return

      const form = new FormData()
      form.append('files', file)

      this.loadingUpload = true
      const body = await $fetch.form('files', form).catch(this.error)
      this.loadingUpload = false
      if (body === undefined) return

      this.blog.attachments.push({
        name: file.name,
        url: `/${body}`
      })
    },
    deleteAttachment(name) {
      this.blog.attachments = this.blog.attachments.filter(attachment => attachment.name !== name)
      this.$refs.uploadAttachments.reset()
    },
    async getBlog(id) {
      const body = await $fetch.get(`blogs/${id}`).catch(this.error)
      if (body === undefined) return

      body.tags = body.tags.map(tag => ({ id: tag.id, name: tag.name }))
      body.attachments = JSON.parse(body.attachments)
      this.blog = body
      body.type === 1 && vueStackedit.methods.setContent(body.content)
    },
    async publish() {
      if (this.loading) return
      if (!this.permissions.PostNewBlog) return this.warn('无权限')
      if (!this.blog.categoryId) return this.warn('请选择版块')
      if (!this.blog.title) return this.warn('请填写标题')

      const { blog } = this
      blog.content = vueStackedit.methods.getContent()

      this.loading = true
      let body
      if (this.blogId) {
        body = await $fetch.put(`blogs/${this.blogId}`, blog).catch(this.error)
      } else {
        body = await $fetch.post('blogs', blog).catch(this.error)
      }
      this.loading = false
      if (body === undefined) return

      this.success('发表成功')
      setTimeout(() => location.href = `/blog.html?id=${body}`, 2400)
    }
  },
  created() {
    this.getInitData()
  }
}
</script>
