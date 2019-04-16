export default {
  data() {
    return {
      categories: [],
      permissions: {}
    }
  },
  methods: {
    async getPermissions() {
      const permissions = await $fetch.get('views/userPermissions').catch(this.error)
      if (permissions === undefined) return

      this.permissions = permissions
      return true
    },
    async getCategories() {
      const categoryIds = this.permissions.GetAvailableCategories
      let url = 'categories'
      if (categoryIds !== undefined) {
        if (categoryIds.length === 0) return []

        url += `?ids=${categoryIds.join(',')}`
      }
      const categories = await $fetch.get(url).catch(this.error)
      if (categories === undefined) return []

      return categories
    }
  }
}
