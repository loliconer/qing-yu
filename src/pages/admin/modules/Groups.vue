<template>
  <div class="route-groups">
    <v-popup :title="`修改用户组授权【${group.name}】`" v-model="isShowPopup" :confirm="authorize">
      <div class="pm-set">
        <div class="s-row" v-for="row of currentGroupPermissions">
          <span>{{row.permission.name}}</span>
          <div class="actions">
            <v-switch v-model="row.value" v-if="row.permission.type === 'boolean'"></v-switch>
            <v-button type="text" v-if="row.permission.code === 'GetAvailableCategories'"
                      @click="startAuthCategory(row)">设置</v-button>
            <v-button class="text-error" style="margin-left: 8px;" type="text" @click="delAuth(row.id)">删除</v-button>
          </div>
        </div>
        <div class="s-add">
          <v-button @click="startAddNewAuth">新增授权</v-button>
        </div>
      </div>
    </v-popup>

    <v-popup class="popup-cat-tree" :title="group.name" v-model="isShowAuthCategory" :confirm="authCategory">
      <v-tree :source="copyCategories" checkbox></v-tree>
    </v-popup>

    <v-popup class="overflow" title="新增授权" v-model="isShowNewAuth" :confirm="addNewAuth" async fixed>
      <div class="vp-new-auth">
        <v-select :source="availableNewAuths" v-model="newAuthId"></v-select>
      </div>
    </v-popup>

    <v-table :source="groups" :columns="columns">
      <div slot="tools-l">
        <v-button @click="add">新增</v-button>
      </div>
      <div slot="op" slot-scope="{value}">
        <v-button @click="edit(value)">修改</v-button>
        <v-button style="margin-left: 8px;" type="danger" @click="del(value)">删除</v-button>
        <v-button style="margin-left: 8px;" @click="startAuthorize(value)">授权</v-button>
      </div>
    </v-table>
  </div>
