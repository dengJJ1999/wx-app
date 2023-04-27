<template>
  <div class="container-uni">
    <div id="top" class="top">
      <view class="main-content">
        <!-- 状态栏占位 -->
        <view :style="{height: statusBarHeight+'px'}"></view>
        <!-- 导航栏 -->
        <view class="nav-bar" :style="{height: navBarHeigth+'px'}">
          <view class="city" v-if="isShowBack" @click="onBack"><img :src="imgDomain + 'icon_nav_back_dark@2x.png'" alt=""></view>
          <view class="text line-limit">{{name}}</view>
        </view>
      </view>
      <!-- 高度占位 -->
      <view :style="{height: statusBarHeight + navBarHeigth + 'px'}"></view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "top-header",
    data() {
      return {}
    },
    props: {
      name: {
      type: String,
      default: '加载中...'
    },
    isShowBack: {
        type: [Boolean, String],
        default: true
    }
  },
    created() {
    },
    methods: {
      onBack() {
        this.navigateBack(-1)
        // this.backMainActivity()
      }
    }
  }
</script>

<style scoped lang="scss">
.container-uni {
  .top {
    .main-content {
      z-index: 100;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #030316;
      &:after {
        z-index: -1;
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover !important;
        background: url("http://web-sf-shop.oss-cn-shenzhen.aliyuncs.com/all_bg@2x.png") no-repeat;
      }
      .nav-bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 24rpx;
        .city {
          position: absolute;
          left: 0;
          width: 40rpx;
          height: 40rpx;
          img {
            width: 40rpx;
            height: 40rpx;
          }
        }
        .text {
          text-align: center;
          width: 400rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>
