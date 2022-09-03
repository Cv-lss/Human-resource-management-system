<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <!--
show-checkbox        节点是否可被选择 checkbox 出现
default-expand-all   默认展开
props                配置选项
default-checked-keys 默认选中的节点
check-strictly       父子不联动-->

    <el-tree
      ref="permTree"
      :data="permData"
      show-checkbox
      :props="defaultProps"
      :default-checked-keys="selectedKeys"
      :default-expand-all="true"
      :check-strictly="true"
      node-key="id"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { getRoleDetail, assignPerm } from '@/api/setting'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 准备好假数据
      permData: [],
      defaultProps: {
        label: 'name'
      },
      selectedKeys: [],
      userId: '',
      loading: false
    }
  },

  methods: {
    handleClose() {
      this.selectCheck = []

      this.$emit('update:dialogVisible', false)
    },
    async getPermissionList(id) {
      try {
        this.userId = id
        const res = await getPermissionList()
        const { permIds } = await getRoleDetail(id)
        this.permData = tranListToTreeData(res, '0')
        this.selectedKeys = permIds
      } catch (error) {
        console.log('🚀 ~ file: manager-permission.vue ~ line 81 ~ getPermissionList ~ error', error)
      }
    },

    async btnOk() {
      try {
        this.loading = true
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.userId })
        this.$message.success('角色分配成功')
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }

  }
}
</script>
