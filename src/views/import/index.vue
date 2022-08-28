<template>
  <div>
    <UploadExcel :on-success="succes" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {

  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    // 导入员工
    async succes({ results }) {
      if (this.type === 'user') {
        //   console.log(results)
        // 如果是导入员工
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
        // 处理数据 后端要的key是英文的
        const arr = results.map(ele => {
        // console.log(ele)
          const user = {}
          Object.keys(ele).forEach(key => {
            //   console.log(key)
            //   console.log(ele[key])
          //   console.log(user[userRelations[key]])
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              user[userRelations[key]] = this.formatDate(ele[key], '/') // 只有这样, 才能入库
              return
            }
            user[userRelations[key]] = ele[key]
            //   console.log(ele[key])
          })
          // console.log(user)
          return user
        })
        //   console.log(arr)
        await importEmployee(arr)
        this.$message.success('导入成功')
      }
      // 返回上一级
      this.$router.back()
    },

    // 处理事件格式的
    formatDate(numb, format) {
      const time = new Date(numb * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
