<template>
  <div class="child-repo">
    <v-popup title="新建" v-model="isShowPopup" :confirm="create" async>
      <label class="label">
        <span>名称</span>
        <v-input v-model="repo.name"></v-input>
      </label>

      <label class="label label-textarea">
        <span>简介</span>
        <textarea class="textarea" v-model="repo.description"></textarea>
      </label>

      <label class="label">
        <span>权限</span>
        <v-radio-group :source="permissions" v-model="repo.isPrivate" lnf="button"></v-radio-group>
      </label>

      <label class="label">
        <span>归属</span>
        <v-select :source="belongs" v-model="repo.belong"></v-select>
      </label>

      <label class="label label-path">
        <span>路径</span>
        <span class="mod-path">
          <input class="input" :value="urlPrefix" readonly>
          <v-input v-model="repo.slug"></v-input>
          <v-icon icon="refresh" size="16" @click.native="refreshSlug" v-if="slugRepeated"></v-icon>
        </span>
      </label>
    </v-popup>

    <div class="repo-head">
      <div class="h-title">知识库</div>
      <div class="h-actions">
        <v-search placeholder="搜索"></v-search>
        <v-button @click="startCreate">新建知识库</v-button>
      </div>
    </div>

    <v-table :source="repos" :columns="columns" simple>
      <div class="col-name" slot="name" slot-scope="{value}">
        <a class="link" :href="`/repo.html?slug=${value.slug}`" target="_blank"><v-icon icon="writing"></v-icon><span>{{value.name}}</span></a>
      </div>

      <div class="col-op" slot="op" slot-scope="{value}">
        <a class="link-blue" :href="`/repo.html?slug=${value.slug}`" target="_blank">文档管理</a>
      </div>
    </v-table>
  </div>
</template>

<script>
  import './repo.less'
  import {genSlug} from 'src/js/utils'

  export default {
    name: 'Repo',
    data() {
      return {
        urlPrefix: `${location.origin}/repos/`,
        repos: [],
        repo: {},
        columns: [
          { title: '名称', prop: 'name' },
          { title: '归属', prop: 'belong' },
          { title: '简介', prop: 'description' },
          { title: '', prop: 'op', custom: true }
        ],
        permissions: [
          { name: '私密', value: 1 },
          { name: '公开', value: 0 }
        ],
        belongs: [],
        isShowPopup: false,
        slugRepeated: false
      }
    },
    methods: {
      async getRepos() {
        const body = await $fetch.get('repos').catch(this.error)
        if (body === undefined) return

        this.repos = body
      },
      startCreate() {
        this.repo = {
          isPrivate: 1,
          slug: genSlug()
        }
        this.isShowPopup = true
      },
      refreshSlug() {
        this.repo.slug = genSlug()
      },
      async create() {
        const body = await $fetch.post('repos', this.repo).catch(error => {
          if (error.code === 217) {
            this.error('该路径已存在，请修改路径')
            this.slugRepeated = true
            return
          }
          this.error(error)
        })
        if (body === undefined) return

        this.success('创建成功')
        setTimeout(() => location.href = `/repo.html?slug=${this.repo.slug}`, 1000)
      }
    },
    created() {
      this.getRepos()
    }
  }
</script>
