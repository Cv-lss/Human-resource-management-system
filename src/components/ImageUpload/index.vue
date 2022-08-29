<template>
  <div>
    <el-upload
      v-loading="loading"
      list-type="picture-card"
      :file-list="fileList"
      action="#"
      :http-request="oRequest"
      :on-change="change"
      :on-remove="remove"
      :on-preview="preview"
      :limit="limit"
      :before-upload="upload"
      :class="`${fileList.length === limit ? 'hideAdd' : ''}`"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog title="图片预览" :visible.sync="previewImgDialogVisible">
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDVryqVAj6JKagaGm6C4h6IG2au0tUt53o',
  SecretKey: 'd6MPEqGTSFo8KH8lAQUKvKXYLvJUTHrE'
})
console.log(cos)
export default {
  name: 'ImageUpload',
  props: {
    limit: {
      type: Number,
      default: 1
    }
    // uploadCheck: Function
  },
  data() {
    return {
      loading: false,
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' },
        // { name: 'default2', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewImgDialogVisible: false,
      imgUrl: ''
    }
  },
  methods: {
    change(file, fileList) {
    //   console.log('🚀 ~ file: index.vue ~ line 19 ~ change ~ file', file)
    //   console.log('🚀 ~ file: index.vue ~ line 19 ~ change ~ fileList', fileList)
      this.fileList = fileList
    },
    oRequest(data) {
    //   console.log('🚀 ~ file: index.vue ~ line 23 ~ oRequest ~ data', data)
      this.loading = true
      cos.putObject({
        Bucket: 'lss-harss-32-1313544619', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        console.log(err || data)
        this.loading = false
        if (err || data.statusCode !== 200) {
          this.$message.success('图片上传有误，请重新上传')
        }
        this.$emit('onSuccess', {
          url: 'https://' + data.Location
        })
      })
    },
    remove(file, fileList) {
    //   console.log('🚀 ~ file: index.vue ~ line 26 ~ remove ~ file', file)
    //   console.log('🚀 ~ file: index.vue ~ line 26 ~ remove ~ fileList', fileList)
      this.fileList = fileList
    },
    preview(file) {
    //   console.log('🚀 ~ file: index.vue ~ line 30 ~ preview ~ file', file.url)
      this.imgUrl = file.url
      this.previewImgDialogVisible = true
    },
    upload(file) {
      console.log('🚀 ~ file: index.vue ~ line 83 ~ upload ~ file', file)
      //   if (this.uploadCheck && !this.uploadCheck(file)) {
      //     return false
      //   }
      //   { console.log('🚀 ~ file: index.vue ~ line 62 ~ upload ~ file', file) }
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg+xml']
      if (!types.includes(file.type)) {
        this.$message.error(`图片格式不对，请上传${types.join(', ')}格式`)
        return false
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片过大，请上传5MB')
        return false
      }
      return true
    }

  }
}
</script>

<style lang='scss'>
.hideAdd {
    .el-upload--picture-card {
        display: none;
    }
}
</style>
