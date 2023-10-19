<template>
  <el-container>
    <el-aside width="200px">
      <!-- <span>应用的域</span> -->
      <!-- <el-input v-model="search" placeholder="搜索域名称/缩写" /> -->
      <el-menu default-active="0">
        <el-menu-item :default-active="index + ''" :index="(index + '')" v-for="(item, index) in domainList" :key="index"
          @click="showVarInfo(item)">{{
            item }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- <span>{{ domain }}</span> -->
        <el-popover ref="popoverRefStandard" placement="bottom" width="400" trigger="click">
          <div style="height:300px; overflow-y: scroll;">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="selectedStandardVars" @change="handleCheckedVarsChange">
              <el-checkbox style="width: 400px;height: 25px;" v-for="standardVar in standardVarList"
                :label="standardVar.variable" :key="standardVar.variable" :disabled="standardVar.coreDegree == 'Req'">{{
                  standardVar.coreDegree + ' ' +
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
        <el-table :data="showList">
          <el-table-column fixed prop="variable" label="变量缩写" width="120">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isAddVlm" @click.native.prevent="addVlm(scope.$index)" type="text">
                +添加VLM
              </el-button>
              <div v-if="!scope.row.isAddVlm">
                <span v-if="scope.row.isEditCustom || scope.row.isEditVlm">
                  <el-input v-model="scope.row.variable"></el-input>
                </span>
                <span v-else>{{ scope.row.variable }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed prop="coreDegree" label="核心程度" width="120">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isAddVlm" @click.native.prevent="finishAddVlm(scope.$index)" type="text">
                完成添加VLM
              </el-button>
              <span v-if="!scope.row.isAddVlm">{{ scope.row.coreDegree }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变量名称" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isAddVlm">
                <el-input v-model="scope.row.varName"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="原始数据表名" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.sheetName" @change="handleSheetNameChange">
                <el-option v-for="(item, index) in sheetNameList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="表头字段" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm" v-model="scope.row.field">
                <el-option v-for="(item, index) in fieldList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="VLM" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.isAddVlm">
                <el-switch v-if="scope.row.vlm == null" v-model="scope.row.hasVLM"
                  @change="handleChangeHasVlm(scope.$index)" />
                <span v-else><el-input v-model="scope.row.vlm"></el-input></span>
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
              <div v-if="!scope.row.isAddVlm && !scope.row.hasVLM">
                <el-select v-model="scope.row.ctType">
                  <el-option v-for=" (item, index) in ctTypeList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
                <div>
                  <el-row v-if="scope.row.ctType == '标准'">
                    <el-select v-model="scope.row.codeListNameSelected" @click.native="queryCodeList(scope.row.variable)"
                      @change="handleChangeCodeListName">
                      <el-option v-for=" (item, index) in tmpCodeNameList" :key="index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <el-button v-if="scope.row.codeListNameSelected" @click.native="triggerModifyDict(scope.$index)"
                      type="text">
                      修改字典
                    </el-button>
                    <span>{{ scope.row.ctCode }}</span>
                    <el-dialog title="选项字典设置" :visible.sync="modifyDictDialogVisible" width="50%" append-to-body>
                      <el-row>
                        <el-col :span="8">名称：<el-input label="dictName" v-model="scope.row.ctName" /></el-col>
                        <el-col :span="8">类型：<el-input label="type" v-model="type" /></el-col>
                        <el-col :span="8">语种：<el-input label="language" v-model="language" /></el-col>
                      </el-row>
                      <el-table :data="tmpCodeList">
                        <el-table-column label="启用" width="80">
                          <template slot-scope="codeListScope">
                            <el-switch v-model="codeListScope.row.useFlag" />
                          </template>
                        </el-table-column>
                        <el-table-column fixed prop="code" label="编码" width="80"></el-table-column>
                        <el-table-column fixed prop="value_cn" label="递交值" width="80"></el-table-column>
                        <el-table-column fixed prop="synonym_cn" label="同义词" width="80"></el-table-column>
                        <el-table-column fixed prop="show_order" label="展示顺序" width="80"></el-table-column>
                        <el-table-column label="应用名称" width="80">
                          <template slot-scope="codeListScope">
                            <el-input label="app_name" v-model="codeListScope.row.app_name" />
                          </template>
                        </el-table-column>
                        <el-table-column label="数值含义" width="80">
                          <template slot-scope="codeListScope">
                            <el-input label="data_meaning" v-model="codeListScope.row.data_meaning" />
                          </template>
                        </el-table-column>
                        <el-table-column label="展示顺序" width="80">
                          <template slot-scope="codeListScope">
                            <el-input label="show_order" v-model="codeListScope.row.show_order" />
                          </template>
                        </el-table-column>
                      </el-table>
                      <span>
                        <el-button type="primary" @click="saveDictStandardCt">保存</el-button>
                        <el-button @click="modifyDictDialogVisible = false">取消</el-button>
                      </span>
                    </el-dialog>
                  </el-row>
                  <el-row v-if="scope.row.ctType == '自定义'">
                    <el-button @click.native="triggerCustomDict(scope.$index)" type="text">
                      新增自定义字典
                    </el-button>
                    <span>{{ scope.row.ctCode }}</span>
                    <el-dialog title="选项字典设置" :visible.sync="customDictDialogVisible" width="50%" append-to-body>
                      <el-row>
                        <el-col :span="8">名称：<el-input label="dictName" v-model="scope.row.ctName" /></el-col>
                        <el-col :span="8">类型：<el-input label="type" v-model="type" /></el-col>
                        <el-col :span="8">语种：<el-input label="language" v-model="language" /></el-col>
                      </el-row>
                      <el-table :data="customCodeList">
                        <el-table-column label="键值(实际存入的值)" width="80">
                          <template slot-scope="codeListScope">
                            <el-input label="ctKey" v-model="codeListScope.row.ctKey" />
                          </template>
                        </el-table-column>
                        <el-table-column label="描述(展示查看的内容)" width="140">
                          <template slot-scope="codeListScope">
                            <el-input label="description" v-model="codeListScope.row.description" />
                          </template>
                        </el-table-column>
                        <el-table-column label="序号(展示的顺序)" width="80">
                          <template slot-scope="codeListScope">
                            <el-input label="number" v-model="codeListScope.row.number" />
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                          <template slot-scope="codeListScope">
                            <el-button @click.native.prevent="deleteCustomCode(scope.row.ctName, codeListScope.$index)"
                              type="text">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <span><el-button @click="addCustomCode">新增一条</el-button></span>
                      <span>
                        <el-button type="primary" @click="saveCustomDict(scope.row.ctName)">保存</el-button>
                        <el-button @click="customDictDialogVisible = false">取消</el-button>
                      </span>
                    </el-dialog>
                  </el-row>
                  <el-row v-if="scope.row.ctType == '外部'">
                    <el-input placeholder="术语名称" v-model="scope.row.ctName" />
                    <el-input placeholder="版本" v-model="scope.row.ctVersion" />
                    <el-input placeholder="链接" v-model="scope.row.ctLink" />
                  </el-row>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="长度或展示格式" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.length"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数据" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.data">
                <el-option v-for="( item, index ) in  dataList " :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.source">
                <el-option v-for="( item, index ) in  sourceList " :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="域关键变量" width="120">
            <template slot-scope="scope">
              <el-switch v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.isKeyVar" />
            </template>
          </el-table-column>
          <el-table-column label="填充方式" width="120">
            <template slot-scope="scope">
              <el-select v-if="!scope.row.isAddVlm && scope.row.coreDegree == '自定义'" v-model="scope.row.fillMethod">
                <el-option v-for="( item, index ) in  fillMethodList " :key="index" :label="item" :value="index">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="填充方法" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.method"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="aCRF页码" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.acrfPage"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="变量注释" width="120">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.isAddVlm && !scope.row.hasVLM" v-model="scope.row.varComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="有无数据(0/1)" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.hasData">1</el-input>
          </template>
        </el-table-column>
          <!-- <el-table-column label="附件" width="120">
            <template slot-scope="scope">
              <el-upload :ref="'annexUpload' + scope.$index" :headers="headers" action="#"
                :http-request="annexHttpRequest" multiple :limit="1" :auto-upload="false" :file-list="annexFileList">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success"
                  @click="submitUpload(scope.$index)">上传</el-button>
              </el-upload>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.isAddVlm">
                <span v-if="scope.row.isEditCustom || scope.row.isEditVlm">
                  <el-button v-if="scope.row.isEditCustom" @click.native.prevent="handleConfirmAddCustom(scope.$index)"
                    type="text">
                    确定
                  </el-button>
                  <el-button v-if="scope.row.isEditVlm" @click.native.prevent="handleConfirmAddVlm(scope.$index)"
                    type="text">
                    确定
                  </el-button>
                  <el-button @click.native.prevent="handleCancelAdd(scope.$index)" type="text">
                    取消
                  </el-button>
                </span>

                <el-button v-else @click.native.prevent="deleteRow(scope.$index)" type="text">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveVarInfo">保存</el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      projectId: '',
      domainList: [],
      search: '',
      // table展示的变量列表，包括父级和子级
      showList: [],
      // 和后端一样，{varSettingVo，varSettingVoList}
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
        'Assigned',
        'Collected',
        'Derived',
        'Not Available',
        'Predecessor',
        'Protocol'
      ],
      sourceList: [
        '申办方',
        '研究者',
        '供应者',
        '受试者'
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
      annexFileList: [],
      // 文件上传
      headers: {
        "content-type": "multipart/form-data"
      },
      fd: {},
      sdtmVersion: '',
      sheetNameList: [],
      fieldList: [],
      // 正在添加的vlm对应的父变量
      vlmFatherVariable: '',
      // 标准受控术语
      tmpCodeNameList: [],
      tmpCodeList: [],
      codeListNameSelected: undefined,
      modifyDictDialogVisible: false,
      showIndexInModifyDict: undefined,
      // 自定义受控术语
      customDictDialogVisible: false,
      customCodeList: [],
      // dictName: '',
      type: '',
      language: ''
    }
  },
  methods: {
    async initData () {
      this.projectId = sessionStorage.getItem("projectId")
      this.sdtmVersion = sessionStorage.getItem("sdtmig")
      const param = {
        "projectId": this.projectId,
        "sdtmVersion": this.sdtmVersion
      }
      //domainList
      const res = await this.$api.varSetting.queryAllDomain(param)
      this.domainList = res.data.data
    },
    copyVarInfo (varSettingVo, showVar) {
      for (let key in varSettingVo) {
        varSettingVo[key] = showVar[key]
      }
    },
    // 每次调用updateShowList都需先保存回VarInfoList
    saveShowListToVarInfoList () {
      for (let varInfo of this.varInfoList) {
        const varSettingVo = varInfo.varSettingVo
        for (let showVar of this.showList) {
          if (varSettingVo.variable == showVar.variable) {
            this.copyVarInfo(varSettingVo, showVar)
          }
        }
        if (varInfo.varSettingVoList) {
          for (let vlm of varInfo.varSettingVoList) {
            for (let showVar of this.showList) {
              if (vlm.variable == showVar.variable) {
                this.copyVarInfo(vlm, showVar)
              }
            }
          }
        }
      }
    },
    updateShowList () {
      let showList = []
      // 处理值级元数据
      for (let d of this.varInfoList) {
        // console.log(d)
        if (!d.varSettingVo.hasVLM) {
          // 没有值级元数据
          // 直接父变量
          showList.push({
            ...d.varSettingVo
          })
        }
        else {
          // 不能直接用‘=’！，拷贝问题。
          // const vlmVarList = d.varSettingVoList ? d.varSettingVoList : []

          // 应该把对象属性一个个拷贝过来
          const vlmVarList = []
          if (d.varSettingVoList) {
            for (let tempVar of d.varSettingVoList) {
              vlmVarList.push({ ...tempVar })
            }
          }
          // 新增一行“添加VLM”
          const newVar = {}
          for (let key in d.varSettingVo) {
            newVar[key] = ''
          }
          newVar.isAddVlm = true
          vlmVarList.push(newVar)

          // 父变量
          showList.push({
            ...d.varSettingVo
          })
          // 值级元数据直接放在父变量后面
          for (let vlmVar of vlmVarList) {
            showList.push({ ...vlmVar })
          }
        }
      }

      this.showList = showList
    },
    async showVarInfo (domain) {
      if (domain.includes('/')) {
        domain = domain.split('/')[1]
      }
      this.domain = domain

      //varInfoList,和后端一样，{父变量，子变量列表}
      this.varInfoList = (await this.$api.varSetting.queryAllVarInfo({ "domain": domain, "projectId": this.projectId })).data.data
      // 属性
      for (let varInfo of this.varInfoList) {
        const varSettingVo = varInfo.varSettingVo
        // hasVLM
        varSettingVo.hasVLM = varSettingVo.hasVLM == 1 ? true : false
        // isKeyVar
        varSettingVo.isKeyVar = varSettingVo.isKeyVar == 1 ? true : false
        varSettingVo.isAddVlm = false
        varSettingVo.isEditVlm = false
        varSettingVo.isEditCustom = false

        const varSettingVoList = varInfo.varSettingVoList
        if (varSettingVoList) {
          for (let vlmVar of varSettingVoList) {
            // hasVLM
            vlmVar.hasVLM = vlmVar.hasVLM == 1 ? true : false
            // isKeyVar
            vlmVar.isKeyVar = vlmVar.isKeyVar == 1 ? true : false
            vlmVar.isAddVlm = false
            vlmVar.isEditVlm = false
            vlmVar.isEditCustom = false
          }
        }
      }

      this.updateShowList()

      // 查询 表名 列表
      this.sheetNameList = (await this.$api.varSetting.querySheetName({ "domain": domain, "projectId": this.projectId })).data.data

      // console.log('in showVarInfo varInfoList', this.varInfoList)
      // console.log('in showVarInfo showList', this.showList)
    },
    async handleSheetNameChange (sheetName) {
      this.fieldList = (await this.$api.varSetting.queryField({ "sheetName": sheetName, "projectId": this.projectId })).data.data
    },
    async queryCodeList (variable) {
      const param = {
        sdtmVersion: "",
        ctVersion: "",
        projectId: this.projectId,
        domain: this.domain,
        variable: variable
      }
      this.tmpCodeNameList = (await this.$api.varSetting.queryCtInfo(param)).data.data
    },
    async handleChangeCodeListName (codeListName) {
      this.codeListNameSelected = codeListName
      const param = {
        ctVersion: "",
        codeListName: codeListName
      }
      this.tmpCodeList = (await this.$api.varSetting.queryAllCtCode(param)).data.data

    },
    triggerModifyDict (showIndex) {
      this.showIndexInModifyDict = showIndex
      this.modifyDictDialogVisible = true
    },
    saveDictStandardCt () {
      this.showList[this.showIndexInModifyDict].ctCode = this.tmpCodeList.filter(x => x.useFlag).map(x => (x.code+'-'+x.app_name+'-'+x.data_meaning)).join(';')
      this.modifyDictDialogVisible = false
    },
    async triggerCustomDict (showIndex) {
      this.showIndexInCustomDict = showIndex
      const dictName = this.showList[showIndex].ctName
      this.customCodeList = (await this.$api.varSetting.queryCustomCT({ dictName: dictName })).data.data
      this.customDictDialogVisible = true
    },
    addCustomCode () {
      this.customCodeList.push({
        dictName: "",
        type: "",
        language: "",
        ctKey: "",
        description: "",
        number: ""
      })
    },
    deleteCustomCode (ctName, index) {
      this.$api.varSetting.deleteCustomCT({ dictName: ctName, key: this.customCodeList[index].ctKey }).catch(err => { })
      this.customCodeList.splice(index, 1)
    },
    saveCustomDict (ctName) {
      this.customCodeList = this.customCodeList.map(x => {
        return {
          ...x,
          dictName: ctName,
          type: this.type,
          language: this.language
        }
      })
      this.$api.varSetting.saveCustomCT(this.customCodeList).catch(err => { })
      this.showList[this.showIndexInCustomDict].ctCode = this.customCodeList.map(x => (ctName+'-'+x.description+'-'+x.ctKey)).join(';')
      this.customDictDialogVisible = false
    },

    deleteRow (showIndex) {
      this.saveShowListToVarInfoList()
      // 主键variable
      const variable = this.showList[showIndex].variable
      // 变量本身的domain
      const domain = this.showList[showIndex].domain
      const param = {
        "projectId": this.projectId,
        "domain": domain,
        "variable": variable
      }
      // 调用接口删除变量，
      this.$api.varSetting.deleteVar(param).catch(err => { console.log(err) })
      console.log('deleteRow', this.varInfoList)
      // 根据主键variable查找到varInfoList中的变量，variable唯一且不为空
      for (let varIndex in this.varInfoList) {
        if (this.varInfoList[varIndex].varSettingVo.variable == variable) {
          // 删父元素，会把vlm一起删掉
          this.varInfoList.splice(varIndex, 1)
        } else {
          const tempVarSettingVoList = this.varInfoList[varIndex].varSettingVoList
          for (let vlmIndex in tempVarSettingVoList) {
            if (tempVarSettingVoList[vlmIndex].variable == variable) {
              tempVarSettingVoList.splice(vlmIndex, 1)
              console.log('tempVarSettingVoList', tempVarSettingVoList)
            }
          }
        }
      }
      this.updateShowList()

    },
    async clickAddStandardVar () {
      const param = {
        "projectId": this.projectId,
        "sdtmVersion": "",
        "domain": this.domain
      }
      // 查询当前域的所有标准变量
      const standardVarListAll = (await this.$api.varSetting.queryStandardVar(param)).data.data
      // 只显示当前列表未添加的变量（standardVarListAll-varInfoList）
      this.standardVarList = standardVarListAll.filter(x =>
        !this.varInfoList.find(y => y.varSettingVo.variable == x.variable)
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
      this.saveShowListToVarInfoList()
      // 查询要添加的标准变量的信息
      const param = {
        "projectId": this.projectId,
        "sdtmVersion": "",
        "domain": this.domain,
        "ctVersion": "",
        "variable": ""
      }
      for (let variable of this.selectedStandardVars) {
        param.variable = variable
        const standardVarInfo = (await this.$api.varSetting.queryVarInfo(param)).data.data
        // 包装成{varSettingVo，varSettingVoList}
        const varInfo = {
          varSettingVo: standardVarInfo,
          varSettingVoList: null
        }
        this.varInfoList.push(varInfo)
      }
      this.updateShowList()
      this.$refs.popoverRefStandard.doClose()
    },
    cancelAddStandardVar () {
      this.$refs.popoverRefStandard.doClose()
    },
    // 新增自定义变量
    addCustomVar () {
      const newVar = {}
      for (let key in this.showList[0]) {
        newVar[key] = ''
      }
      newVar.projectId = this.projectId
      // 自定义元素domain前加‘SUPP’
      newVar.domain = 'SUPP' + this.domain
      newVar.coreDegree = '自定义'
      newVar.hasVLM = false
      newVar.isKeyVar = false
      newVar.fillMethod = 0
      // 正在编辑
      newVar.isEditCustom = true
      newVar.isEditVlm = false
      newVar.isAddVlm = false

      // 将正在编辑的行添加到showList，variable确定后再加到varInfoList
      this.showList.push(newVar)
    },
    // 确认新增 一行自定义变量
    handleConfirmAddCustom (showIndex) {
      this.saveShowListToVarInfoList()
      // 主键variable确定
      this.showList[showIndex].isEditCustom = false
      // 新增的自定义变量 加到varInfoList
      const newVar = {
        ...this.showList[showIndex]
      }
      this.varInfoList.push(
        {
          varSettingVo: newVar,
          varSettingVoList: null
        }
      )
      this.updateShowList()

      console.log('handleConfirmAddCustom', this.varInfoList)
    },
    // 新增一行vlm
    addVlm (showIndex) {
      // console.log('clickAddVlm')
      // "添加VLM"这一行，变成，新增行
      const newVar = {}
      for (let key in this.showList[0]) {
        newVar[key] = ''
      }
      newVar.projectId = this.projectId
      // vlm的domain和父级元素domain一样
      newVar.domain = this.showList[showIndex].domain
      newVar.hasVLM = false
      newVar.vlm = ''
      newVar.isKeyVar = false
      newVar.fillMethod = 0
      newVar.isAddVlm = false
      newVar.isEditVlm = true
      newVar.isEditCustom = false

      // 将正在编辑的vlm行添加到showList中
      this.showList.splice(showIndex, 0, newVar)

      // 找到这个vlm的父变量
      // 这个vlm的前一行，可能是它的父变量，也可能是它的父变量下的某一个已经添加好（已在varInfoList中）的vlm
      const tempVar = this.showList[showIndex - 1].variable
      for (let varInfo of this.varInfoList) {
        if (varInfo.varSettingVo.variable == tempVar) {
          // 这个vlm的前一行，是它的父变量
          this.vlmFatherVariable = tempVar
        } else {
          // 查找vlm-list中是否有对应的变量
          if (varInfo.varSettingVoList) {
            for (let vlm of varInfo.varSettingVoList) {
              if (vlm.variable == tempVar) {
                this.vlmFatherVariable = varInfo.varSettingVo.variable
              }
            }
          }
        }
      }
    },
    // 确认新增 一行vlm
    handleConfirmAddVlm (showIndex) {
      this.saveShowListToVarInfoList()

      // 主键variable确定
      this.showList[showIndex].isEditVlm = false
      // 新增的vlm 加到varInfoList,父变量的list中
      for (let varInfo of this.varInfoList) {
        if (varInfo.varSettingVo.variable == this.vlmFatherVariable) {
          if (!varInfo.varSettingVoList) {
            varInfo.varSettingVoList = []
          }
          const newVar = {
            ...this.showList[showIndex]
          }
          varInfo.varSettingVoList.push(newVar)
        }
      }
      this.updateShowList()
    },
    // 取消新增 自定义变量/vlm 
    handleCancelAdd (showIndex) {
      this.showList.splice(showIndex, 1)
    },
    changeDataTypeToUpload (varSettingVo, showVar) {
      delete varSettingVo.hasVLM
      varSettingVo.hasVLM = showVar.hasVLM ? 1 : 0
      delete varSettingVo.isKeyVar
      varSettingVo.isKeyVar = showVar.isKeyVar ? 1 : 0
      delete varSettingVo.isEditCustom
      delete varSettingVo.isEditVlm
      delete varSettingVo.isAddVlm
    },
    // 恢复展示时需要的数据类型(bool)
    changeDataTypeToShow (varSettingVo, showVar) {
      // hasVLM
      varSettingVo.hasVLM = showVar.hasVLM == 1 ? true : false
      // isKeyVar
      varSettingVo.isKeyVar = showVar.isKeyVar == 1 ? true : false
      varSettingVo.isAddVlm = showVar.isAddVlm
      varSettingVo.isEditVlm = showVar.isEditVlm
      varSettingVo.isEditCustom = showVar.isEditCustom
    },

    // 上传前，将前端页面showList做的字段修改，对应回varInfoList
    updateVarInfoListBeforeSave () {
      for (let varInfo of this.varInfoList) {
        const varSettingVo = varInfo.varSettingVo
        for (let showVar of this.showList) {
          if (varSettingVo.variable == showVar.variable) {
            this.copyVarInfo(varSettingVo, showVar)
            this.changeDataTypeToUpload(varSettingVo, showVar)
          }
        }
        if (varInfo.varSettingVoList) {
          for (let vlm of varInfo.varSettingVoList) {
            for (let showVar of this.showList) {
              if (vlm.variable == showVar.variable) {
                this.copyVarInfo(vlm, showVar)
                this.changeDataTypeToUpload(vlm, showVar)
              }
            }
          }
        }
      }
    },
    // 上传完vlm之后，要把数据类型恢复成展示所需的
    updateVarInfoListAfterSave () {
      for (let varInfo of this.varInfoList) {
        const varSettingVo = varInfo.varSettingVo
        for (let showVar of this.showList) {
          if (varSettingVo.variable == showVar.variable) {
            this.changeDataTypeToShow(varSettingVo, showVar)
          }
        }
        if (varInfo.varSettingVoList) {
          for (let vlm of varInfo.varSettingVoList) {
            for (let showVar of this.showList) {
              if (vlm.variable == showVar.variable) {
                this.changeDataTypeToShow(vlm, showVar)
              }
            }
          }
        }
      }
    },
    // 设置vlm-list，调用接口
    finishAddVlm (showIndex) {
      this.updateVarInfoListBeforeSave()
      // 根据上一行找到父变量
      let tempFatherVariable
      let tempVarSettingVoList
      const tempVar = this.showList[showIndex - 1].variable
      for (let varInfo of this.varInfoList) {
        if (varInfo.varSettingVo.variable == tempVar) {
          // 前一行，是它的父变量
          tempFatherVariable = tempVar
          tempVarSettingVoList = varInfo.varSettingVoList
        } else {
          // 查找vlm-list中是否有对应的变量
          if (varInfo.varSettingVoList) {
            for (let vlm of varInfo.varSettingVoList) {
              if (vlm.variable == tempVar) {
                tempFatherVariable = varInfo.varSettingVo.variable
                tempVarSettingVoList = varInfo.varSettingVoList
              }
            }
          }
        }
      }

      // api
      const param = {
        "projectId": this.projectId,
        "domain": this.domain,
        "variable": tempFatherVariable,
        "varSettingVoList": tempVarSettingVoList
      }
      console.log(param)
      let that = this
      this.$api.varSetting.setVlm(param).then(res => {
        that.updateVarInfoListAfterSave()
      }).catch(err => { })


    },

    handleChangeHasVlm (showIndex) {

      this.saveShowListToVarInfoList()
      this.updateShowList()


    },
    annexHttpRequest (param) {
      const fd = new FormData()
      const fileObj = param.file
      fd.append('annex', fileObj)
      // this.annexFileList.push({
      //   name: fileObj.name,
      // })
      this.fd = fd

    },

    submitUpload (index) {
      this.$refs['annexUpload' + index].submit()
      const that = this
      this.$api.config.upload(this.fd).then(res => {
        // annex url
        that.varInfoList[index].annex = res.data.data
        console.log(that.varInfoList[index])
      })

    },

    // 每个域都有个保存按钮，调用save接口
    saveVarInfo () {
      this.updateVarInfoListBeforeSave()
      const fatherVarInfoList = this.varInfoList.map(x => x.varSettingVo)
      this.$api.varSetting.save(fatherVarInfoList).catch(err => { })
    },

    // 继续
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