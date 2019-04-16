<template>
  <div class="route-permissions">
    <v-table :source="permissions" :columns="columns">
      <div slot="tools-l">
        <v-button @click="startAdd">新增</v-button>
      </div>
      <div slot="op" slot-scope="{value}">
        <v-button @click="edit(value)">修改</v-button>
        <v-button type="danger" @click="del(value)">删除</v-button>
      </div>
    </v-table>

    <v-popup class="popup-add" title="新增权限" v-model="isShowAdd" :confirm="add">
      <label class="label"><span>Code：</span>
        <v-input v-model="permission.code"></v-input>
      </label>
      <label class="label"><span>名称：</span>
        <v-input v-model="permission.name"></v-input>
      </label>
      <label class="label"><span>类型：</span>
        <select class="select" v-model="permission.type">
          <option value="string">String</option>
          <option value="boolean">Boolean</option>
        </select>
      </label>
    </v-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        permissions: [],
        columns: [
          { title: 'ID', prop: 'id' },
          { title: 'Code', prop: 'code' },
          { title: '权限名称', prop: 'name' },
          { title: '', prop: 'op' }
        ],
        isShowAdd: false,
        permission: {}
      }
    },
    methods: {
      async getPermissions() {
        const body = await $fetch.get('permissions').catch(this.error)
        if (body === undefined) return

        this.permissions = body
      },
      startAdd() {
        this.permission = {}
        this.isShowAdd = true
      },
      async add() {
        const { permissions, permission } = this
        const { code, name, type } = permission
        if (!code || !name || !type) return this.warn('缺少参数')

        const body = await $fetch.post('permissions', permission).catch(this.error)
        if (body === undefined) return

        this.success('保存成功')
        permissions.push({
          id: body,
          ...permission
        })
        return true
      },
      edit(row) {
        this.modal({
          title: '修改权限',
          content: `
<div class="layout-form simple">
  <div class="row">
    <label class="label">名称：</label>
    <input class="input" name="name" value="${row.name}">
  </div>
</div>
          `,
          async confirm() {
            const name = this.$el.querySelector('input[name=name]').value
            if (name === '') return

            const body = await $fetch.put(`permissions/${row.id}`, { name }).catch(this.error)
            if (body === undefined) return

            this.success('修改成功')
            row.name = name
            return true
          }
        })
      },
      del(row) {
        const { permissions } = this
        this.modal({
          content: '确认删除？',
          async: true,
          async confirm() {
            const body = await $fetch.delete(`permissions/${row.id}`).catch(this.error)
            if (body === undefined) return

            this.success('删除成功')
            permissions.forEach((p, i) => {
              p.id === row.id && permissions.splice(i, 1)
            })
            return true
          }
        })
      }
    },
    created() {
      this.getPermissions()
    }
  }
</script>