</template>
<script>
  import $utils from 'src/js/utils'

  export default {
    data() {
      return {
        group: {},
        groups: [],
        permissions: [],
        permissionId: null,
        currentGroupPermissions: [],
        groupPermissionId: null,
        columns: [
          { title: 'ID', prop: 'id' },
          { title: '用户组名', prop: 'name' },
          { title: '', prop: 'op'}
        ],
        categories: [],
        copyCategories: [],
        isShowPopup: false,
        isShowAuthCategory: false,
        isShowNewAuth: false,
        availableNewAuths: [],
        newAuthId: null
      }
    },
    methods: {
      async getGroups() {
        const body = await $fetch.get('groups').catch(this.error)
        if (body === undefined) return

        this.groups = body
      },
      async getPermissions() {
        const body = await $fetch.get('permissions').catch(this.error)
        if (body === undefined) return

        this.permissions = body
      },
      async getCategories() {
        const body = await $fetch.get('categories').catch(this.error)
        if (body === undefined) return

        this.categories = body
      },
      // 用户组操作
      async add() {
        const { groups } = this
        this.modal({
          title: '新增用户组',
          content: `<input class="input">`,
          async: true,
          async confirm() {
            const name = this.$el.querySelector('input').value

            if (name === '') return

            const body = await $fetch.post('groups', { name }).catch(this.error)
            if (body === undefined) return

            this.success('保存成功')
            groups.push(body)
            return true
          }
        })
      },
      edit(row) {
        this.modal({
          title: '修改用户组',
          content: `<input class="input" value="${row.name}">`,
          async confirm() {
            const name = this.$el.querySelector('input').value

            if (name === '') return

            const body = await $fetch.put(`groups/${row.id}`, { name }).catch(this.error)
            if (body === undefined) return

            this.success('修改成功')
            row.name = name
            return true
          }
        })
      },
      del(row) {
        const { groups } = this
        this.modal({
          content: '确认删除？',
          async confirm() {
            const body = await $fetch.delete(`groups/${row.id}`).catch(this.error)
            if (body === undefined) return

            this.success('删除成功')
            groups.forEach((g, i) => {
              g.id === row.id && groups.splice(i, 1)
            })
            return true
          }
        })
      },
      // 授权操作
      startAuthorize(row) {
        this.group = row
        this.isShowPopup = true
        this.getGroupPermissions(row.id)
      },
      async getGroupPermissions(groupId) {
        const body = await $fetch.get(`views/permissionsByGroups?arg=${groupId}`).catch(this.error)
        if (body === undefined) return

        this.currentGroupPermissions = body.map(row => {
          if (row.permission.type === 'boolean') row.value = Boolean(Number(row.value))
          if (row.permission.code === 'GetAvailableCategories') row.value = row.value === '' ? [] : row.value.split(',').map(v => +v)
          return row
        })
      },
      async authorize() {
        const rows = this.currentGroupPermissions.filter(row => row.permission.type === 'boolean')
          .map(row => ({
            id: row.id,
            value: Number(row.value)
          }))
        if (!rows.length) return true

        const body = await $fetch.put('groupPermission', { rows }).catch(this.error)
        if (body === undefined) return

        this.success('设置成功')
        return true
      },
      startAddNewAuth() {
        const authorizedPermissionIds = this.currentGroupPermissions.map(gp => gp.permissionId)
        this.availableNewAuths = this.permissions.filter(pm => !authorizedPermissionIds.includes(pm.id)).map(pm => ({ name: pm.name, value: pm.id }))

        if (!this.availableNewAuths.length) return this.warn('没有可增加的授权')

        this.newAuthId = null
        this.isShowNewAuth = true
      },
      async addNewAuth() {
        const groupId = this.group.id
        const permissionId = this.newAuthId
        const permission = this.permissions.find(p => p.id === permissionId)
        const defaultValue = permission.type === 'boolean' ? 0 : ''
        const body = await $fetch.post('groupPermission', {
          groupId,
          permissionId,
          value: defaultValue
        }).catch(this.error)
        if (body === undefined) return

        this.currentGroupPermissions.push({
          id: body,
          groupId,
          permissionId,
          value: permission.type === 'boolean' ? Boolean(defaultValue) : defaultValue,
          permission
        })
        return true
      },
      delAuth(id) {
        const { currentGroupPermissions } = this
        this.modal({
          content: '确定删除？',
          async confirm() {
            const body = await $fetch.delete(`groupPermission/${id}`).catch(this.error)
            if (body === undefined) return

            currentGroupPermissions.forEach((row, i) => {
              row.id === id && (currentGroupPermissions.splice(i, 1))
            })
            return true
          }
        })
      },
      async startAuthCategory(gp) {
        this.groupPermissionId = gp.id
        this.permissionId = gp.permissionId
        this.categories.length || await this.getCategories()

        const copyCategories = this.categories.map(cat => Object.assign({}, cat))

        //设置用户组已有的版块权限
        copyCategories.forEach(cat => {
          if (gp.value.includes(cat.id)) cat.selected = true
        })
        this.copyCategories = $utils.makeCategoryTree(copyCategories)
        this.isShowAuthCategory = true
      },
      async authCategory() {
        const catIds = []

        function checkChildren(rows) {
          rows.forEach(child => {
            if (child.selected) catIds.push(child.id)

            if (child.children && child.children.length)
              checkChildren(child.children)
          })
        }
        checkChildren(this.copyCategories)

        const body = await $fetch.put(`groupPermission/${this.groupPermissionId}`, {
          value: catIds.join(',')
        }).catch(this.error)
        if (body === undefined) return

        this.success('设置成功')
        this.currentGroupPermissions.forEach(gp => {
          gp.id === this.groupPermissionId && (gp.value = catIds)
        })

        return true
      }
    },
    created() {
      this.getGroups()
      this.getPermissions()
    }
  }
</script>
