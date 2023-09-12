<template>
  <div>
    <el-button-group>
      <el-button @click="handleLastStep" v-show="active != 0">上一步</el-button>
      <el-button type="primary" @click="handleNextStep">保存并继续</el-button>
      <el-button icon="el-icon-close" @click="handleCancel"></el-button>
    </el-button-group>
    <el-steps :active="active" align-center finish-status="success">
      <el-step v-for="(item, index) of stepTitle" :key="index" :title="item.title" :description="item.description"
        :class="stepClassObj(index)" @click.native="handleStep(index)" />
    </el-steps>
    <!-- router-view 子组件发生变化导致父组件发生改变 -->
    <router-view ref="editSteps" />

  </div>
</template>

<script>
export default {
  name: 'MainView',
  components: {
    // ButtonGroup
  },
  data () {
    return {
      // 步骤
      active: 0,
      // 已选步骤
      stepSuccess: new Set([0]),
      // 步骤标题
      stepTitle: [
        {
          title: '配置应用标准',
          description: '说明基本信息，选择应用标准'
        },
        {
          title: '确认应用的域',
          description: '确认数据集标准化之后的域'
        },
        {
          title: '设计数据集变量',
          description: '设计每个域内的相关数据集和变量属性'
        },
        {
          title: '生成Define.xml',
          description: ''
        }
      ],
      routesList: [
        '/config',
        '/confirmDomain',
        '/varSetting',
        '/define'
      ]
    }
  },
  computed: {
    // 动态给步骤加样式
    stepClassObj () {
      return (val) => {
        return {
          stepSuccess: this.stepSuccess.has(val),
          stepErr: !this.stepSuccess.has(val)
        }
      }
    },
  },
  methods: {
    routeDirect () {
      if (this.active == 0 && this.$router.currentRoute.path != this.routesList[0]) {
        this.$router.push(this.routesList[0])
      } else if (this.active == 1 && this.$router.currentRoute.path != this.routesList[1]) {
        this.$router.push(this.routesList[1])
      } else if (this.active == 2 && this.$router.currentRoute.path != this.routesList[2]) {
        this.$router.push(this.routesList[2])
      } else if (this.active == 3 && this.$router.currentRoute.path != this.routesList[3]) {
        this.$router.push(this.routesList[3])
      }
    },
    // 点击步骤条
    handleStep (val) {
      // console.log(val, '点击步骤条')
      if (this.stepSuccess.has(val) === true) {
        this.active = val
        this.routeDirect()
      }
    },
    // 组件点击上一步
    handleLastStep () {
      // console.log(this.active, "上一步")
      if (--this.active <= 0) {
        this.active = 0
      }
      this.routeDirect()
    },
    // 组件点击下一步
    async handleNextStep () {
      console.log(this.$route.path)
      // console.log(this.active, '下一步')
      const valid = await this.$refs.editSteps.submitForm()
      if (valid) {
        this.stepSuccess.add(++this.active)
        this.routeDirect()
      }
    },
    handleCancel () {
      console.log('cancel')
    },
    //监听路径的改变来让步骤条改变
    init () {
      for (let idx in this.routesList) {
        if (this.$route.path == this.routesList[idx]) {
          this.active = Number(idx)
          for (let i = 0; i < idx; i++) {
            this.stepSuccess.add(i)
          }
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.stepSuccess :hover {
  cursor: pointer
}

.stepErr :hover {
  cursor: not-allowed
}
</style>
