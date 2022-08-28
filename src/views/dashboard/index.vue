<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      info: {}
    }
  },

  // direactives 局部注册自定义指令
  // directives: {
  //   // key: value
  //   // key 自定义指令的名称
  //   // value ==》 自定义指令对应的逻辑
  //   color: {
  //     inserted(dom, options, vNode) {
  //       console.log(dom) // dom 指令绑定的元素
  //       console.log(options) // 描述 当前指令信息
  //       console.log(vNode.context) // 可以访问到 当前vue实例的
  //       // 实现 改 当前 dom 元素颜色
  //       dom.style.color = options.value
  //     }
  //   }
  // },

  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    //   import('@/vendor/Export2Excel').then(excel => {
    //     excel.export_json_to_excel({
    //       header: ['姓名', '手机号', '入职日期', '聘用形式'], // 表头 必填  ['姓名', '手机号', '入职日期', '聘用形式']
    //       data: [
    //         ['张三', '13399999', '2020-2020-2020', '正式'],
    //         ['张三22', '13399999', '2020-2020-2020', '非正式']
    //       ], // 具体数据 必填 [['张三', '13399999', '2020-2020-2020', '正式']]
    //       filename: 'excel-list', // 非必填
    //       autoWidth: true, // 非必填
    //       bookType: 'xlsx' // 非必填
    //     })
    //   })
    // },
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
