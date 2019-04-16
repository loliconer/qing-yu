<template>
  <div class="vue-article">
    <article class="mod-blog blog">
      <h1>{{blog.title}}</h1>
      <div class="a-info">
        <span>作者：{{blog.author}}</span>
        <span>创建日期：{{blog.createTime}}</span>
      </div>
      <div class="a-tags" v-if="blog.tags.length">
        <span class="tag" v-for="tag of blog.tags">{{tag.name}}</span>
      </div>
      <div class="a-content" v-html="blog.content"></div>
      <div class="a-attachments" v-if="blog.attachments && blog.attachments.length">
        附件：<a v-for="attachment of blog.attachments" :href="attachment.url">{{attachment.name}}</a>
      </div>
    </article>
  </div>
</template>
<script>
  export default {
    name: 'av-article',
    props: {
      blog: Object
    }
  }
</script>
