<template>
  <el-dialog
    :title="`${formData.id ? '编辑' : '新增'}角色`"
    width="30%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true,message:'必填项',trigger:'blur'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    // 取消按钮
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
      this.formData = {
        name: '',
        description: ''
      }
    },
    // 确认按钮
    async submitRole() {
      // 表单验证通过
      try {
        this.loading = true
        await this.$refs.roleDialogForm.validate()
        // 发送添加角色请求
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        // 发完之后调用获取角色接口
        this.$parent.getRoleList()
        // 提示
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}角色成功`)
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
