<template>
  <div>
    <PageTools>
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>

    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" center />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="workNumber" label="工号" />
        <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatterFn" />
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="total, prev, pager, next,sizes"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5, 10, 20, 30]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>

    <!-- //新增员工 -->
    <add-employee :visible-dialog.sync="visibleDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
export default {
  name: 'Employees',
  components: { addEmployee },
  data() {
    return {
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10
      },
      visibleDialog: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    // 获取员工的综合列表数据
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        // console.log(res)
        this.list = rows
        this.total = total
        // 处理一个页面删除完没有数据的问题
        if (total !== 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 格式化后端返回的1,2
    formatterFn(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      const obj = EmployeeEnum.hireType.find(ele => ele.id === +cellValue)
      // console.log(obj)
      // return obj ? obj.value : '非正式'
      // 另一种写法
      return obj?.value ?? '非正式'
    },

    // 添加的弹窗
    add() {
      this.visibleDialog = true
    },

    // 删除
    async del(id) {
      try {
        await this.$confirm('确认删除吗？', '提示', {
          type: 'warning'
        })
        // console.log(11)
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log('🚀 ~ file: index.vue ~ line 118 ~ del ~ error', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
