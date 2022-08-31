<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools :show="false">
        <template v-slot:after>
          <el-button type="primary" size="small" @click="add('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id" default-expand-all>
        <el-table-column label="序号" type="index" />
        <el-table-column prop="name" align="center" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type * 1 == 1" type="text" icon="el-icon-circle-plus-outline" @click="add(row.id,2)">添加</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" style="color:red" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 新建 -->
    <addPermission ref="addPermission" :dialog-visible.sync="dialogVisible" @refresh="getPermissionList" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import addPermission from './components/add-permission.vue'
export default {
  name: 'Hrsaas1Index',
  components: { addPermission },
  data() {
    return {
      list: [],
      loading: false,
      dialogVisible: false
    }
  },

  mounted() {
    this.getPermissionList()
  },

  methods: {
    // 获取数据
    async getPermissionList() {
      try {
        this.loading = true
        const res = await getPermissionList()
        this.list = tranListToTreeData(res, '0')
      } catch (error) {
        console.log('🚀 ~ file: index.vue ~ line 51 ~ getPermissionList ~ error', error)
      } finally {
        this.loading = false
      }
    },

    // 添加
    add(pid, type) {
      this.dialogVisible = true
      this.$refs.addPermission.formData.pid = pid
      this.$refs.addPermission.formData.type = type
    },

    // 编辑
    edit(row) {
      this.$refs.addPermission.formData = { ...row }
      this.dialogVisible = true
    },
    // 删除
    async del(id) {
      try {
        await this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (error) {
        console.log('🚀 ~ file: index.vue ~ line 66 ~ del ~ error', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
