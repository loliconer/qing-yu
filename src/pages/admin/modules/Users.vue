<template>
  <div class="route-users">
    <v-popup class="overflow" title="修改用户信息" v-model="isShowPopup" :confirm="edit" :async="true" v-if="isShowPopup">
      <form class="layout-form simple">
        <div class="row">
          <label class="label">用户名：</label>
          <span>{{row.username}}</span>
        </div>

        <div class="row">
          <label class="label">用户组：</label>
          <v-select :source="groups" v-model="currentUserGroups" multiple></v-select>
        </div>
      </form>
    </v-popup>

    <v-popup title="新增用户" v-model="isShowAddPopup" :confirm="add" v-if="isShowAddPopup" async>
      <form class="layout-form simple">
        <div class="row">
          <label class="label">邮箱：</label>
          <v-input v-model="newUser.email"></v-input>
        </div>

        <div class="row">
          <label class="label">手机号：</label>
          <v-input v-model="newUser.mobile"></v-input>
        </div>
      </form>
    </v-popup>

    <v-table :source="users" :columns="columns" :count-of-page="20">
      <v-button slot="tools-l" @click="startAdd">新增用户</v-button>
      <div class="col-groups" slot="groups" slot-scope="{value}">
        <a class="tag tag-black" v-for="userGroup of value.userGroups">{{groupsIndex[userGroup.groupId]}}</a>
      </div>
      <div class="col-op" slot="op" slot-scope="{value}">
        <v-icon icon="edit" @click.native="startEdit(value)"></v-icon>
      </div>
    </v-table>
  </div>
</template>
<script>
  export default {
    name: 'Users',
    data() {
      return {
        users: [],
        newUser: {},
        columns: [
          { title: '', prop: 'op', custom: true },
          { title: '用户名', prop: 'username' },
          { title: '邮箱', prop: 'email' },
          { title: '手机号', prop: 'mobile' },
          { title: '所属用户组', prop: 'groups', custom: true },
          { title: '注册时间', prop: 'createTime' }
        ],
        groups: [],
        groupsIndex: {},
        currentUserGroups: [],
        isShowPopup: false,
        isShowAddPopup: false,
        row: {}
      }
    },
    methods: {
      async getUsers() {
        const body = await $fetch.get('users').catch(this.error)

        if (body === undefined) return

        this.users = body
      },
      async getGroups() {
        const body = await $fetch.get('groups').catch(this.error)

        if (body === undefined) return

        this.groups = body.map(b => {
          this.groupsIndex[b.id] = b.name
          return { name: b.name, value: b.id }
        })
        this.getUsers()
      },
      startEdit(row) {
        this.row = row
        this.currentUserGroups = row.userGroups.map(userGroup => userGroup.groupId)
        this.isShowPopup= true
      },
      async edit() {
        const body = await $fetch.post(`userGroup`, {
          userId: this.row.id,
          groups: this.currentUserGroups
        }).catch(this.error)

        if (body === undefined) return

        this.success('编辑成功')
        this.row.userGroups = this.currentUserGroups.map(id => ({ groupId: id }))
        return true
      },
      startAdd() {
        this.isShowAddPopup = true
        this.newUser = {}
      },
      async add() {
        if (!this.newUser.email && !this.newUser.mobile) {
          this.warn('邮箱和手机号至少填写一项')
          return
        }

        const body = await $fetch.post('admin/users', this.newUser).catch(this.error)
        if (body === undefined) return

        this.success('添加成功')
        this.users.push({
          id: body,
          username: this.newUser.email || this.newUser.mobile,
          email: this.newUser.email,
          mobile: this.newUser.mobile,
          userGroups: [{ userId: body, groupId: 1 }],
          createTime: '刚刚'
        })
        return true
      }
    },
    created() {
      this.getGroups()
    }
  }
</script>
