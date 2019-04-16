<template>
  <div class="vue-table">
    <header class="t-tools" v-if="!simple">
      <div class="l"><slot name="tools-l"></slot></div>
      <div class="m"><slot name="tools-m"></slot></div>
      <div class="r">
        <v-search v-if="total === undefined" @input="filter"></v-search>
      </div>
    </header>

    <div class="t-table" :class="{'fixed-head': fixedHead && simple}">
      <div class="table-wrap">
        <table class="table">
          <colgroup>
            <col v-if="checkbox">
            <col v-for="col of columns" :class="`col-${col.prop}`">
          </colgroup>
          <thead>
          <tr>
            <th v-if="checkbox && source.length">
              <div class="t-title">
                <div class="input-checkbox">
                  <input type="checkbox" value="1" :id="`${_uid}_Select_Row0`" v-model="selectAll">
                  <label :for="`${_uid}_Select_Row0`">全选</label>
                </div>
              </div>
            </th>
            <th v-for="(column, i) of columns" :class="column.cssClass">
              <div class="t-title" :class="column.cssClass">
                {{column.title}}
                <span class="sort-arrows" v-if="column.sortable" @click="handleSortClick(i)">
                  <v-icon icon="down-wide" :class="{'dir-up': true, focus: sortType[i] === 1}"></v-icon>
                  <v-icon icon="down-wide" :class="{focus: sortType[i] === -1}"></v-icon>
                </span>
              </div>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr class="no-data-row" v-if="!source.length">
            <td :colspan="columns.length">暂无数据</td>
          </tr>
          <tr v-for="(row, i) of showed" v-if="simple || (i >= slice[0] && i < slice[1])" :class="{focus: row.focused}">
            <td v-if="checkbox" @click.stop>
              <div class="input-checkbox">
                <input type="checkbox" :id="`${_uid}_Select_Row${i+1}`" :value="i" v-model="selected">
                <label :for="`${_uid}_Select_Row${i+1}`">{{checkboxColumn ? row[checkboxColumn] : (i + 1)}}</label>
              </div>
            </td>
            <td v-for="column of columns" :class="column.cssClass">
              <slot :name="column.prop" :value="row">{{filterSlot(row, column)}}</slot>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="t-footer" v-if="!simple && source.length">
      <v-pagination :total="total || showed.length" :count-of-page="countOfPage" @update="updateTable"></v-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'v-table',
    data() {
      return {
        filterText: '',
        //过滤后的结果
        filtered: [],
        //显示在页面上的结果
        showed: [],
        slice: [0, 0],
        selected: [],
        selectAll: false,
        sortType: [],
        sortIndex: 0
      }
    },
    props: {
      source: {
        type: Array,
        default() {
          return []
        }
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      checkbox: Boolean,
      simple: Boolean,
      fixedHead: Boolean,
      countOfPage: {
        type: Number,
        'default': 10
      },
      keepSort: Boolean,
      highlight: Boolean,
      filters: {
        type: Array,
        'default'() {
          return [
            function (value) {
              return utils.intlNumber(value)
            },
            function (value) {
              return Boolean(value)
            }
          ]
        }
      },
      total: Number,
      checkboxColumn: String
    },
    computed: {
      columnProps() {
        let arr = []
        this.columns.forEach(column => column.custom || arr.push(column.prop))
        return arr
      }
    },
    watch: {
      source() {
        this.initTable()
      },
      filtered() {
        if (this.checkbox) {
          this.selectAll = false
          this.selected = []
        }
      },
      slice() {
        this.checkbox && (this.selectAll = false)
      },
      selectAll(val) {
        if (!val) {
          this.selected = []
          return
        }

        if (this.simple) {
          this.selected = this.showed.map((value, key) => key)
          return
        }

        let [start, end] = this.slice
        let arr = []
        while (start < end) {
          arr.push(start)
          start++
        }
        this.selected = arr
      },
      selected(val, oldVal) {
        if (val.length === 0 && oldVal.length === 0) return
        this.updateChecked(val)
      }
    },
    methods: {
      filterSlot(row, column) {
        if (column.custom) return undefined

        if (column.filter !== undefined) return this.filters[column.filter](row[column.prop])

        return row[column.prop]
      },
      initTable() {
        this.keepSort || (this.sortType = [])
        this.filter(this.filterText)
      },
      filter(words) {
        let result = []
        if (words === '') {
          result = this.source.slice()
        } else {
          result = this.source.filter(row => {
            return this.columnProps.some(prop => {
              let value = row[prop] || ''
              if (utils.getype(value) === 'object') {
                value = value.name || ''
              }

              return value.toString().toLowerCase().includes(words.toLowerCase())
            })
          })
        }
        this.filtered = result
        this.sort()
        this.filterText = words
      },
      updateTable(slice) {
        this.slice = slice
        this.$emit('pagination-change', this.slice)
      },
      handleSortClick(index) {
        this.sortIndex = index
        if (this.sortType[index] === 1) {
          this.sortType.splice(index, 1, -1)
        } else if (this.sortType[index] === -1) {
          this.sortType = []
        } else {
          this.sortType = []
          this.sortType[index] = 1
        }

        this.sort()
      },
      sort() {
        if (this.sortType.length) {
          let sortColumn = this.columnProps[this.sortIndex],
            sortType = this.sortType[this.sortIndex]

          if (sortType === 1) {
            this.showed = utils.sortDesc(this.filtered.slice(), sortColumn)
          } else if (sortType === -1) {
            this.showed = utils.sortDesc(this.filtered.slice(), sortColumn)
            this.showed.reverse()
          }
        } else {
          this.showed = this.filtered
        }
        this.updateChecked()
      },
      updateChecked(val) {
        const selected = val || this.selected
        this.$emit('check', this.showed.filter((row, index) => selected.includes(index)))
      }
    },
    created() {
      this.initTable()
    }
  }
</script>
