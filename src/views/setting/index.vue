<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <!-- 放置页签 -->
        <el-tab-pane label="角色管理">
          <!-- 新增角色按钮 -->
          <el-row style="height:60px">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="add"
            >新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table v-loading="loading" border="" :data="list">
            <el-table-column type="index" label="序号" width="120" />
            <el-table-column prop="name" label="角色名称" width="240" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="320">
              <template slot-scope="{row}">
                <el-button size="small" type="success" @click="btnPermOK(row)">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <!-- 分页组件 -->

            <!-- // background   添加背景
            // current-page 当前的页面
            // page-size    每一页展示的条数
            // page-sizes   每页显示个数选择器的选项设置
            // total        总共多少条数据
            // layout       布局
            // current-change 改变当前页码的触发（current-page 值改变的时候触发）
            // size-change 改变页面的数据条数的时候 触发（page-size 值改变的时候触发） -->
            <el-pagination
              background
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              layout="total,prev, pager, next,sizes"
              :page-sizes="[5,10,20,30]"
              :total="total"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>

        <!-- //公司信息 -->
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>
    </el-card>

    <role-dialog ref="roleDialog" :dialog-visible.sync="dialogVisible" />

    <!-- 分配权限 -->
    <managerPermission ref="managerPermission" :dialog-visible.sync="dialogVisible1" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
import managerPermission from './components/manager-permission.vue'
export default {
  name: 'Hrsaas1Index',
  components: { roleDialog, managerPermission },
  data() {
    return {
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {},
      dialogVisible1: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    // 公司信息
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      this.loading = true
      try {
        const { rows, total } = await getRoleList(this.page)
        // console.log(res)
        this.list = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    add() {
      // console.log(111)
      this.dialogVisible = true
    },
    // 编辑
    edit(row) {
      console.log(row)
      this.dialogVisible = true
      // 可以用ref打标识 拿到子组件的数据
      this.$refs.roleDialog.formData = { ...row }
    },

    // 删除
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        })
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.$message.success('删除角色成功')
        this.page.page = 1
        this.getRoleList() // 重新加载数据
      } catch (error) {
        console.log(error)
      }
    },

    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },

    // 分配权限
    async  btnPermOK(row) {
      await this.$refs.managerPermission.getPermissionList(row.id)
      this.dialogVisible1 = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
