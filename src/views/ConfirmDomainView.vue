<template>
  <div>
    <el-row>
      <!-- <el-col :span="10"><span>应用的域（{{ appliedDomainCount }}/{{ listedDomainCount }}）</span></el-col> -->
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
        <!-- <el-select v-model="statusSelected" clearable placeholder="启用状态">
          <el-option v-for="item in statusList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select> -->
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="filterDomainInfo">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="domainInfoShowList" style="width: 100%">
      <!-- <el-table-column label="启用" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" />
        </template>
      </el-table-column> -->
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
      <el-table-column label="目的" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.purpose"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="文件描述" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fileDescription"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="文件地址" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fileAddress"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="删除域" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteDomain(scope.row)">删除</el-button>
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
      // 启用
      // statusList: ["启用", "未启用"],
      // statusSelected: "",
      domainAllList: [], // 所有的domain
      domainInfoSuggestedList: [], // table实际操作的domainInfoList
      // domainOnList: [], // 启用的domain
      domainToAdd: '',
      searchInput: '',
      projectId: '',
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
      const arr = this.domainInfoSuggestedList.map(x => x.observationClass)
      return Array.from(new Set(arr))
    },
    // // 启用的domain
    // domainOnInfoList () {
    //   return this.domainInfoSuggestedList.filter(x => {
    //     return x.status == true
    //   })
    // },
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
      const param = {
        "projectId": this.projectId,
        "version": ""
      }
      //queryAll
      let res = await this.$api.confirmDomain.queryAllDomain(param)
      // console.log(res)
      this.domainAllList = res.data.data.domainAllList
      // 启用
      this.domainInfoSuggestedList = res.data.data.domainInfoVoList.map(x => {
        return {
          ...x,
          status: false,
          isShow: true
        }
      })
    },

    // 筛选
    filterDomainInfo () {
      for (let item of this.domainInfoSuggestedList) {
        // 筛选条件
        if (
          (this.observationClassSelected == "" || this.observationClassSelected == item.observationClass)
          && (this.searchInput == "" || this.searchInput == item.domain || this.searchInput == item.name)
          // && (this.statusSelected == "" || (this.statusSelected == "启用" && item.status == true) || (this.statusSelected == "未启用" && item.status == false))
        ) {
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
        "sdtmVersion": "",
        "ctVersion": ""
      }
      console.log('param', param)
      this.$api.confirmDomain.queryDomInfo(param).then(res => {
        console.log(res)
        const newDomainInfo = {
          ...res.data.data,
          status: false,
          isShow: true
        }
        this.domainInfoSuggestedList.push(newDomainInfo)
      })
    },
    // 删除域
    deleteDomain (row) {
      this.domainInfoSuggestedList = this.domainInfoSuggestedList.filter(x => {
        return x.domain != row.domain
      })
      // 调用删除接口
      const param =
      {
        "projectId": this.projectId,
        "domain": row.domain
      }
      this.$api.confirmDomain.deleteDom(param).then(res => {
        console.log(res)
        // this.domainInfoSuggestedList.delete?(res.data)
      })
    },
    // save
    submitForm () {
      const savedList = this.domainInfoSuggestedList.map(x => {
        delete x.isShow
        delete x.status
        return x
      })
      // console.log(savedList)
      this.$api.confirmDomain.save(savedList).then(res => {
        // console.log(res)
      })
      return true
    }
  },

  created () {
    this.initData()
  }
}
</script>