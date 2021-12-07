<template>
  <div id="app" class="app-repo">
    <v-navbar :user="user" v-if="user.id"></v-navbar>
    <header class="header">
      <div class="container">
        <v-tab :titles="titles" v-model="tabIndex"></v-tab>
        <div class="c-act">
          <v-button>新建文档</v-button>
        </div>
      </div>
    </header>
    <div class="container main" style="min-height: initial">
      <div class="repo-cover" v-if="tabIndex === 0">
        <!--<div class="edit-catalog"></div>-->
        <h1 class="c-title">{{repo.name}}</h1>
        <p class="c-desc">{{repo.description}}</p>
        <div class="c-content">
          <div class="c-catalog-empty"></div>
          <div class="c-catalog"></div>
        </div>
      </div>

      <div class="repo-set" v-if="tabIndex === 2">
        <aside class="aside l">
          <div class="mod-aside-nav">
            <div class="an-item" :class="{focus: setIndex === i}" @click="setIndex = i" v-for="(menu, i) of setMenus">{{menu}}</div>
          </div>
        </aside>
        <div class="s-content r">
          <div class="set-basic" v-if="setIndex === 0">
            <div class="set-form">
              <div class="r-label">名称</div>
              <div class="r-control">
                <v-input v-model="repo.name"></v-input>
              </div>
              <div class="r-label">简介</div>
              <div class="r-control">
                <textarea class="textarea" v-model="repo.description"></textarea>
              </div>
              <div class="r-label">路径</div>
              <div class="r-control mod-path">
                <input class="input" :value="urlPrefix" readonly>
                <v-input v-model="repo.slug"></v-input>
                <v-icon icon="refresh" size="16" @click.native="refreshSlug"></v-icon>
              </div>
              <div class="r-submit">
                <v-button @click="saveBasicSet" :loading="loadings.saveBasicSet">更新</v-button>
              </div>
            </div>
          </div>

          <div class="set-advanced" v-if="setIndex === 1">
            <div class="mod-card">
              <div class="c-head">删除知识库</div>
              <div class="c-body">
                <p>彻底删除该知识库，知识库下的所有数据都将被删除，该操作是不可逆的。</p>
                <v-button type="danger" @click="del">删除</v-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {genSlug} from 'src/js/utils'
import { getSearchParam } from '@lovue/utils'

export default {
  name: 'Repo',
  data() {
    return {
      urlPrefix: `${location.origin}/repos/`,
      slug: '',
      repo: {},
      titles: ['目录', '管理', '设置'],
      tabIndex: 0,
      setMenus: ['基础设置', '高级设置'],
      setIndex: 0,
      loadings: {
        saveBasicSet: false
      }
    }
  },
  props: {
    user: Object
  },
  methods: {
    async getRepo() {
      const body = await $fetch.get(`repos/${this.slug}`).catch(this.error)
      if (body === undefined) return

      document.title = body.name
      this.repo = body
    },
    refreshSlug() {
      this.repo.slug = genSlug()
    },
    async saveBasicSet() {
      if (this.loadings.saveBasicSet) return
      this.loadings.saveBasicSet = true

      const body = await $fetch.put(`repos/${this.slug}`, {
        name: this.repo.name,
        description: this.repo.description,
        slug: this.repo.slug
      }).catch(this.error)
      this.loadings.saveBasicSet = false
      if (body === undefined) return

      this.success('更新成功')
      setTimeout(() => location.href = `/repo.html?slug=${this.repo.slug}`, 1000)
    },
    del() {
      this.modal({
        content: `确认删除知识库：${this.repo.name}？`,
        fixed: true,
        confirm: async () => {
          const body = await $fetch.delete(`repos/${this.repo.slug}`).catch(this.error)
          if (body === undefined) return

          this.success('删除成功')
          setTimeout(() => location.href = '/home.html', 1000)
          return true
        }
      })
    }
  },
  created() {
    this.slug = getSearchParam('slug')
    this.getRepo()
  }
}
</script>
