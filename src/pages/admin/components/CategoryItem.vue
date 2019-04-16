<template>
  <div class="mod-cat-item">
    <div class="i-name" @click.right="rightClickItem($event, item)" @click="$set(item, 'open_', !item.open_)">
      <v-icon icon="down-wide" size="16" :class="{'dir-right': !item.open_}" v-if="item.children && item.children.length"></v-icon>
      <div class="i-blank" v-else></div>
      <v-icon icon="folder-flat"></v-icon>
      <span>{{item.name}}</span>
    </div>
    <div class="i-children" v-if="item.open_">
      <category-item v-for="(child, i) of item.children" :key="i" :item="child" @right-click="rightClickItem"></category-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoryItem',
    props: {
      item: Object
    },
    methods: {
      rightClickItem(ev, item) {
        this.$emit('right-click', ev, item)
      }
    }
  }
</script>
