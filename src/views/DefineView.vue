<template>
  <div>
    <el-button type="primary" @click.native.prevent="triggerDownloadDefine">生成define.xml</el-button>

    <el-button type="primary" @click.native.prevent="triggerDownloadSdtm">下载SDTM</el-button>
  </div>
</template>


<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    triggerDownloadDefine () {
      const projectId = sessionStorage.getItem("projectId")
      this.$api.define.downloadDefine({
        sdtmVersion: "",
        CTVersion: "",
        projectId: projectId
      }).then(res => {
        const url = res.data
        // 下载到本地
        window.location.href = url
      })
    },
    triggerDownloadSdtm(){
      const projectId = sessionStorage.getItem("projectId")
      const path = sessionStorage.getItem("dataset")
      this.$api.define.downloadSdtm({
        projectId: projectId,
        path:path
      }).then(res => {
        const url = res.data
        // 下载到本地
        window.location.href = url
      })
    }
  }
}
</script>
