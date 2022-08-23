<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tools :tree-node="company" :is-root="false" />

    </el-card>

    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
    </el-tree>

    <!-- //组件 -->
    <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" @refreshDepts="getDepartments" />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: { treeTools, AddDept },

  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false,
      currentNode: {}
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = tranListToTreeData(depts, '') // 需要将其转化成树形结构
      this.company = { name: companyName, manager: companyManage, id: '' }
      // console.log(result)
    },

    addDepts(node) {
      // console.log('@@@', node)
      this.currentNode = node // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.dialogVisible = true // 显示弹层
    },
    editDepts(node) {
      this.currentNode = node // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.dialogVisible = true // 显示弹层
      console.log(this.$refs.addDept)
      this.$refs.addDept.formData = { ...node } // 在标签上写ref 可以数据回显 可以拿到标签里的data定义的数据
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
