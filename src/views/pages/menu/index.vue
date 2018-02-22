<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>
      <el-select clearable class="filter-item" style="width: 110px" placeholder="选择类型" v-model="listQuery.type">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable style="width: 200px;" class="filter-item" placeholder="appid" v-model="listQuery.appid"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65" prop="id"></el-table-column>
      <el-table-column align="center" label="名称" width="200" prop="name"></el-table-column>
      <el-table-column align="left" label="类型" width="120" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | statusFilter">{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="appid" width="200" prop="appid"></el-table-column>
      <el-table-column align="center" label="父id" width="65" prop="parentId"></el-table-column>
      <el-table-column align="left" label="链接" width="250" prop="url"></el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item prop="type" label="类型">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item prop="parentId" label="父id">
          <el-select></el-select>
        </el-form-item>
        <el-form-item prop="url" label="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item prop="appid" label="appid">
          <el-input v-model="temp.appid"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getList, update, create, drop } from '@/api/menu'

const typeOptions = [
  { value: 1, label: '系统菜单' },
  { value: 2, label: '应用' },
  { value: 3, label: '扩展' }
]

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      typeOptions,
      tableKey: 0,
      total: null,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        type: 1,
        parentId: undefined,
        url: '',
        appid: ''
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: ''
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'gray',
        3: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return typeOptions[type - 1].label
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      if (this.listQuery.size === val) {
        return
      }
      this.listQuery.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        if (response.code === 200 && response.data) {
          this.list = response.data.list
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: 1,
        parentId: undefined,
        url: '',
        appid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      console.log('update')
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const th = this
        drop(row.id).then(response => {
          if (response.code === 200) {
            th.$message({
              type: 'success',
              message: '删除成功!'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.temp.id = this.total + 1
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
