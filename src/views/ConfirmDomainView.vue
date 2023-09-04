<template>
  <div>
    <el-row>
      <el-col :span="10"><span>应用的域（{{ appliedDomainCount }}/{{ listedDomainCount }}）</span></el-col>
      <el-col :span="4">
        <el-select v-model="observationClassSelected" clearable placeholder="观测类别">
          <el-option v-for="item in observationClassList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
      <!-- <el-input v-model="configData.researchName"></el-input> -->
      <el-col :span="4">
        <el-input v-model="searchInput" placeholder="名称/缩写"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="statusSelected" clearable placeholder="启用状态">
          <el-option v-for="item in statusList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="filterDomainInfo">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="domainInfoShowList" style="width: 100%">
      <el-table-column label="启用" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="domain" label="缩写" width="180">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="observationClass" label="观测类别" width="180">
      </el-table-column>
      <el-table-column prop="structure" label="构造" width="180">
      </el-table-column>
      <el-table-column prop="keyVariable" label="关键变量" width="180">
      </el-table-column>
      <el-table-column label="删除域" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteDomain(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-row>
      <el-select v-model="domainToAdd" clearable placeholder="请选择要添加的域">
        <el-option v-for="item in domainAddList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" @click="addDomain">添加域</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      observationClassSelected: "",
      statusList: ["启用", "未启用"],
      statusSelected: "",
      domainAllList: [], // 所有的domain
      domainInfoSuggestedList: [], // table实际操作的domainInfoList
      // domainOnList: [], // 启用的domain
      domainToAdd: '',
      searchInput: '',
      projectId: '',
      ctVersion: ''
    }
  },
  computed: {
    //table中展示的（筛选）
    domainInfoShowList () {
      return this.domainInfoSuggestedList.filter(x => {
        return x.isShow == true
      })
    },
    // 观测类别
    observationClassList () {
      return this.domainInfoSuggestedList.map(x => x.observationClass)
    },
    // 启用的domain
    domainOnInfoList () {
      return this.domainInfoSuggestedList.filter(x => {
        return x.status == true
      })
    },
    appliedDomainCount () {
      return this.domainOnInfoList.length
    },
    listedDomainCount () {
      return this.domainInfoSuggestedList.length
    },
    // 可以添加的domain
    domainAddList () {
      return this.domainAllList.filter(x =>
        !this.domainInfoSuggestedList.find(y => y.domain == x)
      )
    }
  },
  methods: {
    async initData () {
      this.projectId = sessionStorage.getItem("projectId")
      this.ctVersion = sessionStorage.getItem("ctVersion")
      const param = {
        "projectId": this.projectId,
        "version": "string"
      }
      //queryAll
      const res = await this.$api.confirmDomain.queryAllDomain(param)
      console.log(res.data)
      this.domainAllList = res.data.domainAllList
      // this.domainInfoSuggestedList = res.data.domainInfoVoList
      // 启用
      this.domainInfoSuggestedList = res.data.domainInfoVoList.map(x => {
        return {
          ...x,
          status: false,
          isShow: true
        }
      })
    },

    // 筛选
    filterDomainInfo () {
      console.log(this.observationClassSelected == "", this.searchInput, this.statusSelected)
      for (let item of this.domainInfoSuggestedList) {
        // 筛选条件
        if ((this.observationClassSelected == "" || this.observationClassSelected == item.observationClass) &&
          (this.searchInput == "" || this.searchInput == item.domain || this.searchInput == item.name) &&
          (this.statusSelected == "" || (this.statusSelected == "启用" && item.status == true) || (this.statusSelected == "未启用" && item.status == false))) {
          item.isShow = true
        } else {
          item.isShow = false
        }
      }
    },
    // 添加域
    addDomain () {
      // 添加后，查询添加的这个域的信息 queryDomInfo
      console.log(this.domainToAdd)
      const param =
      {
        "domain": this.domainToAdd,
        "projectId": this.projectId,
        "sdtmVersion": "string",
        "ctVersion": this.ctVersion
      }
      this.$api.confirmDomain.queryDomInfo(param).then(res => {
        const newDomainInfo = {
          ...res.data,
          status: false,
          isShow: true
        }
        this.domainInfoSuggestedList.push(newDomainInfo)
      })
    },
    // 删除域
    deleteDomain (row) {
      console.log(this.domainInfoSuggestedList)
      this.domainInfoSuggestedList = this.domainInfoSuggestedList.filter(x => {
        return x.domain != row.domain
      })
      console.log(this.domainInfoSuggestedList)
      console.log(this.domainInfoShowList)
      const param =
      {
        "projectId": this.projectId,
        "domain": row.domain
      }
      this.$api.confirmDomain.deleteDom(param).then(res => {
        // this.domainInfoSuggestedList.delete?(res.data)
      })
    },
    // save
    submitForm () {
      return true
    }
  },

  created () {
    this.initData()
  }
}
</script>