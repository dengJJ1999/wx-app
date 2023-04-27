<template>
  <div class="count-control">
    <div class="btn cut" @click="addValue(-1)"/>
    <div class="val">{{ value }}</div>
    <div class="btn add" @click="addValue(1)"/>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      value: {
        type: Number,
        required: true,
      },
    },
    mounted() {
    },
    methods: {
      addValue(addVal) {
        if (this.value <= 1 && addVal < 0) return
        this.$emit('input', this.value + addVal);
      },
      network() {
        return {
          example: async () => {
            console.log('network');
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
  .count-control{
    display: flex;
    align-items: center;
    .val{
      font-size: 32rpx;
      margin: 0 24rpx;
    }
    .btn{
      width: 56rpx;
      height: 44rpx;
      background-size: 100% 100% !important;
      &.cut{background:url("https://qiniu.fenglou.runworld.com.cn/static-image/ic_cut.png") ;}
      &.add{background:url("https://qiniu.fenglou.runworld.com.cn/static-image/ic_add.png") ;}
    }
  }
</style>
