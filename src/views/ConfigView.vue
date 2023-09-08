<template>
  <el-form :model="configData" :rules="rules" ref="configData" label-width="120px" class="demo-configData">

    <el-form-item label="研究名称" prop="researchName">
      <el-input v-model="configData.researchName"></el-input>
    </el-form-item>

    <el-form-item label="研究描述">
      <el-input v-model="configData.researchDescription"></el-input>
    </el-form-item>

    <el-form-item label="方案名称">
      <el-input v-model="configData.schemeName"></el-input>
    </el-form-item>

    <el-form-item label="元数据名称">
      <el-input v-model="configData.metadataName"></el-input>
    </el-form-item>

    <el-form-item label="元数据描述">
      <el-input v-model="configData.metadataDescription"></el-input>
    </el-form-item>

    <el-form-item label="SDTMIG" prop="sdtmig">
      <el-input v-model="configData.sdtmig"></el-input>
    </el-form-item>

    <el-form-item label="SDTM文件说明" prop="sdtmDescription">
      <el-input v-model="configData.sdtmDescription"></el-input>
    </el-form-item>

    <el-form-item label="DefineXML" prop="defineXML">
      <el-input v-model="configData.defineXML"></el-input>
    </el-form-item>

    <el-form-item label="DefineXML文件说明" prop="defineXMLDescription">
      <el-input v-model="configData.defineXMLDescription"></el-input>
    </el-form-item>

    <el-form-item label="aCRF" prop="aCRF">
      <el-upload ref="aCRFUpload" accept=".pdf" :headers="headers" action="aCRF" :http-request="aCRFHttpRequest" multiple
        :limit="1" :auto-upload="false" :on-change="aCRFAdd" :file-list="aCRFFileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="文件目的" prop="filePurpose">
      <el-radio-group v-model="configData.filePurpose">
        <el-radio label="递交"></el-radio>
        <el-radio label="其他"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="当前文件版本" prop="fileVersion">
      <el-input v-model="configData.fileVersion"></el-input>
    </el-form-item>

    <el-form-item label="文件说明">
      <el-input v-model="configData.fileDescription"></el-input>
    </el-form-item>

    <el-form-item label="上传原始数据集" prop="dataset">
      <el-upload ref="datasetUpload" :headers="headers" action="dataset" :http-request="datasetHttpRequest" multiple
        :limit="1" :auto-upload="false" :on-change="datasetAdd" :file-list="datasetFileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="受控术语版本" prop="ctVersion">
      <el-input v-model="configData.ctVersion"></el-input>
    </el-form-item>

    <el-form-item label="受控术语文件说明" prop="ctDescription">
      <el-input v-model="configData.ctDescription"></el-input>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      configData: {
        researchName: '',
        researchDescription: '',
        schemeName: '',
        metadataName: '',
        metadataDescription: '',
        sdtmig: '',
        sdtmDescription: '',
        defineXML: '',
        defineXMLDescription: '',
        aCRF: '',
        filePurpose: '',
        fileVersion: '',
        fileDescription: '',
        status: 0,
        dataset: '',
        ctVersion: '',
        ctDescription: ''
      },
      // 上传的文件(展示)
      aCRFFileList: [],
      datasetFileList: [],
      // 文件上传
      headers: {
        "content-type": "multipart/form-data"
      },
      //用于放文件数据  FormData类型
      fd: {},
      // 校验规则
      rules: {
        researchName: [
          { required: true, message: '请输入研究名称', trigger: 'blur' }
        ],
        // sdtmig: [
        //   { required: true, message: '请填写SDTMIG', trigger: 'blur' }
        // ],
        defineXML: [
          { required: true, message: '请填写DefineXML', trigger: 'blur' }
        ],
        aCRF: [
          { required: true, message: '请上传aCRF', trigger: 'blur' }
        ],
        filePurpose: [
          { required: true, message: '请填写文件目的', trigger: 'blur' }
        ],
        dataset: [
          { required: true, message: '请上传原始数据集', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {

    // 添加文件时，控制文件类型(aCRF必须是pdf)
    aCRFAdd (file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'pdf') {
        this.$message.warning('文件必须为.pdf类型')
      }
      // 表示已经上传（rule判断）
      this.configData.aCRF = '#'
    },

    datasetAdd () {
      // 表示已经上传（rule判断）
      this.configData.dataset = '#'
    },

    aCRFHttpRequest (param) {
      const fd = new FormData()
      const fileObj = param.file
      this.aCRFFileList = []
      this.aCRFFileList.push({
        name: fileObj.name,
      })
      fd.append('file', fileObj)
      this.fd = fd
    },

    datasetHttpRequest (param) {
      const fd = new FormData()
      const fileObj = param.file
      this.datasetFileList = []
      this.datasetFileList.push({
        name: fileObj.name,
      })
      fd.append('file', fileObj)
      this.fd = fd
    },


    async submitForm () {
      let that = this
      // validate
      const valid = await this.$refs.configData.validate().catch((err) => { return false })
      if (valid) {
        // aCRF文件手动上传
        that.$refs.aCRFUpload.submit()
        that.configData.aCRF = (await that.$api.config.upload(that.fd)).data

        // dataset文件手动上传
        that.$refs.datasetUpload.submit()
        that.configData.dataset = (await that.$api.config.uploadDataset(that.fd)).data

        // 处理
        that.configData.ctVersion = ''
        that.configData.fileVersion = ''
        sessionStorage.setItem("sdtmig", that.configData.sdtmig)
        that.configData.sdtmig = ''

        // 提交表单
        // 获取projectId
        const projectId = (await that.$api.config.save(that.configData)).data.data
        sessionStorage.setItem("projectId", projectId)

        // 保存表单数据
        // sessionStorage.setItem('configData', JSON.stringify(that.configData))
        // sessionStorage.setItem('aCRFFileList', JSON.stringify(that.aCRFFileList))
        // sessionStorage.setItem('datasetFileList', JSON.stringify(that.datasetFileList))
      } else {
        that.$message.error("请完整填写信息！")
      }
      return valid
    },

    initForm () {
      // default input
      this.configData.filePurpose = '递交'
    },

    // restoreForm () {
    //   const configData = sessionStorage.getItem('configData')
    //   // upload中的param.file也需要恢复
    //   const aCRFFileList = sessionStorage.getItem('aCRFFileList')
    //   const datasetFileList = sessionStorage.getItem('datasetFileList')
    //   if (configData && aCRFFileList && datasetFileList) {
    //     this.configData = JSON.parse(configData)
    //     this.aCRFFileList = JSON.parse(aCRFFileList)
    //     this.datasetFileList = JSON.parse(datasetFileList)
    //   } else {
    //     this.initForm()
    //   }
    // }
  },

  created () {
    console.log('created')
    // this.restoreForm()
  }
}
</script>

<style>
.el-form-item {
  text-align: left
}
</style>
