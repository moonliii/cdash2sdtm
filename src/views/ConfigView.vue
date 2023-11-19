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
      <el-select v-model="configData.sdtmig" clearable placeholder="请选择SDTMIG">
        <el-option v-for="item in sdtmigList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SDTM文件说明" prop="sdtmDescription">
      <el-input v-model="configData.sdtmDescription"></el-input>
    </el-form-item>

    <el-form-item label="DefineXML" prop="defineXML">
      <el-select v-model="configData.defineXML" clearable placeholder="请选择defineXML">
        <el-option v-for="item in defineXMLList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
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
      <el-select v-model="configData.ctVersion" clearable placeholder="请选择受控术语版本">
        <el-option v-for="item in ctVersionList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
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
      sdtmigList:[],
      defineXMLList:[],
      ctVersionList:[],
      // 上传的文件(展示)
      aCRFFileList: [],
      datasetFileList: [],
      // 文件上传
      headers: {
        "content-type": "multipart/form-data"
      },
      //用于放文件数据  FormData类型
      acrfFormData: undefined,
      datasetFormData: undefined,
      // 校验规则
      isAddAcrf: false,
      isAddDataset: false,
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
        // aCRF: [
        //   { required: true, message: '请上传aCRF', trigger: 'blur' }
        // ],
        filePurpose: [
          { required: true, message: '请填写文件目的', trigger: 'blur' }
        ],
        // dataset: [
        //   { required: true, message: '请上传原始数据集', trigger: 'blur' }
        // ],
      }
    }
  },
  methods: {

    // 添加文件时，控制文件类型(aCRF必须是pdf)
    aCRFAdd (file) {
      // console.log('on change')
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'pdf') {
        this.$message.warning('文件必须为.pdf类型')
      }
      this.isAddAcrf = true
    },

    datasetAdd () {
      this.isAddDataset = true
    },

    aCRFHttpRequest (param) {
      const fileObj = param.file
      if (fileObj) {
        const fd = new FormData()
        if (this.aCRFFileList.length != 0) {
          this.aCRFFileList = []
        }
        this.aCRFFileList.push({
          name: fileObj.name,
        })
        fd.append('file', fileObj)
        this.acrfFormData = fd
      }
    },

    datasetHttpRequest (param) {
      const fileObj = param.file
      if (fileObj) {
        const fd = new FormData()
        if (this.datasetFileList.length != 0) {
          this.datasetFileList = []
        }
        this.datasetFileList.push({
          name: fileObj.name,
        })
        fd.append('file', fileObj)
        this.datasetFormData = fd
      }
    },


    async submitForm () {
      let that = this
      // 验证是否上传
      if (!this.isAddAcrf) {
        that.$message.error("请上传aCRF！")
        return false
      }
      if (!this.isAddDataset) {
        that.$message.error("请上传原始数据集！")
        return false
      }
      // validate
      const valid = await this.$refs.configData.validate().catch((err) => { return false })
      if (valid) {

        // aCRF文件手动上传
        that.$refs.aCRFUpload.submit()
        // 上传文件没有改变，才调用接口
        if (that.acrfFormData) {
          that.configData.aCRF = (await that.$api.config.upload(that.acrfFormData)).data
        }

        // dataset文件手动上传
        that.$refs.datasetUpload.submit()
        if (that.datasetFormData) {
          that.configData.dataset = (await that.$api.config.uploadDataset(that.datasetFormData)).data
        }
        console.log(that.configData)

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
        sessionStorage.setItem('configData', JSON.stringify(that.configData))
        sessionStorage.setItem('aCRFFileList', JSON.stringify(that.aCRFFileList))
        sessionStorage.setItem('datasetFileList', JSON.stringify(that.datasetFileList))
        sessionStorage.setItem('isAddAcrf', this.isAddAcrf)
        sessionStorage.setItem('isAddDataset', this.isAddDataset)

        // 原始数据集url
        sessionStorage.setItem('dataset', this.configData.dataset)


      } else {
        that.$message.error("请完整填写信息！")
      }
      return valid
    },

    async initForm () {
      // default input
      this.configData.filePurpose = '递交'
      let res
      res = await this.$api.config.querySdtmig()
      this.sdtmigList = res.data
      res = await this.$api.config.queryDefineVersion()
      this.defineXMLList = res.data
      res = await this.$api.config.queryCtVersion()
      this.ctVersionList = res.data
    },

    async restoreForm () {
      const configData = sessionStorage.getItem('configData')
      const aCRFFileList = sessionStorage.getItem('aCRFFileList')
      const datasetFileList = sessionStorage.getItem('datasetFileList')
      this.isAddAcrf = sessionStorage.getItem('isAddAcrf')
      this.isAddDataset = sessionStorage.getItem('isAddDataset')
      if (configData && aCRFFileList && datasetFileList) {
        this.configData = JSON.parse(configData)
        this.aCRFFileList = JSON.parse(aCRFFileList)
        this.datasetFileList = JSON.parse(datasetFileList)
      } else {
        await this.initForm()
      }
    }
  },

  async created () {
    console.log('created')
    await this.restoreForm()
  }
}
</script>

<style>
.el-form-item {
  text-align: left
}
</style>
