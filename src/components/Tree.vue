<template>
  <div class="v-tree">
    <v-tree-item v-for="(item, i) of source" :key="i" :item="item" :checkbox="checkbox" :only-click-file="onlyClickFile" @click="clickItem"></v-tree-item>
  </div>
</template>

<script>
  import VTreeItem from './TreeItem'

  export default {
    name: 'v-tree',
    data() {
      return {
        currentClicked: null
      }
    },
    props: {
      source: Array,
      checkbox: Boolean,
      onlyClickFile: Boolean,
      defaultFocus: String
    },
    components: { VTreeItem },
    watch: {
      defaultFocus(val) {
        if (!this.checkbox) this.updateFocus(val, this.source)
      }
    },
    methods: {
      clickItem(item) {
        if (this.onlyClickFile && item.isDir) return

        if (!item.isDir) {
          if (item.focus_) return

          if (this.currentClicked !== null) {
            this.currentClicked.focus_ = false
          }

          item.focus_ = true
          this.currentClicked = item
        }

        this.$emit('click', item)
      },
      updateFocus(focusItem, rows, parents = []) {
        if (!Array.isArray(rows)) return

        rows.forEach(row => {
          if (row.key === focusItem) {
            if (row.isDir) {
              row.expand_ = true
            } else {
              row.focus_ = true
            }
            parents.forEach(item => item.expand_ = true)
            this.currentClicked = row
          } else {
            parents.push(row)
            this.updateFocus(focusItem, row.children, parents)
          }
        })
      }
    },
    created() {
      const { defaultFocus } = this

      if (defaultFocus === '') return

      if (!this.checkbox) this.updateFocus(defaultFocus, this.source)
    }
  }
</script>
