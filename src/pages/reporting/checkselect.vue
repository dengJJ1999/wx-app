<template>
  <div
      class="container bg-fff">
    <div
        @click.stop="closeSelect"
        class="box">
      <!-- 面积区间 -->
      <div
          @click.stop="clickAreaOpen"
          class="section">
        <img
            :class="isAreaOpen ? '' : 'rotate180'"
            class="icon-16-12 mr-16 "
            :src="imgDomain + 'static-imageB/grey_arrow@2x.png'"
            alt="">
        <p>面积区间</p>
      </div>
      <!-- 选项 -->
      <div
          v-if="isAreaOpen">
        <div
            v-for="(item, index) in wantAreaList"
            :key="index"
            @tap.stop="clickWantAreaItem(item)"
            :class="item.is_select ? 'select-item' : '' "
            class="select mr-11 mb-20">
          <div class="overflow-hidden-w656">{{item.name}}</div>
        </div>
        <!-- 本地缓存数据  面积区间-->
        <div
            v-for="(item, index) in wantAreaListLocal"
            :key="index"
            @tap.stop="clickWantAreaItem(item)"
            @longpress.stop="longWantArea(index)"
            :class="item.is_select ? 'select-item' : '' "
            class="select mr-11 mb-20">
          <div class="overflow-hidden-w656">{{item.name}}</div>
          <!-- <p>{{item.name}}{{index+1}}</p> -->
          <img
              v-if="item.islong"
              class="triangle"
              :src="imgDomain + 'static-imageB/triangle_shadow.png'"
              alt="">
          <div
              v-if="item.islong"
              class="operation">
            <div
                @click.stop="editWantAreaItem(index)"
                class="item">编辑</div>
            <div class="line"></div>
            <div
                @click.stop="delWantAreaItem(index)"
                class="item">删除</div>
          </div>
        </div>
        <div
            @click.stop="addWantAreaItem"
            class="add mb-20">
          <div class="overflow-hidden-w656">添加选项</div>
        </div>
      </div>
      <!-- 工位区间 -->
      <div
          @click.stop="clickStationOpen"
          class="section">
        <img
            :class="isStationOpen ? '' : 'rotate180'"
            class="icon-16-12 mr-16 "
            :src="imgDomain + 'static-imageB/grey_arrow@2x.png'"
            alt="">
        <p>工位区间</p>
      </div>
      <div v-if="isStationOpen">
        <div
            v-for="(item, index) in wantSeatList"
            :key="index"
            @tap.stop="clickWantSeatItem(item)"
            :class="item.is_select ? 'select-item' : '' "
            class="select mr-11 mb-20">
          <div class="overflow-hidden-w656">{{item.name}}</div>
        </div>
        <!-- 本地缓存数据 工位区间-->
        <div
            v-for="(item, index) in wantSeatListLocal"
            :key="index"
            @tap.stop="clickWantSeatItem(item)"
            @longpress.stop="longWantSeat(index)"
            :class="item.is_select ? 'select-item' : '' "
            class="select mr-11 mb-20">
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
                @click.stop="editWantSeatItem(index)"
                class="item">编辑</div>
            <div class="line"></div>
            <div
                @click.stop="delWantSeatItem(index)"
                class="item">删除</div>
          </div>
        </div>
        <div
            @click.stop="addWantSeatItem"
            class="add mb-20">
          <div class="overflow-hidden-w656">添加选项</div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div
        v-if="popup"
        class="mask">
      <div class="maskBox bg-fff ">
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
    <!-- 底部按钮 -->
    <div class="bottom-box">
      <div class="btnbottombox">
        <div
            @click="clear"
            class="btn-box clear fr-ac-jc">清空</div>
        <div
            @click="submit"
            class="btn-box submit fr-ac-jc">提交</div>
      </div>
      <!-- 适配ios底部安全距离样式 -->
      <div class="bottom-nav"></div>
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
            is_select: false,
            id: 0
          }
        ],
        wantAreaListLocal: [], // 意向面积 放在本地缓存的数据
        wantSeatListLocal: [], // 意向工位 放在本地缓存的数据
        wantAreaList: [], // 意向面积
        wantSeatList: [], // 意向工位
        saveLocalData: '',
        isAdd: true, // true: 新增；flase: 编辑
        popup: false,
        isAreaOpen: true, // 面积区间展开
        isStationOpen: true, // 工位区间展开
        pageType: 1, // 1面积 2工位
        nameArr:[],
      };
    },
    mounted() {
    },
    onLoad(e){
      console.log('选择页', e)
      if(e.name) this.nameArr = e.name.split(',')
      this.network().getCustomList('want_area') // 意向面积
      this.network().getCustomList('want_seat') // 意向工位
      const wantAreaArr = uni.getStorageSync('want_area')
      const wantSeatArr = uni.getStorageSync('want_seat')
      if(wantAreaArr) {
        this.wantAreaListLocal = wantAreaArr
        this.wantAreaListLocal.forEach(item => {
          item.is_select = false
          this.nameArr.forEach(items => {
            if(item.name === items) {
              item.is_select = true
            }
          });
        });
      }
      if(wantSeatArr) {
        this.wantSeatListLocal = wantSeatArr
        this.wantSeatListLocal.forEach(item => {
          item.is_select = false
          this.nameArr.forEach(items => {
            if(item.name === items) {
              item.is_select = true
            }
          });
        });
      }
    },
    methods: {
      // 面积区间
      clickAreaOpen(){
        this.closeSelect()
        this.isAreaOpen = !this.isAreaOpen
      },
      // 工位区间
      clickStationOpen(){
        this.closeSelect()
        this.isStationOpen = !this.isStationOpen
      },
      // 意向面积 长按 WantArea
      longWantArea(index){
        this.closeSelect()
        this.wantAreaListLocal[index].islong = true
        this.wantAreaList.forEach(item => {
          item.is_select = false
        });
        this.wantAreaListLocal.forEach(item => {
          item.is_select = false
        });
        this.wantAreaListLocal[index].is_select = true
        this.pageType = 1
        console.log('长按')
      },
      // 意向工位长按  WantSeat
      longWantSeat(index){
        this.closeSelect()
        this.wantSeatListLocal[index].islong = true
        this.wantSeatList.forEach(item => {
          item.is_select = false
        });
        this.wantSeatListLocal.forEach(item => {
          item.is_select = false
        });
        this.wantSeatListLocal[index].is_select = true
        this.pageType = 2
        console.log('长按')
      },
      // 点击面积子项
      clickWantAreaItem(res){
        console.log('点击面积子项', res)
        this.wantAreaList.forEach(item => {
          item.is_select = false
          if(item.name === res.name) {
            item.is_select = true
          }
        });
        this.wantAreaListLocal.forEach(item => {
          item.is_select = false
          if(item.name === res.name) {
            item.is_select = true
          }
        });
        this.pageType = 1
        this.$forceUpdate()
      },
      // 点击工位子项
      clickWantSeatItem(res){
        console.log('点击工位子项', res)
        this.wantSeatList.forEach(item => {
          item.is_select = false
          if(item.name === res.name) {
            item.is_select = true
          }
        });
        this.wantSeatListLocal.forEach(item => {
          item.is_select = false
          if(item.name === res.name) {
            item.is_select = true
          }
        });
        this.pageType = 2
        this.$forceUpdate()
      },
      // 添加面积本地子项
      addWantAreaItem(index){
        if(this.wantAreaListLocal.length > 50) {
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
        this.pageType = 1
        // console.log('点击添加子项')
      },
      // 添加工位本地子项
      addWantSeatItem(index){
        if(this.wantSeatListLocal.length > 50) {
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
        this.pageType = 2
        // console.log('点击添加子项')
      },
      // 编辑面积本地子项
      editWantAreaItem(index){
        console.log('点击编辑子项')
        this.saveLocalData = this.wantAreaListLocal[Number(index)].name
        this.isAdd = false
        this.popup = true
        this.pageType = 1
        this.closeSelect()
      },
      // 编辑工位本地子项
      editWantSeatItem(index){
        console.log('点击编辑子项')
        this.saveLocalData = this.wantSeatListLocal[Number(index)].name
        this.isAdd = false
        this.popup = true
        this.pageType = 2
        this.closeSelect()
      },
      // 删除面积本地子项
      delWantAreaItem(index){
        console.log('点击删除子项')
        this.wantAreaListLocal.splice(index, 1)
        uni.setStorageSync('want_area', this.wantAreaListLocal)
      },
      // 删除工位本地子项
      delWantSeatItem(index){
        console.log('点击删除子项')
        this.wantSeatListLocal.splice(index, 1)
        uni.setStorageSync('want_seat', this.wantSeatListLocal)
      },
      // 关闭弹窗
      closePopup(){
        this.popup = false
        console.log('点击关闭弹窗')
      },
      // 关闭长按
      closeSelect(){
        this.wantAreaListLocal.forEach(item => {
          if(item.islong) item.islong = false
        })
        this.wantSeatListLocal.forEach(item => {
          if(item.islong) item.islong = false
        })
        console.log('点击关闭长按')
      },
      // 保存按钮
      save(){
        let arr = []
        let mergeArr = []
        // 合并数组做过滤
        if(this.pageType === 1) { // 面积
          mergeArr = this.wantAreaList.concat(this.wantAreaListLocal)
        }
        if(this.pageType === 2) { // 工位
          mergeArr = this.wantSeatList.concat(this.wantSeatListLocal)
        }
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
          if(this.pageType === 1) { // 面积
            this.wantAreaListLocal.push({
              name: this.saveLocalData,
              islong: false,
            })
          }
          if(this.pageType === 2) {// 工位
            this.wantSeatListLocal.push({
              name: this.saveLocalData,
              islong: false,
            })
          }
        } else { // 编辑
          if(this.pageType === 1) { // 面积
            this.wantAreaListLocal.forEach(item => {
              if(item.is_select) {
                item.name = this.saveLocalData
                // item.is_select = false
              }
            });
          }
          if(this.pageType === 2) {// 工位
            this.wantSeatListLocal.forEach(item => {
              if(item.is_select) {
                item.name = this.saveLocalData
                // item.is_select = false
              }
            });
          }
        }
        if(this.pageType === 1) {
          uni.setStorageSync('want_area', this.wantAreaListLocal)
        }
        if(this.pageType === 2) {
          uni.setStorageSync('want_seat', this.wantSeatListLocal)
        }
        this.$forceUpdate()
        this.closePopup()
      },
      // 清空
      clear(){
        this.closePopup()
        this.wantAreaList.forEach(item => {
          item.is_select = false
        });
        this.wantAreaListLocal.forEach(item => {
          item.is_select = false
        });
        this.wantSeatList.forEach(item => {
          item.is_select = false
        });
        this.wantSeatListLocal.forEach(item => {
          item.is_select = false
        });
        this.$forceUpdate()
      },
      // 提交
      submit(){
        let areaObj = ''
        let seatObj = ''
        let areaArr = []
        let seatArr = []
        areaArr = this.wantAreaList.concat(this.wantAreaListLocal)
        seatArr = this.wantSeatList.concat(this.wantSeatListLocal)
        areaArr.forEach(item => {
          if(item.is_select) areaObj = item.name
        });
        seatArr.forEach(item => {
          if(item.is_select) seatObj = item.name
        });
        const obj = `${areaObj}${areaObj&&seatObj ? ',' : ''}${seatObj}`
        console.log('obj', obj)
        uni.$emit('want', obj);
        this.navigateBack(1)
      },
      network() {
        return {
          // 自定义管理
          getCustomList: async (obj) => {
            const data = await getCustomList({
              page_index: 1,
              page_size: 999,
              key: obj,
            })
            if(obj === 'want_area') { // 意向面积
              console.log('意向面积', data)
              this.wantAreaList = data.data.data
              this.wantAreaList.forEach(item => {
                item.is_select = false
                this.nameArr.forEach(items => {
                  if(item.name === items) {
                    item.is_select = true
                  }
                });
              });
            }
            if(obj === 'want_seat') { // 意向工位
              console.log('意向工位', data)
              this.wantSeatList = data.data.data
              this.wantSeatList.forEach(item => {
                item.is_select = false
                this.nameArr.forEach(items => {
                  if(item.name === items) {
                    item.is_select = true
                  }
                });
              });
            }
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
    box-sizing: border-box;
    width: 690rpx;
    height: 100vh;
    overflow: auto;
    padding-bottom: 120rpx;
    // 选中
    .select-item{
      // width: 163rpx;
      // height: 74rpx;
      font-size: 26rpx;
      color: #fff;
      background: #3F456F;
      border-radius: 8rpx;
    }

  }
  // 区间
  .section {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 33rpx;
    font-size: 28rpx;
    color: #333;
    .rotate180 {
      transform: rotate(-90deg);
    }
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
    // padding-top: 18rpx;
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
    height: 72rpx;
    font-size: 22rpx;
    line-height: 30rpx;
    // padding-top: 22rpx;
    padding: 18rpx 12rpx 0 12rpx;
    color: #838383;
    border-radius: 8px;
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
  // 底部按钮
  .bottom-box {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 9;
    display: flex;
    flex-direction: column;
    width: 100vw;
    // height: 98rpx;
    background: #fff;
    .btnbottombox {
      display: flex;
      flex-direction: row;
      height: 98rpx;
    }
    .btn-box {
      flex: 1;
      height: 100%;
    }
    .clear {
      font-size: 32rpx;
      color: #152F56;
      background: #fff;
      box-shadow: 0 -2rpx 24rpx 0 rgba(0, 0, 0, 0.1);
    }
    .submit {
      font-size: 32rpx;
      color: #fff;
      box-shadow: 0 -2rpx 24rpx 0 rgba(0, 0, 0, 0.1);
      background: linear-gradient(315deg, #737BA8 0%, #3F456F 100%)
    }
  }
  .overflow-hidden-w656 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    max-width: 652rpx;
    height: 100%;
    text-align: center;
    // line-height: 37rpx;
  }
</style>
