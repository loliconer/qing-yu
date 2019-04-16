<template>
  <div class="route-blogs">
    <v-table :source="blogs" :columns="columns" :count-of-page="20"></v-table>
  </div>
</template>

<script>
  export default {
    name: 'Blogs',
    data() {
      return {
        blogs: [],
        columns: [
          { title: 'ID', prop: 'id' },
          { title: '标题', prop: 'title' },
          { title: '作者', prop: 'author' },
          { title: '创建时间', prop: 'createTime' }
        ]
      }
    },
    methods: {
      async getBlogs() {
        const fields = this.columns.map(col => col.prop).join(',')
        const body = await $fetch.get(`blogs?fields=${fields}`).catch(this.error)
        if (body === undefined) return

        this.blogs = body
      }
    },
    created() {
      this.getBlogs()
    }
  }
</script>
