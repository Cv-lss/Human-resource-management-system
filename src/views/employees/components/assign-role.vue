<template>
  <el-dialog
    title="分配角色"
    :visible="value"
    :before-close="handleClose"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="sureRole">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  model: { // 可以修改事件源
    event: 'update'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  // 因为这个组件在mountd调用的话 是执行一次 这里监听下 value的变化 如果变化了就调用 也可以用ref在父组件调用这个方法
  watch: {
    async value(newVal) {
      if (newVal) {
        this.getRoleList()
        this.getUserDetailById()
      }
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update', false)
      this.roleList = []
    },
    // 获取数据
    async getRoleList() {
      const { rows } = await getRoleList()
      this.roleList = rows
    },
    async getUserDetailById() {
      const { roleIds } = await getUserDetailById(this.$attrs['current-user-id'])
      this.roleIds = roleIds || []
    },
    // 确定按钮

    async sureRole() {
      try {
        this.loading = true
        await assignRoles({ id: this.$attrs['current-user-id'], roleIds: this.roleIds })
        this.handleClose()
        this.$message.success('角色分配成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }

  }
}
</script>
