<template>
  <section class="mod-comments">
    <input type="hidden" v-if="trigger">
    <div class="c-form">
      <v-icon icon="man" size="40"></v-icon>
      <form class="mod-reply-form" @submit.prevent="commentTo">
        <textarea class="textarea" name="content" placeholder="来说两句吧..." required @click.stop="isShowCommentBtn = true"></textarea>
        <div class="submit-row" v-show="isShowCommentBtn">
          <div class="submit-info"></div>
          <v-button :loading="loadings.comment" submit>提交</v-button>
        </div>
      </form>
    </div>

    <div class="c-below">
      <div class="no-data" v-if="!comments.length">还没有评论，快来抢沙发吧！</div>
      <div class="c-info" v-else>
        <h3>{{total}}条评论</h3>
        <div class="cmt-sort"></div>
      </div>
      <div class="c-list">
        <div class="mod-comment" v-for="comment of comments">
          <v-icon icon="man" size="40"></v-icon>

          <div class="c-content">
            <div class="cc-head">
              <span class="text-error">{{comment.username}}</span>
              <span class="c-time">{{comment.createTime}}</span>
            </div>
            <div class="cc-body" v-html="comment.content.replace(/\n/g, '<br/>')"></div>
            <div class="cc-foot">
              <div class="c-actions">
                <span @click="showReplyForm(comment)">回复</span>
                <v-icon icon="delete" size="14" v-if="username === comment.username && !comment.replies.length"
                        @click.native="deleteComment(comment.id)"></v-icon>
              </div>

              <div class="mod-reply-form" v-if="comment.showReplyForm">
                <form @submit.prevent="commentReply($event, comment)">
                  <textarea class="textarea" name="content" placeholder="来说两句吧..." required></textarea>
                  <div class="submit-row">
                    <div class="submit-info"></div>
                    <div>
                      <v-button type="text" @click="hideReplyForm(comment)">取消</v-button>
                      <v-button :loading="comment.replyLoading" submit>提交</v-button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div class="c-replies" v-if="comment.replies.length">
              <div class="c-reply" v-for="reply of comment.replies">
                <div class="cr-body">
                  <span class="reply-username">{{reply.username}}</span>：
                  <span class="reply-username" v-if="reply.toUsername">@{{reply.toUsername}}</span>
                  <div v-html="reply.content.replace(/\n/g, '<br/>')"></div>
                </div>
                <div class="cr-foot">
                  <span class="at-reply" @click="showReplyForm(reply)">回复</span>
                  <span class="reply-time">{{reply.createTime}}</span>
                </div>

                <div class="mod-reply-form" v-if="reply.showReplyForm">
                  <form @submit.prevent="atReply($event, comment, reply)">
                    <textarea class="textarea" name="content" placeholder="来说两句吧..." required></textarea>
                    <div class="submit-row">
                      <div class="submit-info"></div>
                      <div>
                        <v-button type="text" @click="hideReplyForm(reply)">取消</v-button>
                        <v-button :loading="reply.replyLoading" submit>提交</v-button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="more-line">
        <v-button type="text" :loading="loadings.more" @click="getMoreComments" v-if="hasMore">查看更多</v-button>
      </div>
    </div>
  </section>
</template>
<script>
  const commentSize = 10
  let commentOffset = 0

  export default {
    name: 'av-comment',
    data() {
      return {
        trigger: false,
        comments: [],
        total: 0,
        loadings: {
          comment: false,
          more: false
        },
        isShowCommentBtn: false,
        hasMore: false
      }
    },
    props: {
      blogId: [Number, String],
      username: String
    },
    filters: {
      showLineWrap(str) {
        return str.replace(/\n/g, '<br/>')
      }
    },
    watch: {
      blogId(val) {
        this.comments = []
        this.getComments(val)
      }
    },
    methods: {
      triggerUpdate() {
        this.trigger = !this.trigger
      },
      async getComments(id, offset = 0, limit = commentSize) {
        if (id === null) return

        const body = await $fetch.get(`comments?blogId=${id}&offset=${offset}&limit=${limit}`).catch(this.error)
        if (body === undefined) return

        this.total = body.length
        this.comments = this.comments.concat(body)
        this.hasMore = body.length >= commentSize
      },
      async getMoreComments() {
        commentOffset += commentSize
        this.loadings.more = true
        await this.getComments(this.blogId, commentOffset).catch(this.error)
        this.loadings.more = false
      },
      async commentTo(evt) {
        if (this.loadings.comment) return
        const form = evt.target

        this.loadings.comment = true
        const body = await $fetch.post('comments', {
          blogId: this.blogId,
          content: form.content.value
        }).catch(this.error)
        this.loadings.comment = false

        if (body === undefined) return

        body.replies = []
        body.createTime = '刚刚'
        this.hasMore ? this.success('评论成功') : this.comments.push(body)
        this.total++
        form.content.value = ''
        this.isShowCommentBtn = false
      },
      showReplyForm(target) {
        target.showReplyForm = true
        this.triggerUpdate()
      },
      hideReplyForm(target) {
        target.showReplyForm = false
        this.triggerUpdate()
      },
      async commentReply(evt, comment) {
        if (comment.replyLoading) return

        const form = evt.target
        comment.replyLoading = true
        this.triggerUpdate()
        const body = await $fetch.post('replies', {
          commentId: comment.id,
          content: form.content.value
        }).catch(this.error)
        comment.replyLoading = false
        this.triggerUpdate()

        if (body === undefined) return

        body.createTime = '刚刚'
        comment.replies.push(body)
        form.content.value = ''
        comment.showReplyForm = false
        this.triggerUpdate()
      },
      async atReply(evt, comment, reply) {
        if (reply.replyLoading) return

        const form = evt.target
        reply.replyLoading = true
        this.triggerUpdate()
        const body = await $fetch.post('replies', {
          commentId: comment.id,
          toUserId: reply.userId,
          toUsername: reply.username,
          content: form.content.value
        }).catch(this.error)
        reply.replyLoading = false
        this.triggerUpdate()

        if (body === undefined) return

        body.createTime = '刚刚'
        comment.replies.push(body)
        form.content.value = ''
        reply.showReplyForm = false
        this.triggerUpdate()
      },
      deleteComment(id) {
        const this_ = this
        this.modal({
          content: '确定删除吗？',
          async confirm() {
            const body = await $fetch.delete(`comments/${id}`).catch(this.error)
            if (body === undefined) return

            this_.comments = this_.comments.filter(c => c.id !== id)
            this_.total--
            return true
          }
        })
      }
    },
    created() {
      this.blogId && this.getComments(this.blogId)
    }
  }
</script>
