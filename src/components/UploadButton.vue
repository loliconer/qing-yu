<template>
  <div class="vue-upload-button">
    <div class="btn-file">
      <v-button>{{text}}</v-button>
      <input type="file" :name="name" @change="selectFile" :multiple="multi" :accept="accept" :required="required">
    </div>
    <template v-if="!upload">
      <div class="file-thumbs" v-if="showThumb && fileContents.length">
        <div class="thumb-wrap" v-for="src of fileContents">
          <img class="img" :src="src">
        </div>
      </div>
      <div class="span-file-names" v-else>
        <span v-for="name of fileNames">{{name}}</span>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'v-upload-button',
    data() {
      return {
        fileNames: [],
        fileContents: []
      }
    },
    props: {
      name: String,
      upload: Boolean,
      multi: Boolean,
      text: {
        'type': String,
        'default': '选择文件'
      },
      accept: {
        type: String,
        'default': '*/*'
      },
      showThumb: {
        type: Boolean,
        'default': false
      },
      required: {
        type: Boolean,
        'default': true
      }
    },
    methods: {
      selectFile(ev) {
        this.fileNames = [];
        this.fileContents = [];

        [].forEach.call(ev.target.files, file => {
          this.fileNames.push(file.name)

          if (this.showThumb && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = evt => {
              const img = new Image
              img.src = evt.target.result

              setTimeout(() => {
                if (!img.naturalWidth || !img.naturalHeight) {
                  ev.target.value = ''
                  this.warn('获取图片失败，请重新选择')
                  return
                }

                this.fileContents.push(img.src)
              })
            }
            reader.readAsDataURL(file)
          }
        })
        if (!this.multi) {
          this.$emit('select', ev.target.files[0])
        }
        if (this.multi) {
          this.$emit('select', ev.target.files)
        }
      },
      reset() {
        this.$el.querySelector('input[type=file]').value = ''
        this.fileNames = []
      }
    }
  }
</script>
