<template>
  <div
      class="container bg-fff">
    <div
        @click.stop="closeSelect"
        class="box">
      <div
          v-for="(item, index) in selectList"
          :key="index"
          @tap.stop="clickItem(item)"
          class="select mr-11 mb-20">
        <div class="overflow-hidden-w656">{{item.name}}</div>
      </div>
      <!-- 本地缓存数据 -->
      <div
          v-for="(item, index) in selectListLocal"
          :key="index"
          @tap.stop="clickItem(item)"
          @longpress.stop="long(index)"
          class="select mr-11 mb-20">
        <!-- <p>{{item.name}}</p> -->
        <div class="overflow-hidden-w656">{{item.name}}</div>
        <img
            v-if="item.islong"
            class="triangle"
            :src="imgDomain + 'static-imageB/triangle_shadow.png'"
            alt="">
        <div
            v-if="item.islong"
            class="operation">
          <div
              @click.stop="editItem(index)"
              class="item">编辑</div>
          <div class="line"></div>
          <div
              @click.stop="delItem(index)"
              class="item">删除</div>
        </div>
      </div>
      <div
          v-if="isAddBtn"
          @click.stop="addItem"
          class="add mb-20">
        <div class="addtext">添加选项</div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div
        v-if="popup"
        class="mask">
      <div class="maskBox bg-fff">
        <div class="top">
          <p>{{isAdd ? "新增选项" : "编辑选项"}}</p>
          <img
              @tap.stop="closePopup"
              class="closePopup"
              :src="imgDomain + 'static-imageB/black_close.png'"
              alt="">
        </div>
        <!-- 输入框 -->
        <div class="inputbox">
          <input
              type="text"
              v-model="saveLocalData"
              placeholder="请填写选项名称" />
        </div>
        <!-- 样式线 -->
        <div class="line"></div>
        <!-- 按钮 -->
        <div
            @click.stop="save"
            class="save">
          <p>保存</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCustomList, // 自定义管理-列表
  } from '@/api/business'
  export default {
    name: 'index',
    data() {
      return {
        selectList: [
          {
            name: '选项',
            islong: false,
            id: 0
          }
        ],
        selectListLocal: [], // 放在本地缓存的数据
        isAdd: true, // true: 新增；flase: 编辑
        popup: false,
        uuidArr: [],
        saveLocalData: '',
        queryData: {
          page_index: 1,
          page_size: 999,
          key: '',
        },
        index: 0,
        isAddBtn: true, // 是否有添加按钮
      };
    },
    mounted() {
    },
    onLoad(e){
      console.log('选择页', e)
      if(e.keyword) {
        this.queryData.key = e.keyword
        if(e.index) this.index = Number(e.index)
        switch (e.keyword) {
          // 不可本地添加
          case 'want_level': // 意向等级
            this.isAddBtn = false
            break;
          case 'drain_reason': // 流失原因
            this.isAddBtn = false
            break;
          case 'visit_channel': // 来访渠道
            this.isAddBtn = false
            break;
          default:
            break;
        }
      } else {
        return uni.showToast({
          title: '网络错误，请返回上一页',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
      this.network().getCustomList()
      const arr = uni.getStorageSync(e.keyword)
      if(!arr) return console.log('本地无')
      this.selectListLocal = arr
    },
    methods: {
      // 长按
      long(index){
        this.closeSelect()
        this.selectListLocal[Number(index)].islong = true
        this.selectListLocal.forEach(item => {
          item.is_select = false
        });
        this.selectListLocal[Number(index)].is_select = true
        this.$forceUpdate()
      },
      // 点击子项
      clickItem(item){
        console.log('点击子项', this.queryData.key)
        switch (this.queryData.key) {
          case 'visit_channel':
            // 来访渠道
            uni.$emit('visitChannel', item.name);
            break;
          case 'role':
            // 职务
            uni.$emit('role', {
              index: this.index,
              name: item.name,
            });
            break;
          case 'want_level':
            // 意向等级
            uni.$emit('wantLevel', item);
            break;
          case 'drain_reason':
            // 流失原因
            uni.$emit('drainReason', item.name);
            break;
          case 'follow_way':
            // 跟进方式
            uni.$emit('followWay', item.name);
            break;
          case 'industry':
            // 行业类型
            uni.$emit('industry', item.name);
            break;
          case 'employees_num':
            // 员工人数
            uni.$emit('employeesNum', item.name);
            break;
          default:
            break;
        }
        this.navigateBack(1)
      },
      // 添加子项
      addItem(index){
        if(this.selectListLocal.length > 50) {
          return uni.showToast({
            title: '添加字段已到达上限',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
        this.saveLocalData = ''
        this.isAdd = true
        this.popup = true
        // console.log('点击添加子项')
      },
      // 编辑子项
      editItem(index){
        this.saveLocalData = this.selectListLocal[Number(index)].name
        this.isAdd = false
        this.popup = true
        this.closeSelect()
      },
      // 删除子项
      delItem(index){
        this.selectListLocal.splice(index, 1)
        uni.setStorageSync(this.queryData.key, this.selectListLocal)
      },
      // 关闭弹窗
      closePopup(){
        this.popup = false
      },
      // 关闭长按
      closeSelect(){
        this.selectListLocal.forEach(item => {
          if(item.islong) item.islong = false
        })
      },
      // 保存按钮
      save(){
        let arr = []
        let mergeArr = []
        // 合并数组做过滤
        mergeArr = this.selectList.concat(this.selectListLocal)
        console.log('mergeArr', mergeArr)
        arr = mergeArr.filter(item => {
          return item.name === this.saveLocalData
        })
        if(arr.length > 0) {
          return uni.showToast({
            title: '已存在相同名字',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
        // 非空判断
        if(!this.saveLocalData) {
          return uni.showToast({
            title: '字段名不能为空',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
        if(this.isAdd) { // 新增
          this.selectListLocal.push({
            name: this.saveLocalData,
            islong: false,
          })
        } else { // 编辑
          this.selectListLocal.forEach(item => {
            if(item.is_select) {
              item.name = this.saveLocalData
              // item.islong = false
            }
          });
        }
        uni.setStorageSync(this.queryData.key, this.selectListLocal)
        this.closePopup()
      },
      network() {
        return {
          // 自定义管理
          getCustomList: async () => {
            const data = await getCustomList(
              this.queryData
            )
            this.selectList = data.data.data
          },
        };
      },
      handler() {
        return {
          example: () => {
            console.log('handle');
          },
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .container {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    padding: 33rpx 30rpx;
  }
  .box {
    width: 690rpx;
    height: 100vh;
  }
  .select {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    // width: 163rpx;
    min-width: 163rpx;
    height: 74rpx;
    font-size: 26rpx;
    line-height: 37rpx;
    padding: 18rpx 12rpx 0 12rpx;
    color: #838383;
    border-radius: 8px;
    background: #F6F6F6;
    border: 1px solid #F6F6F6;
    .triangle {
      z-index: 10;
      left: 70rpx;
      position: absolute;
      bottom: -14rpx;
      width: 24rpx;
      height: 18rpx;
    }
    .operation {
      z-index: 9;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -164rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 164rpx;
      // height: 170rpx;
      background: #FFFFFF;
      box-shadow: 0rpx -1rpx 8rpx 0rpx rgba(0, 0, 0, 0.1);
      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 164rpx;
        height: 75rpx;
        font-size: 24rpx;
        color: #3f456f;
      }
      .line {
        width: 128rpx;
        height: 2rpx;
        background: rgba(63, 69, 111, 0.08);
      }
    }
  }
  .add {
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    width: 164rpx;
    height: 74rpx;
    font-size: 22rpx;
    line-height: 30rpx;
    // padding-top: 22rpx;
    padding: 18rpx 12rpx 0 12rpx;
    color: #838383;
    border-radius: 8rpx;
    border: 1px solid #979797;
  }
  // 弹窗
  .mask {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(20, 20, 20, 0.3);
    .maskBox {
      position: fixed;
      right: 0;
      bottom: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 750rpx;
      height: 608rpx;
      padding: 34rpx 32rpx;
      .top {
        position: relative;
        display: flex;
        // align-items: center;
        justify-content: center;
        margin-bottom: 92rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        .closePopup {
          position: absolute;
          top: 0;
          right: 0;
          width: 24rpx;
          height: 24rpx;
        }
      }
      .inputbox {
        margin-bottom: 16rpx;
      }
      .line {
        width: 660rpx;
        height: 2rpx;
        margin-bottom: 240rpx;
        background: #e5e5e5;
      }
      // 按钮
      .save {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 686rpx;
        height: 92rpx;
        font-size: 34rpx;
        color: #fff;
        background: linear-gradient(314deg, #737BA8 0%, #3F456F 100%);
        border-radius: 8rpx;
      }
    }
  }
  .overflow-hidden-w656 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    max-width: 652rpx;
    text-align: center;
  }
  .addtext {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    max-width: 652rpx;
    text-align: center;
  }

</style>
