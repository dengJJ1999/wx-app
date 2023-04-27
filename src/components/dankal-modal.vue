<template>
  <transition name="router-fade">
    <section
      class="dankal-modal"
      v-if="value">
      <div
        class="modal-shadows"
        @touchmove.stop="touchmoveHandler"
        @click="isMask ? handlerModalClose() : ''"
        @catchtouchmove="touchmoveHandler"/>
      <div
        class="modal-content"
        :class="direction"
        :style="'background:'+background+';border-radius:'+borderRadius"
        v-if="value">
        <div
          class="modal-close"
          @click="handlerModalClose(true)"
          v-if="buttonCloseAble"/>
        <div
          class="modal-title"
          v-if="title">{{ title }}</div>
        <slot name="content"/>
        <div
          class="modal-close2"
          @click="handlerModalClose(true)"
          v-if="button2CloseAble"/>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    cornerCloseAble: {
      type: Boolean,
      default: true,
    },
    buttonCloseAble: {
      type: Boolean,
      default: false,
    },
    button2CloseAble: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'center',
    },
    background: {
      type: String,
      default: '#FFFFFF',
    },
    borderRadius: {
      type: String,
      default: '0',
    },
    title: {
      type: String,
      default: '',
    },
    isMask: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    touchmoveHandler() {
    },
    handlerModalClose(isButton) {
      console.log("123", this.isMask)
      if (!this.cornerCloseAble && !isButton) return
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss" >
  @import '~@/assets/styles/mixins.scss';
  .dankal-modal {
    @include pos-box(fixed,0,auto,auto,0);
    z-index: 999;
    width: 100%;
    height: 100%;
    .modal-shadows {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      position: absolute;
      &.center{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &.left{
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &.right{
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &.top{
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &.bottom{
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .modal-close {
         @include pos-box(absolute, 0, 0, auto, auto);
         width: 100rpx;
         height: 100rpx;
         background: url('https://qiniu.mctower.runworld.com.cn/static-image/ic_home_mall_order_close.png') no-repeat center;
         background-size: 25rpx 25rpx;
       }
      .modal-close2 {
        width: 80rpx;
        height: 80rpx;
        background: url('https://qiniu.mctower.runworld.com.cn/static-image/ic_pass_close.png') no-repeat center;
        background-size: 100% 100%;
        margin: 60rpx auto;
      }
      .modal-title{
        font-size: 36rpx;
        padding: 52rpx 0;
        text-align: center;
        font-weight: bolder;
        color: #2D506B;
      }
    }
  }
</style>
