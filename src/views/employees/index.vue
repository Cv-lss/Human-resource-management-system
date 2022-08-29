<template>
  <div>
    <PageTools>
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>

    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" center />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="username" label="头像">
          <template slot-scope="{row}">
            <img v-imgerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px;" @click="showErCodeDialog(row.staffPhoto)">
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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

    <el-dialog title="头像二维码" :visible.sync="ercodeDialog" width="30%" custom-class="canvaseq">
      <canvas id="canvas" />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
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
      visibleDialog: false,
      ercodeDialog: false
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
    },
    // 导出
    async exportData() {
      // const { rows } = await getEmployeeList({
      //   page: 1,
      //   size: this.total
      // })
      // console.log(rows)

      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 1、获取需要导出的数据
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        // 2、调用自己封装的方法进行数据的转化
        const data = this.fromJson(headers, rows)

        // 将后端放回的数据 转换成 到出excel写入的数据
        // [{correctionTime: "2018-11-30", departmentName: "总裁办",formOfEmployment: "1",mobile: "13800000002",timeOfEntry: "2018-11-02",username: "管理员"}]
        // [['张三', '13800000002', '2018-11-02', '1', '2018-11-30', ....]]

        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头数组 -> ['姓名', '手机号', '入职日期', '聘用形式', ....]
          data, // [['13399999', '张三', '2020-2020-2020', '2020', '79119'],[],[],[],[],[],[]]
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    fromJson(headers, rows) {
      // 遍历返回的数据
      return rows.map(ele => {
        // 声明一个空数组
        // const arr = []
        // 用对象方法 keys拿到上面定义的数据的每一个key 然后在进行遍历
        // return Object.keys(headers).map(key => {
        //   // console.log(key)
        //   console.log(headers[key])
        //   // 空数组push
        //   // arr.push(ele[headers[key]])
        //   return ele[headers[key]]
        //   // console.log(ele, '@@')
        //   // console.log(ele[headers[key]], '@@')
        // })
        return Object.values(headers).map(key => {
          if (key === 'timeOfEntry' || key === 'correctionTime') {
            return formatDate(ele[key])
          } else if (key === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(item => item.id === +ele[key])
            return obj?.value || '非正式'
          }
          return ele[key]
        })
      })
    },

    async showErCodeDialog(staffPhoto) {
      this.ercodeDialog = true
      if (!staffPhoto) return this.$message.error('该用户还未设置头像')
      this.ercodeDialog = true

      await this.$nextTick()
      const canvas = document.getElementById('canvas')
      QrCode.toCanvas(canvas, staffPhoto)
    }
  }
}
</script>

<style lang="scss" >

.canvaseq .el-dialog__body {
  text-align: center;
}
</style>

