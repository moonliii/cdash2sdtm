<template>
  <el-container>
    <el-aside width="200px">
      <span>应用的域（{{ 38 }}/{{ 41 }}）</span>
      <el-input v-model="search" placeholder="搜索域名称/缩写" />
      <el-menu default-active="0">
        <el-menu-item :default-active="index + ''" :index="(index + '')" v-for="(item, index) in domainList" :key="index"
          @click="showVarInfo(item)">{{
            item }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span>{{ domain }}</span>
        <el-popover ref="popoverRef" placement="bottom" width="400" trigger="click">
          <div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="selectedStandardVars" @change="handleCheckedVarsChange">
              <el-checkbox v-for="standardVar in standardVarList" :label="standardVar.variable"
                :key="standardVar.variable" :disabled="standardVar.coreDegree == 'Req'">{{ standardVar.coreDegree + ' ' +
                  standardVar.name + '/' +
                  standardVar.variable
                }}</el-checkbox>
            </el-checkbox-group>
            <el-row type="flex" justify="end">
              <el-col :span="4" style="text-align: center;">
                <el-button size="mini" type="primary" @click="confirmAddStandardVar">确定</el-button>
              </el-col>
              <el-col :span="4">
                <el-button size="mini" @click="cancelAddStandardVar">取消</el-button>
              </el-col>
            </el-row>
          </div>

          <el-button type="primary" slot="reference" @click="clickAddStandardVar">＋添加标准变量</el-button>
        </el-popover>

        <!-- <el-button type="primary" @click="addStandardVar">＋添加标准变量</el-button> -->
        <el-button type="primary" @click="addCustomVar">＋添加自定义变量</el-button>

      </el-header>
      <el-main>
        <el-table :data="varInfoList" :span-method="objectSpanMethod">
          <el-table-column fixed prop="variable" label="变量缩写" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.isAddVlm">
                <span v-if="scope.row.isEdit">
                  <el-input v-model="scope.row.variable"></el-input>
                </span>
                <span v-else>{{ scope.row.variable }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed prop="coreDegree" label="核心程度" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isAddVlm">{{ scope.row.coreDegree }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变量名称" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isAddVlm" @click="clickAddVlm(scope.$index)">+添加VLM</span>
              <span v-else>
                <el-input v-model="scope.row.varName"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="VLM" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.isAddVlm">
                <el-switch v-if="scope.row.vlm == ''" @change="changeVlm(scope.row)" />
                <span v-else>{{ scope.row.vlm }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数据类型" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.dataType">
                <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="受控术语" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.ctType">
                <el-option v-for="(item, index) in ctTypeList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="长度或展示格式" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm" v-model="scope.row.length"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数据" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.data">
                <el-option v-for="(item, index) in dataList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.source">
                <el-option v-for="(item, index) in sourceList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="域关键变量" width="120">
            <template slot-scope="scope">
              <el-switch v-if="!scope.row.isAddVlm" v-model="scope.row.isKeyVar" @change="changeIsKeyVar(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="填充方式" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.fillMethod">
                <el-option v-for="(item, index) in fillMethodList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="aCRF页码" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm" v-model="scope.row.acrfPage"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="变量注释" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm" v-model="scope.row.varComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="附件" width="120">
            <!-- <el-upload ref="datasetUpload" :headers="headers" action="dataset" :http-request="datasetHttpRequest" multiple
              :limit="1" :auto-upload="false" :on-change="datasetAdd" :file-list="datasetFileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.isAddVlm">
                <el-button v-if="scope.row.isEdit" @click.native.prevent="handleRowConfirm(scope.$index)" type="text">
                  确定
                </el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index)" type="text">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      projectId: '',
      ctVersion: '',
      domainList: [],
      search: '',
      varInfoList: [],
      domain: '',
      dataTypeList: [
        'Text',
        'Integer',
        'Float',
        'Date',
        'Datetime'
      ],
      ctTypeList: [
        '无',
        '标准',
        '自定义',
        '外部'
      ],
      dataList: [
        'Collected',
      ],
      sourceList: [
        '申办方'
      ],
      fillMethodList: [
        '填充全部数据行',
        '指定条件填充'
      ],
      standardVarList: [],
      selectedStandardVars: [],
      checkAll: false,
      isIndeterminate: true,
      vlmCellList: [],

    }
  },
  watch: {
    varInfoList (varInfoListNew, varInfoListOld) {
      let count
      let flag
      for (let i = 0; i < varInfoListNew.length; i++) {
        if (i == 0) {
          this.vlmCellList.push(1)// 初为1，若下一项和此项相同，就往cellList数组中追加0
          count = 0
        } else {
          // 判断与上一项的variable相同(为vlm)，则合并行
          if (varInfoListNew[i].variable == varInfoListNew[i - 1].variable) {
            this.vlmCellList[count] += 1
            this.vlmCellList.push(0) //相等就往cellList数组中追加0，代表要和前面合并
            flag = 1 // 表示有合并
          } else {

            if (flag == 1) {
              //前面有合并，在这之前新增一行“添加VLM”
              const newVar = {
                ...varInfoListNew[i]
              }
              newVar.isAddVlm = true
              // 新增的“添加VLM”行
              // 合并列?

              this.vlmCellList.push(0)
            }
            this.vlmCellList.push(1)
            count = i
            flag = 0
          }
        }
      }
    },
  },
  methods: {
    async initData () {
      this.projectId = sessionStorage.getItem("projectId")
      this.ctVersion = sessionStorage.getItem("ctVersion")
      const param = {
        "projectId": this.projectId,
      }
      //domainList
      const res = await this.$api.varSetting.queryAllDomain(param)
      // console.log(res.data)
      this.domainList = res.data
    },
    async showVarInfo (domain) {
      this.domain = domain
      const param = {
        "projectId": this.projectId,
        "domain": domain
      }
      //varInfoList
      const res = await this.$api.varSetting.queryAllVarInfo(param)
      console.log(res.data)
      this.varInfoList = res.data.map(x => {
        return {
          ...x,
          isEdit: false,
          isAddVlm: false
        }
      })
      console.log(this.varInfoList)
    },
    // 表格根据vlmCellList渲染合并行
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 第一列、第二列的vlm行合并
      if (columnIndex == 0) {
        const rowCell = this.vlmCellList[rowIndex]
        const colCell = rowCell > 0 ? 1 : 0
        return {
          rowspan: rowCell,
          colspan: colCell
        }
      }
    },
    clickAddVlm (index) {
      // "添加VLM"这一行，变成，新增行
      const newVar = {
        ...this.varInfoList[index]
      }
      newVar.isAddVlm = false
      newVar.isEdit = true
      this.varInfoList.splice(index, 1, newVar)
    },
    async clickAddStandardVar () {
      const param = {
        "projectId": this.projectId,
        "sdtmVersion": "string",
        "domain": this.domain
      }
      // 查询当前域的所有标准变量
      const res = await this.$api.varSetting.queryStandardVar(param)
      console.log(res.data)
      const standardVarListAll = res.data
      // 只显示当前列表未添加的变量（standardVarListAll-varInfoList）
      this.standardVarList = standardVarListAll.filter(x =>
        !this.varInfoList.find(y => y.variable == x.variable)
      )
      // Req变量全选
      this.selectedStandardVars = this.standardVarList.filter(x => x.coreDegree == 'Req').map(x => x.variable)
    },
    handleCheckAllChange (val) {
      this.selectedStandardVars = val ? (this.standardVarList.map(x => x.variable)) : [];
      this.isIndeterminate = false;
    },
    handleCheckedVarsChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.standardVarList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.standardVarList.length;
    },
    async confirmAddStandardVar () {
      // 查询vars的信息
      const param = {
        "projectId": this.projectId,
        "sdtmVersion": "string",
        "domain": this.domain,
        "ctVersion": this.ctVersion,
        "variable": ""
      }
      for (let variable of this.selectedStandardVars) {
        param.variable = variable
        const res = await this.$api.varSetting.queryVarInfo(param)
        // console.log(res.data)
        res.isEdit = false
        this.varInfoList.push(res.data)
      }
      this.$refs.popoverRef.doClose()
    },
    cancelAddStandardVar () {
      this.$refs.popoverRef.doClose()
    },
    addCustomVar () {
      // 添加自定义变量，表格新增
      const newVar = {}
      for (let key in this.varInfoList[0]) {
        newVar[key] = ''
      }
      newVar['coreDegree'] = '自定义'
      newVar['vlm'] = 'false'
      newVar['isKeyVar'] = 'isKeyVar'
      // 正在编辑
      newVar['isEdit'] = true
      newVar['isAddVlm'] = false
      console.log(newVar)
      this.varInfoList.push(newVar)
    },
    deleteRow (index) {
      const variable = this.varInfoList[index].variable
      const param = {
        "projectId": this.projectId,
        "domain": this.domain,
        "variable": variable
      }
      // 调用接口删除变量
      this.$api.varSetting.deleteVar(param)
      this.varInfoList.splice(index, 1)
    },
    // 确认新增
    handleRowConfirm (index) {
      this.varInfoList[index].iEdit = false
    },
    submitForm () {
      return true
    }
  },
  async created () {
    await this.initData()
    // 展示第一个domain的var
    const domain = this.domainList[0]
    await this.showVarInfo(domain)
  }
}
</script>