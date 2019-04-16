<template>
  <div class="v-tree-item">
    <div class="i-title">
      <div class="expand-icon" @click="toggle" v-if="(item.children && item.children.length) || item.count">
        <v-icon icon="down-wide" size="16" :class="{'dir-right': !item.expand_}"></v-icon>
      </div>
      <div class="block-placeholder" v-else></div>
      <div class="input-checkbox" v-if="checkbox">
        <input type="checkbox" :id="`Tree_Item_${_uid}`" v-model="item.selected">
        <label :for="`Tree_Item_${_uid}`">{{item.name}}</label>
      </div>
      <div class="t-name" :class="{focus: item.focus_}" @click="clickItem(item)" v-else>
        <v-icon :icon="item.icon" size="16" v-if="item.icon"></v-icon>
        <span>{{item.name}}</span>
        <span v-if="item.isDir">&nbsp;({{item.count}})</span>
        <template v-if="item.loading_">&nbsp;<v-icon class="loading" icon="refresh" size="14"></v-icon></template>
      </div>
    </div>
    <div class="i-body" v-show="item.expand_" v-if="item.children && item.children.length">
      <v-tree-item v-for="(child, i) of item.children" :key="i" :item="child" :checkbox="checkbox" @click="clickItem"></v-tree-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'v-tree-item',
    props: {
      item: Object,
      checkbox: Boolean
    },
    methods: {
      toggle() {
        this.item.expand_ = !this.item.expand_
      },
      clickItem(item) {
        this.$emit('click', item)
      }
    }
  }
</script>
