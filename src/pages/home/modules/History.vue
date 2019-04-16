<template>
  <div class="child-history">
    <div class="init" v-if="loading"><v-icon icon="refresh" class="rotate"></v-icon></div>
    <v-table :source="records" :columns="columns" simple v-else>
      <template slot="title" slot-scope="{value}">
        <a :href="`/blog.html?id=${value.id}`" target="_blank">{{value.title}}</a>
      </template>
      <template slot="op" slot-scope="{value}">
        <a class="link" :href="`/post.html?id=${value.id}`" target="_blank">编辑</a>
      </template>
    </v-table>
  </div>
</template>

<script>
  import './history.less'

  export default {
    name: 'History',
    data() {
      return {
        loading: true,
        records: [],
        columns: [
          { title: '名称', prop: 'title' },
          { title: '目录', prop: 'category' },
          { title: '', prop: 'op', custom: true }
        ],
        categories: {}
      }
    },
    props: {
      user: Object
    },
    methods: {
      async getCategories() {
        const body = await $fetch.get('categories').catch(this.error)
        if (body === undefined) return

        this.categories = this.processCategories(body)
        this.getRecords()
      },
      async getRecords() {
        const body = await $fetch.get(`blogs?user=${this.user.id}`).catch(this.error)
        if (body === undefined) return

        this.records = body.map(row => {
          row.category = this.categories[row.categoryId]
          return row
        })
        this.loading = false
      },
      processCategories(rows) {
        const result = {}, indexes = {}

        function parse(node) {

        }

        rows.forEach(row => {
          indexes[row.id] = row.name
        })

        rows.forEach(row => {
          let name  = row.name

          if (row.parentId) name = `${indexes[row.parentId]} / ${name}`

          result[row.id] = name
        })

        return result
      }
    },
    created() {
      this.getCategories()
    }
  }
</script>
