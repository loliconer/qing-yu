<template>
  <div class="vue-tag">
    <input class="input" maxlength="20" v-model.trim="tag" @focus="isShowCandidates = true" @keydown.enter="addCustom($event, tag)">
    <div class="vt-selected">
      <a class="tag tag-black" v-for="(t, i) of value" @click="remove(t, i)">{{t.name}}</a>
    </div>
    <div class="vt-candidates" v-show="isShowCandidates" v-if="tags.length">
      <a class="tag tag-white" v-for="(t, i) of tags" @click="add(t, i)">{{t.name}}</a>
      <v-icon icon="close" @click.native="isShowCandidates = false"></v-icon>
    </div>
  </div>
</template>
<script>
  let timer

  export default {
    name: 'v-tag',
    data() {
      return {
        tag: '',
        max: 5,
        isShowCandidates: false
      }
    },
    props: {
      value: Array,
      tags: Array
    },
    methods: {
      addCustom(ev, tag) {
        ev.preventDefault()
        if (this.add({ name: tag }, this.tags.findIndex(t => t.name === tag))) this.tag = ''
      },
      add(tag, index) {
        if (this.value.length >= this.max) {
          this.warn(`最多只能添加${this.max}个标签`)
          return
        }

        if (this.value.findIndex(t => t.name === tag.name) >= 0) {
          this.warn('该标签已存在')
          return
        }

        this.value.push(tag)
        index >= 0 && this.tags.splice(index, 1)
        return true
      },
      remove(tag, index) {
        this.value.splice(index, 1)
        if (this.tags.findIndex(t => t.name === tag.name) < 0) this.tags.push(tag)
        this.isShowCandidates = true
      }
    }
  }
</script>
