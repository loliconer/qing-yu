<template>
  <div class="route-categories">
    <div class="v-dropdown" :style="contextStyle" @click.stop v-if="isShowContext">
      <div class="d-item" @click="startAddSub">新建子版块</div>
      <div class="d-item" @click="startEdit">修改名称</div>
      <div class="d-item" @click="startDel">删除</div>
    </div>

    <div class="mod-cat-tree">
      <div class="t-tip">右键点击操作</div>
      <category-item v-for="(item, i) of categories" :key="i" :item="item" @right-click="showContextMenu"></category-item>
      <div class="t-item">
        <div class="i-add" @click="startAdd"><v-icon icon="plus"></v-icon></div>
      </div>
    </div>
  </div>
</template>

<script>
  import $utils from 'src/js/utils'
  import CategoryItem from '../components/CategoryItem'

  export default {
    data() {
      return {
        selected: {},
        parentId: undefined,
        categories: [],
        isShowContext: false,
        contextStyle: {
          top: 0,
          left: 0
        }
      }
    },
    components: { CategoryItem },
    methods: {
      async getCategories() {
        const body = await $fetch.get('categories').catch(this.error)

        if (body === undefined) return

        this.categories = $utils.makeCategoryTree(body)
      },
      startAdd() {
        const { categories } = this
        this.modal({
          title: '新增版块',
          content: `<input class="input" placeholder="版块名称">`,
          fixed: true,
          async confirm() {
            const name = this.$el.querySelector('input').value
            const body = await $fetch.post('categories', {
              name
            }).catch(this.error)
            if (body === undefined) return

            this.success('增加成功')
            categories.push({
              id: body,
              name,
              children: []
            })
            return true
          }
        })
      },
      showContextMenu(ev, item) {
        ev.preventDefault()

        this.selected = item
        this.parentId = item.parentId
        this.contextStyle = {
          left: `${ev.clientX}px`,
          top: `${ev.clientY + window.scrollY}px`
        }
        this.isShowContext = true
      },
      startAddSub() {
        this.isShowContext = false
        const { selected } = this
        this.modal({
          title: '新增子版块',
          content: `<input class="input" placeholder="版块名称">`,
          fixed: true,
          async confirm() {
            const name = this.$el.querySelector('input').value
            const path = selected.path ? `${selected.path}-${selected.id}` : selected.id
            const body = await $fetch.post('categories', {
              parentId: selected.id,
              name,
              path
            }).catch(this.error)
            if (body === undefined) return

            this.success('增加成功')
            selected.children.push({
              id: body,
              name,
              path,
              parentId: selected.id,
              children: []
            })
            return true
          }
        })
      },
      startEdit() {
        this.isShowContext = false
        const { selected } = this
        this.modal({
          title: '编辑版块',
          content: `<input class="input" value="${selected.name}" placeholder="版块名称">`,
          fixed: true,
          async confirm() {
            const name = this.$el.querySelector('input').value
            const body = await $fetch.put(`categories/${selected.id}`, {
              name
            }).catch(this.error)
            if (body === undefined) return

            this.success('更新成功')
            selected.name = name
            return true
          }
        })
      },
      startDel() {
        this.isShowContext = false
        const { categories, selected } = this
        const $this = this
        this.modal({
          content: '删除版块会同时删除其子版块，但是版块下的文章不会删除，确定删除？',
          fixed: true,
          async confirm() {
            const body = await $fetch.delete(`categories/${selected.id}`).catch(this.error)
            if (body === undefined) return

            this.success('删除成功')
            $this.removeCategoryItem(categories, selected.id)
            return true
          }
        })
      },
      removeCategoryItem(categories, id) {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].id === id) {
            categories.splice(i, 1)
            return true
          }
          if (categories[i].children) {
            if (this.removeCategoryItem(categories[i].children, id)) return true
          }
        }
      }
    },
    created() {
      this.getCategories()
    },
    mounted() {
      window.addEventListener('click', () => {
        this.isShowContext = false
      })
    }
  }
</script>
